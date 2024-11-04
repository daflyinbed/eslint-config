import { mergeProcessors } from "eslint-merge-processors";

import { GLOB_VUE } from "../globs";

import { interopDefault } from "../utils";
import type {
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  OptionsStylistic,
  OptionsVue,
  TypedFlatConfigItem,
} from "../types";

export async function vue(
  options: OptionsVue &
    OptionsHasTypeScript &
    OptionsOverrides &
    OptionsStylistic &
    OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_VUE], overrides = {}, vueVersion = 3 } = options;

  const sfcBlocks = options.sfcBlocks === true ? {} : (options.sfcBlocks ?? {});

  const [pluginVue, parserVue, processorVueBlocks] = await Promise.all([
    interopDefault(import("eslint-plugin-vue")),
    interopDefault(import("vue-eslint-parser")),
    interopDefault(import("eslint-processor-vue-blocks")),
  ] as const);

  return [
    {
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          computed: "readonly",
          defineEmits: "readonly",
          defineExpose: "readonly",
          defineProps: "readonly",
          onMounted: "readonly",
          onUnmounted: "readonly",
          reactive: "readonly",
          ref: "readonly",
          shallowReactive: "readonly",
          shallowRef: "readonly",
          toRef: "readonly",
          toRefs: "readonly",
          watch: "readonly",
          watchEffect: "readonly",
        },
      },
      name: "xwbx/vue/setup",
      plugins: {
        vue: pluginVue,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: [".vue"],
          parser: options.typescript
            ? ((await interopDefault(
                import("@typescript-eslint/parser"),
              )) as any)
            : null,
          sourceType: "module",
        },
      },
      name: "xwbx/vue/rules",
      processor:
        sfcBlocks === false
          ? pluginVue.processors[".vue"]
          : mergeProcessors([
              pluginVue.processors[".vue"],
              processorVueBlocks({
                ...sfcBlocks,
                blocks: {
                  styles: true,
                  ...sfcBlocks.blocks,
                },
              }),
            ]),
      rules: {
        ...(pluginVue.configs.base.rules as any),

        ...(vueVersion === 2
          ? {
              ...(pluginVue.configs.essential.rules as any),
              ...(pluginVue.configs["strongly-recommended"].rules as any),
              ...(pluginVue.configs.recommended.rules as any),
            }
          : {
              ...(pluginVue.configs["vue3-essential"].rules as any),
              ...(pluginVue.configs["vue3-strongly-recommended"].rules as any),
              ...(pluginVue.configs["vue3-recommended"].rules as any),
            }),

        "node/prefer-global/process": "off",
        "vue/block-order": [
          "error",
          {
            order: ["template", "script", "style"],
          },
        ],

        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "vue/component-options-name-casing": ["error", "PascalCase"],
        // this is deprecated
        "vue/component-tags-order": "off",
        "vue/custom-event-name-casing": ["error", "camelCase"],
        "vue/define-macros-order": [
          "error",
          {
            order: [
              "defineOptions",
              "defineProps",
              "defineEmits",
              "defineSlots",
            ],
          },
        ],
        "vue/dot-notation": ["error", { allowKeywords: true }],
        "vue/eqeqeq": ["error", "smart"],
        "vue/multi-word-component-names": "off",
        "vue/no-dupe-keys": "off",
        "vue/no-empty-pattern": "error",
        "vue/no-irregular-whitespace": "error",
        "vue/no-loss-of-precision": "error",
        "vue/no-restricted-syntax": [
          "error",
          "DebuggerStatement",
          "LabeledStatement",
          "WithStatement",
        ],
        "vue/no-restricted-v-bind": ["error", "/^v-/"],
        "vue/no-setup-props-reactivity-loss": "off",
        "vue/no-sparse-arrays": "error",
        "vue/no-unused-refs": "error",
        "vue/no-useless-v-bind": "error",
        "vue/no-v-html": "off",
        "vue/object-shorthand": [
          "error",
          "always",
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        "vue/prefer-separate-static-class": "error",
        "vue/prefer-template": "error",
        "vue/prop-name-casing": ["error", "camelCase"],
        "vue/require-default-prop": "off",
        "vue/require-prop-types": "off",

        // conflict with prettier
        "vue/max-len": "off",
        "vue/html-self-closing": "off",
        "vue/html-closing-bracket-newline": "off",
        "vue/html-closing-bracket-spacing": "off",
        "vue/html-end-tags": "off",
        "vue/html-indent": "off",
        "vue/html-quotes": "off",
        "vue/max-attributes-per-line": "off",
        "vue/multiline-html-element-content-newline": "off",
        "vue/mustache-interpolation-spacing": "off",
        "vue/no-multi-spaces": "off",
        "vue/no-spaces-around-equal-signs-in-attribute": "off",
        "vue/singleline-html-element-content-newline": "off",

        "unicorn/filename-case": [
          "error",
          {
            cases: { kebabCase: true, pascalCase: true },
            // ignore: [/^(?!.*\.vue$).*$/],
          },
        ],

        ...overrides,
      },
    },
  ];
}
