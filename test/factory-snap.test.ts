import { expect, it } from "vitest";
import {
  CONFIG_PRESET_FULL_OFF,
  CONFIG_PRESET_FULL_ON,
} from "../src/config-presets";
import { xwbx } from "../src/factory";
import type { OptionsConfig, TypedFlatConfigItem } from "src/types";

interface Suite {
  name: string;
  configs: OptionsConfig;
}

const suites: Suite[] = [
  {
    name: "default",
    configs: {},
  },
  {
    name: "full-off",
    configs: CONFIG_PRESET_FULL_OFF,
  },
  {
    name: "full-on",
    configs: CONFIG_PRESET_FULL_ON,
  },
  {
    name: "javascript-vue",
    configs: {
      typescript: false,
      vue: true,
    },
  },
  {
    name: "pnpm-without-yaml",
    configs: {
      yaml: false,
      pnpm: true,
    },
  },
  {
    name: "pnpm-without-jsonc",
    configs: {
      jsonc: false,
      pnpm: true,
    },
  },
  {
    name: "in-editor",
    configs: {
      isInEditor: true,
    },
  },
];

const ignoreConfigs: string[] = [
  "xwbx/gitignore",
  "xwbx/ignores",
  "xwbx/javascript/setup",
];

function serializeConfigs(configs: TypedFlatConfigItem[]) {
  return configs.map((c) => {
    if (c.name && ignoreConfigs.includes(c.name)) {
      return "<ignored>";
    }
    const clone = { ...c } as any;
    if (c.plugins) {
      clone.plugins = Object.keys(c.plugins);
    }
    if (c.languageOptions) {
      if (
        c.languageOptions.parser &&
        typeof c.languageOptions.parser !== "string"
      ) {
        clone.languageOptions.parser =
          (c.languageOptions.parser as any).meta?.name ??
          (c.languageOptions.parser as any).name ??
          "unknown";
      }
      delete clone.languageOptions.globals;
      if ((c.languageOptions.parserOptions as any)?.parser) {
        delete clone.languageOptions.parserOptions.parser;
      }
    }
    if (c.processor && typeof c.processor !== "string") {
      clone.processor = (c.processor as any).meta?.name ?? "unknown";
    }
    if (c.rules) {
      clone.rules = Object.entries(c.rules).map(([rule, value]) => {
        if (value === "off" || value === 0) return `- ${rule}`;
        return rule;
      });
    }
    return clone;
  });
}

for (const { name, configs } of suites) {
  it(`factory ${name}`, async () => {
    const config = await xwbx(configs);
    await expect(serializeConfigs(config)).toMatchFileSnapshot(
      `./__snapshots__/factory/${name}.ts`,
    );
  });
}
