import { GLOB_SRC, GLOB_SRC_EXT } from "../globs";
import type { TypedFlatConfigItem } from "../types";

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`**/scripts/${GLOB_SRC}`],
      name: "xwbx/disables/scripts",
      rules: {
        "no-console": "off",
        "ts/explicit-function-return-type": "off",
        "unicorn/consistent-function-scoping": "off",
      },
    },
    {
      files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
      name: "xwbx/disables/cli",
      rules: {
        "no-console": "off",
      },
    },
    {
      files: ["**/bin/**/*", `**/bin.${GLOB_SRC_EXT}`],
      name: "xwbx/disables/bin",
      rules: {
        "antfu/no-import-dist": "off",
        "antfu/no-import-node-modules-by-path": "off",
      },
    },
    {
      files: ["**/*.d.?([cm])ts"],
      name: "xwbx/disables/dts",
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "import/no-duplicates": "off",
        "no-restricted-syntax": "off",
        "unused-imports/no-unused-vars": "off",
      },
    },
    {
      files: ["**/*.js", "**/*.cjs"],
      name: "xwbx/disables/cjs",
      rules: {
        "ts/no-require-imports": "off",
      },
    },
    {
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      name: "xwbx/disables/config-files",
      rules: {
        "no-console": "off",
      },
    },
  ];
}
