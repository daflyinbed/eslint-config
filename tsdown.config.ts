import { defineConfig } from "tsdown";
import ApiSnapshot from "tsnapi/rolldown";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  shims: true,
  format: ["esm"],
  exports: true,
  plugins: [
    ApiSnapshot({
      outputDir: "test/__snapshots__/api",
    }),
  ],
});
