import {
  GLOB_ASTRO,
  GLOB_ASTRO_TS,
  GLOB_CSS,
  GLOB_GRAPHQL,
  GLOB_HTML,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_LESS,
  GLOB_MARKDOWN,
  GLOB_POSTCSS,
  GLOB_SCSS,
  GLOB_SRC,
  GLOB_SVG,
  GLOB_VUE,
  GLOB_XML,
} from "../globs";
import { pluginFormat, pluginStylistic } from "../plugins";
import { ensurePackages, isPackageInScope, parserPlain } from "../utils";
import type { OptionsFormatters, TypedFlatConfigItem } from "../types";
import type { Options as PrettierOptions } from "prettier";

export async function formatters(
  options?: OptionsFormatters,
): Promise<TypedFlatConfigItem[]> {
  let prettierOptions: PrettierOptions = {
    tabWidth: 2,
    useTabs: false,
    trailingComma: "all",
    singleQuote: false,
    semi: true,
    endOfLine: "lf",
  };
  const isPrettierPluginXmlInScope = isPackageInScope("@prettier/plugin-xml");
  const defaultOptions = {
    astro: isPackageInScope("prettier-plugin-astro"),
    css: true,
    graphql: true,
    html: true,
    markdown: true,
    slidev: isPackageInScope("@slidev/cli"),
    svg: isPrettierPluginXmlInScope,
    xml: isPrettierPluginXmlInScope,
  };
  if (!options) {
    options = {
      ...defaultOptions,
    };
  } else {
    prettierOptions = {
      ...defaultOptions,
      ...options.prettierOptions,
    };
    options = {
      ...defaultOptions,
      ...options,
    };
  }
  const needPluginXml = options.xml || options.svg;
  await ensurePackages([
    options.markdown && options.slidev ? "prettier-plugin-slidev" : undefined,
    options.astro ? "prettier-plugin-astro" : undefined,
    needPluginXml ? "@prettier/plugin-xml" : undefined,
  ]);

  if (
    options.slidev &&
    options.markdown !== true &&
    options.markdown !== "prettier"
  )
    throw new Error(
      "`slidev` option only works when `markdown` is enabled with `prettier`",
    );

  const prettierXmlOptions = {
    xmlQuoteAttributes: "double",
    xmlSelfClosingSpace: true,
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: "ignore",
  };

  const configs: TypedFlatConfigItem[] = [
    {
      name: "xwbx/formatter/setup",
      plugins: {
        format: pluginFormat,
        style: pluginStylistic,
      },
    },
    {
      files: [GLOB_SRC, GLOB_VUE],
      languageOptions: {
        parser: parserPlain,
      },
      ignores: [`${GLOB_ASTRO}/**`],
      name: "xwbx/formatter/jslike",
      rules: {
        "style/quotes": [
          "error",
          prettierOptions.singleQuote ? "single" : "double",
          { allowTemplateLiterals: false, avoidEscape: true },
        ],
        "format/prettier": ["error", { ...prettierOptions, parser: undefined }],
      },
    },
    {
      files: [GLOB_JSON],
      languageOptions: {
        parser: parserPlain,
      },
      name: "xwbx/formatter/json",
      rules: {
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "json",
          },
        ],
      },
    },
    {
      files: [GLOB_JSONC],
      languageOptions: {
        parser: parserPlain,
      },
      name: "xwbx/formatter/jsonc",
      rules: {
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "jsonc",
          },
        ],
      },
    },
    {
      files: [GLOB_JSON5],
      languageOptions: {
        parser: parserPlain,
      },
      name: "xwbx/formatter/json5",
      rules: {
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "json5",
          },
        ],
      },
    },
  ];

  if (options.css ?? true) {
    configs.push(
      {
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: "xwbx/formatter/css",
        rules: {
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "css",
            },
          ],
        },
      },
      {
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: "xwbx/formatter/scss",
        rules: {
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "scss",
            },
          ],
        },
      },
      {
        files: [GLOB_LESS],
        languageOptions: {
          parser: parserPlain,
        },
        name: "xwbx/formatter/less",
        rules: {
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "less",
            },
          ],
        },
      },
    );
  }

  if (options.html) {
    configs.push({
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserPlain,
      },
      name: "xwbx/formatter/html",
      rules: {
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "html",
          },
        ],
      },
    });
  }

  if (options.xml) {
    configs.push({
      files: [GLOB_XML],
      languageOptions: {
        parser: parserPlain,
      },
      name: "xwbx/formatter/xml",
      rules: {
        "format/prettier": [
          "error",
          {
            ...prettierXmlOptions,
            ...prettierOptions,
            parser: "xml",
            plugins: ["@prettier/plugin-xml"],
          },
        ],
      },
    });
  }

  if (options.svg) {
    configs.push({
      files: [GLOB_SVG],
      languageOptions: {
        parser: parserPlain,
      },
      name: "xwbx/formatter/svg",
      rules: {
        "format/prettier": [
          "error",
          {
            ...prettierXmlOptions,
            ...prettierOptions,
            parser: "xml",
            plugins: ["@prettier/plugin-xml"],
          },
        ],
      },
    });
  }

  if (options.markdown) {
    const GLOB_SLIDEV = !options.slidev
      ? []
      : options.slidev === true
        ? ["**/slides.md"]
        : options.slidev.files;

    configs.push({
      files: [GLOB_MARKDOWN],
      ignores: GLOB_SLIDEV,
      languageOptions: {
        parser: parserPlain,
      },
      name: "xwbx/formatter/markdown",
      rules: {
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            embeddedLanguageFormatting: "off",
            parser: "markdown",
          },
        ],
      },
    });

    if (options.slidev) {
      configs.push({
        files: GLOB_SLIDEV,
        languageOptions: {
          parser: parserPlain,
        },
        name: "xwbx/formatter/slidev",
        rules: {
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              embeddedLanguageFormatting: "off",
              parser: "slidev",
              plugins: ["prettier-plugin-slidev"],
            },
          ],
        },
      });
    }
  }

  if (options.astro) {
    configs.push(
      {
        files: [GLOB_ASTRO],
        languageOptions: {
          parser: parserPlain,
        },
        name: "xwbx/formatter/astro",
        rules: {
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "astro",
              plugins: ["prettier-plugin-astro"],
            },
          ],
        },
      },
      {
        files: [GLOB_ASTRO, GLOB_ASTRO_TS],
        name: "xwbx/formatter/astro/disables",
        rules: {
          "style/arrow-parens": "off",
          "style/block-spacing": "off",
          "style/comma-dangle": "off",
          "style/indent": "off",
          "style/no-multi-spaces": "off",
          "style/quotes": "off",
          "style/semi": "off",
        },
      },
    );
  }

  if (options.graphql) {
    configs.push({
      files: [GLOB_GRAPHQL],
      languageOptions: {
        parser: parserPlain,
      },
      name: "xwbx/formatter/graphql",
      rules: {
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "graphql",
          },
        ],
      },
    });
  }
  return configs;
}
