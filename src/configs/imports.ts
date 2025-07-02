import { pluginAntfu, pluginImportLite } from "../plugins";
import type { OptionsOverrides, TypedFlatConfigItem } from "../types";

export async function imports(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;
  return [
    {
      name: "xwbx/imports/rules",
      plugins: {
        antfu: pluginAntfu,
        import: pluginImportLite,
      },
      rules: {
        "antfu/import-dedupe": "error",
        "antfu/no-import-dist": "error",
        "antfu/no-import-node-modules-by-path": "error",

        "import/consistent-type-specifier-style": ["error", "top-level"],
        "import/first": "error",
        "import/no-duplicates": "error",
        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",

        "import/order": "off",
        // prettier don't do this for me (it reduce empty line count to 1 but don't inject new line)
        "import/newline-after-import": ["error", { count: 1 }],
        ...overrides,
      },
    },
  ];
}
