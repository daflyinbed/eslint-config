import fs from "node:fs/promises";
import { join, resolve } from "node:path";
import { execa } from "execa";
import { glob } from "tinyglobby";
import { afterAll, beforeAll, it } from "vitest";
import type { OptionsConfig, TypedFlatConfigItem } from "../src/types";

const isWindows = process.platform === "win32";
const timeout = isWindows ? 300_000 : 30_000;

beforeAll(async () => {
  await fs.rm("_fixtures", { recursive: true, force: true });
});
afterAll(async () => {
  await fs.rm("_fixtures", { recursive: true, force: true });
});

runWithConfig("all", {
  typescript: true,
  vue: true,
  astro: true,
  formatters: true,
  yaml: true,
});
runWithConfig("no-style", {
  typescript: true,
  vue: true,
  astro: true,
  formatters: false,
  yaml: true,
});
runWithConfig("tab-single-quotes", {
  typescript: true,
  vue: true,
  astro: true,
  yaml: true,
  formatters: {
    prettierOptions: {
      useTabs: true,
      singleQuote: true,
    },
  },
});

// https://github.com/antfu/eslint-config/issues/618
runWithConfig(
  "ts-strict-with-react",
  {
    typescript: {
      tsconfigPath: "./tsconfig.json",
    },
    react: true,
  },
  {
    rules: {
      "ts/no-unsafe-return": ["off"],
    },
  },
);

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

      await fs.cp(from, target, {
        recursive: true,
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

      const files = await glob("**/*", {
        ignore: ["node_modules", "eslint.config.js"],
        cwd: target,
      });

      await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(join(target, file), "utf-8");
          const source = await fs.readFile(join(from, file), "utf-8");
          const outputPath = join(output, file);
          if (content === source) {
            await fs.rm(outputPath, { force: true });
            return;
          }
          await expect.soft(content).toMatchFileSnapshot(join(output, file));
        }),
      );
    },
    timeout,
  );
}
