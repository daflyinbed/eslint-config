//@ts-check
// eslint-disable-next-line antfu/no-import-dist
import { xwbx } from "./dist/index.mjs";

export default xwbx(
  {
    ignores: ["fixtures"],
    typescript: {
      erasableOnly: true,
    },
    vue: {
      a11y: true,
    },
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    unocss: true,
    nextjs: false,
    jsx: {
      a11y: true,
    },
    type: "lib",
    perfectionist: true,
    pnpm: true,
  },
  {
    ignores: ["fixtures", "_fixtures", "**/constants-generated.ts"],
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
