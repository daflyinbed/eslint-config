import { join, resolve } from "node:path";
import { execa } from "execa";
import fg from "fast-glob";
import fs from "fs-extra";
import { afterAll, beforeAll, it } from "vitest";
import type { OptionsConfig, TypedFlatConfigItem } from "../src/types";

beforeAll(async () => {
  await fs.rm("_fixtures", { recursive: true, force: true });
});
afterAll(async () => {
  await fs.rm("_fixtures", { recursive: true, force: true });
});

runWithConfig("all", {
  typescript: true,
  vue: true,
  svelte: true,
  astro: true,
  formatters: true,
});
runWithConfig("no-style", {
  typescript: true,
  vue: true,
  formatters: false,
});
runWithConfig("tab-single-quotes", {
  typescript: true,
  vue: true,
  formatters: {
    prettierOptions: {
      useTabs: true,
      singleQuote: true,
    },
  },
});

function runWithConfig(
  name: string,
  configs: OptionsConfig,
  ...items: TypedFlatConfigItem[]
) {
  it.concurrent(
    name,
    async ({ expect }) => {
      const from = resolve("fixtures/input");
      const output = resolve("fixtures/output", name);
      const target = resolve("_fixtures", name);

      await fs.copy(from, target, {
        filter: (src) => {
          return !src.includes("node_modules");
        },
      });
      await fs.writeFile(
        join(target, "eslint.config.js"),
        `
// @eslint-disable
import xwbx from '@xwbx/eslint-config'

export default xwbx(
  ${JSON.stringify(configs)},
  ...${JSON.stringify(items) ?? []},
)
  `,
      );

      await execa("npx", ["eslint", ".", "--fix"], {
        cwd: target,
        stdio: "pipe",
      });

      const files = await fg("**/*", {
        ignore: ["node_modules", "eslint.config.js"],
        cwd: target,
      });

      await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(join(target, file), "utf-8");
          const source = await fs.readFile(join(from, file), "utf-8");
          const outputPath = join(output, file);
          if (content === source) {
            if (fs.existsSync(outputPath)) await fs.remove(outputPath);
            return;
          }
          await expect.soft(content).toMatchFileSnapshot(join(output, file));
        }),
      );
    },
    30_000,
  );
}
