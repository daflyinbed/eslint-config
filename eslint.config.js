//@ts-check
// eslint-disable-next-line antfu/no-import-dist
import { xwbx } from "./dist/index.js";

export default xwbx({
  ignores: ["fixtures"],
  typescript: true,
  vue: {
    a11y: true,
  },
  react: true,
  astro: true,
  unocss: true,
  jsx: {
    a11y: true,
  },
});
