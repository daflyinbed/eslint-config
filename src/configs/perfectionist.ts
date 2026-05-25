import { pluginPerfectionist } from "../plugins";

import type { OptionsOverrides, TypedFlatConfigItem } from "../types";

export async function perfectionist(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  return [
    {
      name: "xwbx/perfectionist/setup",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        "perfectionist/sort-exports": [
          "error",
          { order: "asc", type: "natural" },
        ],
        "perfectionist/sort-imports": [
          "warn",
          {
            groups: [
              "builtin",
              "external",
              "internal",
              "parent",
              "subpath",
              "sibling",
              "index",
              "style",
              "type",
              "side-effect",
              "side-effect-style",
            ],
            internalPattern: ["^[~@#]/.*"],
            newlinesBetween: "ignore",
            type: "natural",
          },
        ],
        "perfectionist/sort-named-exports": [
          "warn",
          {
            groups: ["value-export", "type-export"],
            type: "natural",
          },
        ],
        "perfectionist/sort-named-imports": [
          "warn",
          {
            groups: ["value-import", "type-import"],
            type: "natural",
          },
        ],

        ...overrides,
      },
    },
  ];
}
