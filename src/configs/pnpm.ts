import { interopDefault } from "../utils";

import type { TypedFlatConfigItem } from "../types";

export async function pnpm(): Promise<TypedFlatConfigItem[]> {
  const [pluginPnpm, yamlParser, jsoncParser] = await Promise.all([
    interopDefault(import("eslint-plugin-pnpm")),
    interopDefault(import("yaml-eslint-parser")),
    interopDefault(import("jsonc-eslint-parser")),
  ]);

  return [
    {
      files: ["package.json", "**/package.json"],
      languageOptions: {
        parser: jsoncParser,
      },
      name: "xwbx/pnpm/package-json",
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        "pnpm/json-enforce-catalog": "error",
        "pnpm/json-prefer-workspace-settings": "error",
        "pnpm/json-valid-catalog": "error",
      },
    },
    {
      files: ["pnpm-workspace.yaml"],
      languageOptions: {
        parser: yamlParser,
      },
      name: "xwbx/pnpm/pnpm-workspace-yaml",
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        "pnpm/yaml-no-duplicate-catalog-item": "error",
        "pnpm/yaml-no-unused-catalog-item": "error",
      },
    },
  ];
}
