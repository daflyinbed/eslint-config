[
  "<ignored>",
  "<ignored>",
  {
    "name": "xwbx/javascript/rules",
    "plugins": [
      "unused-imports",
    ],
    "rules": [
      "accessor-pairs",
      "array-callback-return",
      "block-scoped-var",
      "constructor-super",
      "default-case-last",
      "dot-notation",
      "eqeqeq",
      "new-cap",
      "no-alert",
      "no-array-constructor",
      "no-async-promise-executor",
      "no-caller",
      "no-case-declarations",
      "no-class-assign",
      "no-compare-neg-zero",
      "no-cond-assign",
      "no-console",
      "no-const-assign",
      "no-control-regex",
      "no-debugger",
      "no-delete-var",
      "no-dupe-args",
      "no-dupe-class-members",
      "no-dupe-keys",
      "no-duplicate-case",
      "no-empty",
      "no-empty-character-class",
      "no-empty-pattern",
      "no-eval",
      "no-ex-assign",
      "no-extend-native",
      "no-extra-bind",
      "no-extra-boolean-cast",
      "no-fallthrough",
      "no-func-assign",
      "no-global-assign",
      "no-implied-eval",
      "no-import-assign",
      "no-invalid-regexp",
      "no-irregular-whitespace",
      "no-iterator",
      "no-labels",
      "no-lone-blocks",
      "no-loss-of-precision",
      "no-misleading-character-class",
      "no-invalid-this",
      "no-multi-str",
      "no-new",
      "no-new-func",
      "no-new-native-nonconstructor",
      "no-new-wrappers",
      "no-obj-calls",
      "no-octal",
      "no-octal-escape",
      "no-proto",
      "no-prototype-builtins",
      "no-redeclare",
      "no-regex-spaces",
      "no-restricted-globals",
      "no-restricted-properties",
      "no-restricted-syntax",
      "no-self-assign",
      "no-self-compare",
      "no-sequences",
      "no-shadow-restricted-names",
      "no-sparse-arrays",
      "no-template-curly-in-string",
      "no-this-before-super",
      "no-throw-literal",
      "no-undef",
      "no-undef-init",
      "no-unexpected-multiline",
      "no-unmodified-loop-condition",
      "no-unneeded-ternary",
      "no-unreachable",
      "no-unreachable-loop",
      "no-unsafe-finally",
      "no-unsafe-negation",
      "no-unused-expressions",
      "no-unused-vars",
      "no-use-before-define",
      "no-useless-backreference",
      "no-useless-call",
      "no-useless-catch",
      "no-useless-computed-key",
      "no-useless-constructor",
      "no-useless-rename",
      "no-useless-return",
      "no-var",
      "no-with",
      "object-shorthand",
      "one-var",
      "prefer-arrow-callback",
      "prefer-const",
      "prefer-exponentiation-operator",
      "prefer-promise-reject-errors",
      "prefer-regex-literals",
      "prefer-rest-params",
      "prefer-spread",
      "prefer-template",
      "symbol-description",
      "unicode-bom",
      "unused-imports/no-unused-imports",
      "unused-imports/no-unused-vars",
      "use-isnan",
      "valid-typeof",
      "vars-on-top",
      "yoda",
      "antfu/top-level-function",
    ],
  },
  {
    "name": "xwbx/eslint-comments/rules",
    "plugins": [
      "eslint-comments",
    ],
    "rules": [
      "eslint-comments/no-aggregating-enable",
      "eslint-comments/no-duplicate-disable",
      "eslint-comments/no-unlimited-disable",
      "eslint-comments/no-unused-enable",
    ],
  },
  {
    "name": "xwbx/node",
    "plugins": [
      "node",
    ],
    "rules": [
      "node/handle-callback-err",
      "node/no-deprecated-api",
      "node/no-exports-assign",
      "node/no-new-require",
      "node/no-path-concat",
      "node/no-unsupported-features/es-builtins",
      "node/prefer-global/buffer",
      "node/prefer-global/process",
      "node/process-exit-as-throw",
    ],
  },
  {
    "name": "xwbx/jsdoc",
    "plugins": [
      "jsdoc",
    ],
    "rules": [
      "jsdoc/check-access",
      "jsdoc/check-param-names",
      "jsdoc/check-property-names",
      "jsdoc/check-types",
      "jsdoc/empty-tags",
      "jsdoc/implements-on-classes",
      "jsdoc/no-defaults",
      "jsdoc/no-multi-asterisks",
      "jsdoc/require-param-name",
      "jsdoc/require-property",
      "jsdoc/require-property-description",
      "jsdoc/require-property-name",
      "jsdoc/require-returns-check",
      "jsdoc/require-returns-description",
      "jsdoc/require-yields-check",
    ],
  },
  {
    "name": "xwbx/command/rules",
    "plugins": [
      "command",
    ],
    "rules": [
      "command/command",
    ],
  },
  {
    "name": "xwbx/sort/import",
    "plugins": [
      "perfectionist",
    ],
    "rules": [
      "perfectionist/sort-imports",
      "perfectionist/sort-named-exports",
      "perfectionist/sort-named-imports",
    ],
  },
  {
    "name": "xwbx/formatter/setup",
    "plugins": [
      "format",
      "style",
    ],
  },
  {
    "files": [
      "**/*.?([cm])[jt]s?(x)",
    ],
    "ignores": [
      "**/*.astro/**",
    ],
    "name": "xwbx/formatter/jslike",
    "rules": [
      "style/quotes",
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.vue",
    ],
    "ignores": [
      "**/*.astro/**",
    ],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/vue",
    "rules": [
      "style/quotes",
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.json",
    ],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/json",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.jsonc",
    ],
    "name": "xwbx/formatter/jsonc",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.json5",
    ],
    "name": "xwbx/formatter/json5",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.toml",
    ],
    "name": "xwbx/formatter/toml",
    "rules": [
      "toml/array-bracket-newline",
      "toml/array-bracket-spacing",
      "toml/array-element-newline",
      "toml/indent",
      "toml/inline-table-curly-spacing",
      "toml/key-spacing",
      "toml/padding-line-between-pairs",
      "toml/padding-line-between-tables",
      "toml/quoted-keys",
      "toml/spaced-comment",
      "toml/table-bracket-spacing",
    ],
  },
  {
    "files": [
      "**/*.css",
      "**/*.{p,post}css",
    ],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/css",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.scss",
    ],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/scss",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.less",
    ],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/less",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.htm?(l)",
    ],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/html",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.xml",
    ],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/xml",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.svg",
    ],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/svg",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.md",
    ],
    "ignores": [],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/markdown",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.astro",
    ],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/astro",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.astro",
      "**/*.astro/*.ts",
    ],
    "name": "xwbx/formatter/astro/disables",
    "rules": [
      "- style/arrow-parens",
      "- style/block-spacing",
      "- style/comma-dangle",
      "- style/indent",
      "- style/no-multi-spaces",
      "- style/quotes",
      "- style/semi",
    ],
  },
  {
    "files": [
      "**/*.{g,graph}ql",
    ],
    "languageOptions": {
      "parser": "parser-plain",
    },
    "name": "xwbx/formatter/graphql",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.y?(a)ml",
    ],
    "name": "xwbx/formatter/yaml",
    "rules": [
      "format/prettier",
    ],
  },
  {
    "files": [
      "**/*.?([cm])jsx",
      "**/*.?([cm])tsx",
    ],
    "languageOptions": {
      "parserOptions": {
        "ecmaFeatures": {
          "jsx": true,
        },
      },
    },
    "name": "xwbx/jsx/setup",
    "plugins": [],
    "rules": [],
  },
  {
    "files": [
      "**/scripts/**/*.?([cm])[jt]s?(x)",
    ],
    "name": "xwbx/disables/scripts",
    "rules": [
      "- no-console",
      "- ts/explicit-function-return-type",
      "- unicorn/consistent-function-scoping",
    ],
  },
  {
    "files": [
      "**/cli/**/*.?([cm])[jt]s?(x)",
      "**/cli.?([cm])[jt]s?(x)",
    ],
    "name": "xwbx/disables/cli",
    "rules": [
      "- no-console",
    ],
  },
  {
    "files": [
      "**/bin/**/*",
      "**/bin.?([cm])[jt]s?(x)",
    ],
    "name": "xwbx/disables/bin",
    "rules": [
      "- antfu/no-import-dist",
      "- antfu/no-import-node-modules-by-path",
    ],
  },
  {
    "files": [
      "**/*.d.?([cm])ts",
    ],
    "name": "xwbx/disables/dts",
    "rules": [
      "- eslint-comments/no-unlimited-disable",
      "- import/no-duplicates",
      "- no-restricted-syntax",
      "- unused-imports/no-unused-vars",
    ],
  },
  {
    "files": [
      "**/*.js",
      "**/*.cjs",
    ],
    "name": "xwbx/disables/cjs",
    "rules": [
      "- ts/no-require-imports",
    ],
  },
  {
    "files": [
      "**/*.config.?([cm])[jt]s?(x)",
      "**/*.config.*.?([cm])[jt]s?(x)",
    ],
    "name": "xwbx/disables/config-files",
    "rules": [
      "- no-console",
    ],
  },
]