import { GLOB_SVELTE } from "../globs";
import { ensurePackages, interopDefault } from "../utils";
import type {
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  Rules,
  TypedFlatConfigItem,
} from "../types";

export async function svelte(
  options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_SVELTE], overrides = {} } = options;

  await ensurePackages(["eslint-plugin-svelte"]);

  const [pluginSvelte, parserSvelte] = await Promise.all([
    interopDefault(import("eslint-plugin-svelte")),
    interopDefault(import("svelte-eslint-parser")),
  ] as const);

  return [
    {
      name: "xwbx/svelte/setup",
      plugins: {
        svelte: pluginSvelte,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserSvelte,
        parserOptions: {
          extraFileExtensions: [".svelte"],
          parser: options.typescript
            ? ((await interopDefault(
                import("@typescript-eslint/parser"),
              )) as any)
            : null,
        },
      },
      name: "xwbx/svelte/rules",
      processor: pluginSvelte.processors[".svelte"],
      rules: {
        "no-undef": "off", // incompatible with most recent (attribute-form) generic types RFC
        "no-unused-vars": [
          "error",
          {
            args: "none",
            caughtErrors: "none",
            ignoreRestSiblings: true,
            vars: "all",
            varsIgnorePattern: String.raw`^(\$\$Props$|\$\$Events$|\$\$Slots$)`,
          },
        ],

        ...pluginSvelte.configs.recommended
          .map((config) => config.rules)
          .reduce<Rules>(
            (acc, rules) => ({
              ...acc,
              ...rules,
            }),
            {},
          ),

        "svelte/derived-has-same-inputs-outputs": "off",

        "svelte/html-closing-bracket-spacing": "off",
        "svelte/html-quotes": "off",
        "svelte/indent": "off",
        "svelte/mustache-spacing": "off",
        "svelte/no-spaces-around-equal-signs-in-attribute": "off",
        "svelte/no-trailing-spaces": "off",
        "svelte/spaced-html-comment": "off",
        "unused-imports/no-unused-vars": [
          "error",
          {
            args: "after-used",
            argsIgnorePattern: "^_",
            vars: "all",
            varsIgnorePattern: String.raw`^(_|\$\$Props$|\$\$Events$|\$\$Slots$)`,
          },
        ],

        ...overrides,
      },
    },
  ];
}
