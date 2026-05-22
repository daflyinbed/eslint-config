import { pluginE18e } from "../plugins";

import type {
  OptionsE18e,
  OptionsIsInEditor,
  OptionsProjectType,
  TypedFlatConfigItem,
} from "../types";
import type { Linter } from "eslint";

export async function e18e(
  options: OptionsE18e & OptionsProjectType & OptionsIsInEditor = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    isInEditor = false,
    modernization = true,
    type = "app",
    moduleReplacements = type === "lib" && isInEditor,
    overrides = {},
    performanceImprovements = true,
  } = options;

  const configs = pluginE18e.configs as Record<string, Linter.Config>;

  return [
    {
      name: "xwbx/e18e/rules",
      plugins: {
        e18e: pluginE18e,
      },
      rules: {
        ...(modernization ? { ...configs.modernization.rules } : {}),
        ...(moduleReplacements
          ? Object.fromEntries(
              // moduleReplacements only has e18e/ban-dependencies one rule
              Object.entries(configs.moduleReplacements?.rules ?? {}).map(
                ([key, value]) => [
                  key,
                  value === "error" || value === 2 ? "warn" : value,
                ],
              ),
            )
          : {}),
        ...(performanceImprovements
          ? { ...configs.performanceImprovements?.rules }
          : {}),

        // these are a bit opinionated and dangerous, so we'll disable them for now
        "e18e/prefer-array-to-reversed": "off",
        "e18e/prefer-array-to-sorted": "off",
        "e18e/prefer-array-to-spliced": "off",
        "e18e/prefer-spread-syntax": "off",

        ...overrides,
      },
    },
  ];
}
