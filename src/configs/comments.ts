import { pluginComments } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

export async function comments(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "xwbx/eslint-comments/rules",
      plugins: {
        "eslint-comments": pluginComments,
      },
      rules: {
        ...pluginComments.configs.recommended.rules,
        "eslint-comments/disable-enable-pair": [
          "error",
          { allowWholeFile: true },
        ],

        // common in code generation result
        "eslint-comments/no-unlimited-disable": ["off"],
      },
    },
  ];
}
