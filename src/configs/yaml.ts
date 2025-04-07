import { GLOB_YAML } from "../globs";

import { interopDefault } from "../utils";
import type {
  OptionsFiles,
  OptionsOverrides,
  TypedFlatConfigItem,
} from "../types";

export async function yaml(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_YAML], overrides = {} } = options;

  const [pluginYaml, parserYaml] = await Promise.all([
    interopDefault(import("eslint-plugin-yml")),
    interopDefault(import("yaml-eslint-parser")),
  ] as const);

  return [
    {
      name: "xwbx/yaml/rules",
      files,
      languageOptions: {
        parser: parserYaml,
      },
      plugins: {
        yaml: pluginYaml,
      },
      rules: {
        "style/spaced-comment": "off",

        "yaml/no-empty-key": "error",
        "yaml/no-empty-sequence-entry": "error",
        "yaml/no-irregular-whitespace": "error",
        "yaml/plain-scalar": "error",

        "yaml/vue-custom-block/no-parsing-error": "error",

        ...overrides,
      },
    },
    {
      files: ["pnpm-workspace.yaml"],
      name: "xwbx/yaml/pnpm-workspace",
      rules: {
        "yaml/sort-keys": [
          "error",
          {
            order: [
              "packages",
              "overrides",
              "patchedDependencies",
              "hoistPattern",
              "catalog",
              "catalogs",

              "allowedDeprecatedVersions",
              "allowNonAppliedPatches",
              "configDependencies",
              "ignoredBuiltDependencies",
              "ignoredOptionalDependencies",
              "neverBuiltDependencies",
              "onlyBuiltDependencies",
              "onlyBuiltDependenciesFile",
              "packageExtensions",
              "peerDependencyRules",
              "supportedArchitectures",
            ],
            pathPattern: "^$",
          },
          {
            order: { type: "asc" },
            pathPattern: ".*",
          },
        ],
      },
    },
  ];
}
