import { GLOB_TESTS } from "../globs";
import { interopDefault } from "../utils";
import type {
  OptionsFiles,
  OptionsIsInEditor,
  OptionsOverrides,
  TypedFlatConfigItem,
} from "../types";

// Hold the reference so we don't redeclare the plugin on each call
let _pluginTest: any;

export async function test(
  options: OptionsFiles & OptionsIsInEditor & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const { files = GLOB_TESTS, isInEditor = false, overrides = {} } = options;

  const [pluginVitest, pluginNoOnlyTests] = await Promise.all([
    interopDefault(import("@vitest/eslint-plugin")),
    // @ts-expect-error missing types
    interopDefault(import("eslint-plugin-no-only-tests")),
  ] as const);

  _pluginTest = _pluginTest || {
    ...pluginVitest,
    rules: {
      ...pluginVitest.rules,
      // extend `test/no-only-tests` rule
      ...pluginNoOnlyTests.rules,
    },
  };

  return [
    {
      name: "xwbx/test",
      plugins: {
        test: _pluginTest,
      },
      files,
      rules: {
        "test/consistent-test-it": [
          "error",
          { fn: "it", withinDescribe: "it" },
        ],
        "test/no-identical-title": "error",
        "test/no-import-node-test": "error",
        "test/no-only-tests": isInEditor ? "warn" : "error",

        "test/prefer-hooks-in-order": "error",
        "test/prefer-lowercase-title": "error",

        // Disables
        ...{
          "unicorn/consistent-function-scoping": "off",
          "antfu/no-top-level-await": "off",
          "no-unused-expressions": "off",
          "node/prefer-global/process": "off",
          "ts/explicit-function-return-type": "off",
        },

        ...overrides,
      },
    },
  ];
}
