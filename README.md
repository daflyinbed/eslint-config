# @xwbx/eslint-config

A opinionated ESLint config preset for JavaScript, TypeScript, Vue 2 or Vue 3,
and Prettier.

## Features

- Format with Prettier.
- Designed to work with TypeScript, Vue 2 and 3 out-of-box.
- Support Astro, JSON(5), YAML, Markdown, ...
- Sort imports, `package.json`, `tsconfig.json`...
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Ignores common files like `dist`, `node_modules`, `coverage`, and files in `.gitignore`.
- Reasonable defaults, best practices, only one-line of config
- Reasonable strict, but with better code quality.
- Requires ESLint v9.10.0+

## Install

```bash
npm i -D @xwbx/eslint-config
```

Require Node.js >= 18.18, and ESLint >= 9.5.0.

## Usage

```js
import { xwbx } from "@xwbx/eslint-config";
export default xwbx(
  {
    // TypeScript, Vue, Unocss And Astro are autodetected, you can also explicitly enable them:
    typescript: true,
    vue: true,
    unocss: true,
    astro: true,
    // Disable jsonc yaml and toml support
    jsonc: false,
    yaml: false,
    toml: false,
    // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
    ignores: [
      "**/fixtures",
      // ...globs
    ],
  },
  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ["**/*.ts"],
    rules: {},
  },
);
```

### Unocss

Unocss support is detected automatically by checking if `unocss`or`@unocss/webpack`or`@unocss/nuxt'` is installed in your project. You can also explicitly enable/disable it:

```js
// eslint.config.js
import xwbx from "@xwbx/eslint-config";

export default xwbx({
  unocss: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
pnpm i -D @unocss/eslint-plugin
```

### Astro

Astro support is detected automatically by checking if `astro` is installed in your project. You can also explicitly enable/disable it:

```js
// eslint.config.js
import xwbx from "@xwbx/eslint-config";

export default xwbx({
  astro: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
pnpm i -D astro-eslint-parser eslint-plugin-astro prettier-plugin-astro
```

### Prettier

Default option is

```js
const prettierOptions = {
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
  singleQuote: false,
  semi: true,
  endOfLine: "lf",
};
```

Override by formatters.prettierOptions

```js
// eslint.config.js
export default xwbx({
  formatters: {
    prettierOptions: {
      semi: false,
    },
  },
});
```

### `perfectionist` (sorting)

This plugin [`eslint-plugin-perfectionist`](https://github.com/azat-io/eslint-plugin-perfectionist) allows you to sort object keys, imports, etc, with auto-fix.

The plugin is installed, but only `perfectionist/sort-imports`, `perfectionist/sort-named-exports` and `perfectionist/sort-named-imports` are enabled by default.

It's recommended to opt-in on each file individually using [configuration comments](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments-1).

```js
/* eslint perfectionist/sort-exports: "error" */
export * from "./astro";
export * from "./command";
export * from "./comments";
```

### `command`

Powered by [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command). It is not a typical rule for linting, but an on-demand micro-codemod tool that triggers by specific comments.

For a few triggers, for example:

- `/// to-function` - converts an arrow function to a normal function
- `/// to-arrow` - converts a normal function to an arrow function
- `/// to-for-each` - converts a for-in/for-of loop to `.forEach()`
- `/// to-for-of` - converts a `.forEach()` to a for-of loop
- `/// keep-sorted` - sorts an object/array/interface
- ... etc. - refer to the [documentation](https://github.com/antfu/eslint-plugin-command#built-in-commands)

You can add the trigger comment one line above the code you want to transform, for example (note the triple slash):

<!-- eslint-skip -->

```ts
/// to-function
const foo = async (msg: string): void => {
  console.log(msg)
}
```

Will be transformed to this when you hit save with your editor or run `eslint . --fix`:

```ts
async function foo(msg: string): void {
  console.log(msg);
}
```

The command comments are usually one-off and will be removed along with the transformation.

### Plugins Renaming

Since flat config requires us to explicitly provide the plugin names (instead of the mandatory convention from npm package name), we renamed some plugins to make the overall scope more consistent and easier to write.

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `import-lite/*`        | [eslint-plugin-import-lite](https://github.com/9romise/eslint-plugin-import-lite)          |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |
| `test/*`   | `vitest/*`             | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)  |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### Editor Specific Disables

Auto-fixing for the following rules are disabled when ESLint is running in a code editor:

- [`prefer-const`](https://eslint.org/docs/rules/prefer-const)
- [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports)
- [`test/no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests)

Since v0.4.0, they are no longer disabled, but made non-fixable using [this helper](https://github.com/antfu/eslint-flat-config-utils#composerdisablerulesfix).

This is to prevent unused imports from getting removed by the editor during refactoring to get a better developer experience. Those rules will be applied when you run ESLint in the terminal or [Lint Staged](#lint-staged). If you don't want this behavior, you can disable them:

```js
// eslint.config.js
import xwbx from "@xwbx/eslint-config";

export default xwbx({
  isInEditor: false,
});
```

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import xwbx from "@xwbx/eslint-config";

export default xwbx(
  {
    vue: true,
    typescript: true,
  },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ["**/*.vue"],
    rules: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      "style/semi": ["error", "never"],
    },
  },
);
```

We also provided the `overrides` options in each integration to make it easier:

```js
// eslint.config.js
import xwbx from "@xwbx/eslint-config";

export default xwbx({
  vue: {
    overrides: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
  typescript: {
    overrides: {
      "ts/consistent-type-definitions": ["error", "interface"],
    },
  },
  yaml: {
    overrides: {
      // ...
    },
  },
});
```

### Vue

Vue support is detected automatically by checking if `vue` is installed in your project. You can also explicitly enable/disable it:

```js
// eslint.config.js
import xwbx from "@xwbx/eslint-config";

export default xwbx({
  vue: true,
});
```

#### Vue 2

We have limited support for Vue 2 (as it's already [reached EOL](https://v2.vuejs.org/eol/)). If you are still using Vue 2, you can configure it manually by setting `vueVersion` to `2`:

```js
// eslint.config.js
import xwbx from "@xwbx/eslint-config";

export default xwbx({
  vue: {
    vueVersion: 2,
  },
});
```

As it's in maintenance mode, we only accept bug fixes for Vue 2. It might also be removed in the future when `eslint-plugin-vue` drops support for Vue 2. We recommend upgrading to Vue 3 if possible.

#### Vue Accessibility

To enable Vue accessibility support, you need to explicitly turn it on:

```js
// eslint.config.js
import xwbx from "@xwbx/eslint-config";

export default xwbx({
  vue: {
    a11y: true,
  },
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-vuejs-accessibility
```

## VSCode

Enable flat config if you are using ESLint < 9.

```jsonc
{
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "eslint.experimental.useFlatConfig": true,
  "eslint.useFlatConfig": true,
  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never",
  },
  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "svg",
    "gql",
    "graphql",
    "astro",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss",
  ],
}
```

## Credits

This setup is heavily inspired on a few projects:

- [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- [@sxzz/eslint-config](https://github.com/sxzz/eslint-config)
