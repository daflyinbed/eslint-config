import fs from "node:fs/promises";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import {
  astro,
  combine,
  command,
  comments,
  formatters,
  imports,
  javascript,
  jsonc,
  jsx,
  markdown,
  node,
  regexp,
  sortImport,
  sortPackageJson,
  sortTsconfig,
  test,
  toml,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from "../src";

const configs = await combine(
  {
    plugins: {
      "": {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  command(),
  formatters(),
  astro(),
  comments(),
  imports(),
  javascript(),
  jsx(),
  jsonc(),
  markdown(),
  node(),
  sortPackageJson(),
  sortImport(),
  sortTsconfig(),
  test(),
  toml(),
  regexp(),
  typescript(),
  unicorn(),
  unocss(),
  vue(),
  yaml(),
);

const configNames = configs.map((i) => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", dts);
