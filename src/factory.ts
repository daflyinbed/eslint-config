import { FlatConfigComposer } from "eslint-flat-config-utils";

import { isPackageExists } from "local-pkg";
import {
  astro,
  command,
  comments,
  disables,
  formatters,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  node,
  pnpm,
  react,
  regexp,
  sortImport,
  sortPackageJson,
  sortTsconfig,
  test,
  toml,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from "./configs";
import { interopDefault, isInEditorEnv } from "./utils";
import type { RuleOptions } from "./typegen";
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from "./types";
import type { Linter } from "eslint";

const flatConfigProps = [
  "name",
  "languageOptions",
  "linterOptions",
  "processor",
  "plugins",
  "rules",
  "settings",
] satisfies (keyof TypedFlatConfigItem)[];

const VuePackages = ["vue", "nuxt", "vitepress", "@slidev/cli"];
const UnocssPackages = ["unocss", "@unocss/webpack", "@unocss/nuxt"];

export const defaultPluginRenaming = {
  "@eslint-react": "react",
  "@eslint-react/dom": "react-dom",
  "@eslint-react/hooks-extra": "react-hooks-extra",
  "@eslint-react/naming-convention": "react-naming-convention",

  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "import-lite": "import",
  n: "node",
  vitest: "test",
  yml: "yaml",
};

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<FlatConfigComposer<TypedFlatConfigItem, ConfigNames>>}
 *  The merged ESLint configurations.
 */
export function xwbx(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
  ...userConfigs: Awaitable<
    | TypedFlatConfigItem
    | TypedFlatConfigItem[]
    | FlatConfigComposer<any, any>
    | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    astro: enableAstro = isPackageExists("astro"),
    autoRenamePlugins = true,
    componentExts = [],
    gitignore: enableGitignore = true,
    imports: enableImports = true,
    jsx: enableJsx = true,
    pnpm: enableCatalogs = false,
    react: enableReact = false,
    regexp: enableRegexp = true,
    // solid: enableSolid = false,
    // svelte: enableSvelte = false,
    typescript: enableTypeScript = isPackageExists("typescript"),
    unicorn: enableUnicorn = true,
    unocss: enableUnoCSS = UnocssPackages.some((i) => isPackageExists(i)),
    vue: enableVue = VuePackages.some((i) => isPackageExists(i)),
  } = options;

  let isInEditor = options.isInEditor;
  if (isInEditor == null) {
    isInEditor = isInEditorEnv();
    if (isInEditor)
      // eslint-disable-next-line no-console
      console.log(
        "[@xwbx/eslint-config] Detected running in editor, some rules are disabled.",
      );
  }

  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== "boolean") {
      configs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then((r) => [
          r(enableGitignore),
        ]),
      );
    } else {
      configs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then((r) => [
          r({ strict: false }),
        ]),
      );
    }
  }

  const typescriptOptions = resolveSubOptions(options, "typescript");
  const tsconfigPath =
    "tsconfigPath" in typescriptOptions
      ? typescriptOptions.tsconfigPath
      : undefined;

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      isInEditor,
      overrides: getOverrides(options, "javascript"),
    }),
    comments(),
    node(),
    jsdoc(),
    command(),

    sortImport(),
  );
  if (options.formatters ?? true) {
    configs.push(
      formatters(
        typeof options.formatters === "object" ? options.formatters : undefined,
      ),
    );
  }
  if (enableImports) {
    configs.push(imports(enableImports === true ? {} : enableImports));
  }

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn));
  }

  if (enableVue) {
    componentExts.push("vue");
  }

  if (enableJsx) {
    configs.push(jsx(enableJsx === true ? {} : enableJsx));
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts,
        overrides: getOverrides(options, "typescript"),
        type: options.type,
      }),
    );
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === "boolean" ? {} : enableRegexp));
  }

  if (options.test ?? true) {
    configs.push(
      test({
        isInEditor,
        overrides: getOverrides(options, "test"),
      }),
    );
  }

  if (enableVue) {
    configs.push(
      vue({
        ...resolveSubOptions(options, "vue"),
        overrides: getOverrides(options, "vue"),
        typescript: !!enableTypeScript,
      }),
    );
  }

  if (enableReact) {
    configs.push(
      react({
        ...typescriptOptions,
        overrides: getOverrides(options, "react"),
        tsconfigPath,
      }),
    );
  }

  // if (enableSolid) {
  //   configs.push(solid({
  //     overrides: getOverrides(options, 'solid'),
  //     tsconfigPath,
  //     typescript: !!enableTypeScript,
  //   }))
  // }

  // if (enableSvelte) {
  //   configs.push(svelte({
  //     overrides: getOverrides(options, 'svelte'),
  //     stylistic: stylisticOptions,
  //     typescript: !!enableTypeScript,
  //   }))
  // }

  if (enableUnoCSS) {
    configs.push(
      unocss({
        ...resolveSubOptions(options, "unocss"),
        overrides: getOverrides(options, "unocss"),
      }),
    );
  }

  if (enableAstro) {
    configs.push(
      astro({
        overrides: getOverrides(options, "astro"),
      }),
    );
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, "jsonc"),
      }),
      sortPackageJson(),
      sortTsconfig(),
    );
  }

  if (enableCatalogs) {
    configs.push(pnpm());
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        overrides: getOverrides(options, "yaml"),
      }),
    );
  }

  if (options.toml ?? true) {
    configs.push(
      toml({
        overrides: getOverrides(options, "toml"),
      }),
    );
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown({
        componentExts,
        overrides: getOverrides(options, "markdown"),
      }),
    );
  }

  configs.push(disables());

  if ("files" in options) {
    throw new Error(
      '[@xwbx/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
    );
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) acc[key] = options[key] as any;
    return acc;
  }, {} as TypedFlatConfigItem);
  if (Object.keys(fusedConfig).length > 0) {
    configs.push([fusedConfig]);
  }

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer.append(...configs, ...(userConfigs as any));

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming);
  }
  if (isInEditor) {
    composer = composer.disableRulesFix(
      [
        "unused-imports/no-unused-imports",
        "test/no-only-tests",
        "prefer-const",
      ],
      {
        builtinRules: () =>
          import(["eslint", "use-at-your-own-risk"].join("/")).then(
            (r) => r.builtinRules,
          ),
      },
    );
  }
  return composer;
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === "boolean"
    ? ({} as any)
    : options[key] || ({} as any);
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);
  return {
    ...("overrides" in sub ? sub.overrides : {}),
  };
}
