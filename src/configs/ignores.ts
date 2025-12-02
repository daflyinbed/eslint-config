import { GLOB_EXCLUDE } from "../globs";

import type { TypedFlatConfigItem } from "../types";

export async function ignores(
  userIgnores: string[] | ((originals: string[]) => string[]) = [],
): Promise<TypedFlatConfigItem[]> {
  let ignores = [...GLOB_EXCLUDE];

  if (typeof userIgnores === "function") {
    ignores = userIgnores(ignores);
  } else {
    ignores = [...ignores, ...userIgnores];
  }

  return [
    {
      ignores,
      name: "antfu/ignores",
    },
  ];
}
