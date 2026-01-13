# 技术层面的详细差异对比

## 1. 项目结构对比

### 源代码目录结构

#### 本仓库 (@xwbx/eslint-config v0.11.0)
```
src/
├── configs/
│   ├── astro.ts
│   ├── command.ts
│   ├── comments.ts
│   ├── disables.ts
│   ├── formatters.ts
│   ├── ignores.ts
│   ├── imports.ts
│   ├── index.ts
│   ├── javascript.ts
│   ├── jsdoc.ts
│   ├── jsonc.ts
│   ├── jsx.ts
│   ├── markdown.ts
│   ├── node.ts
│   ├── pnpm.ts
│   ├── react.ts
│   ├── regexp.ts
│   ├── sort.ts          ← 本仓库特有
│   ├── test.ts
│   ├── toml.ts
│   ├── typescript.ts
│   ├── unicorn.ts
│   ├── unocss.ts
│   ├── vue.ts
│   └── yaml.ts
├── factory.ts
├── globs.ts
├── index.ts
├── plugins.ts
├── types.ts
└── utils.ts
```

#### 上游 (@antfu/eslint-config v6.7.3)
```
src/
├── cli/                     ← 上游独有 (CLI 工具)
│   ├── constants-generated.ts
│   ├── constants.ts
│   ├── index.ts
│   ├── run.ts
│   ├── stages/
│   ├── types.ts
│   └── utils.ts
├── configs/
│   ├── astro.ts
│   ├── command.ts
│   ├── comments.ts
│   ├── disables.ts
│   ├── formatters.ts
│   ├── ignores.ts
│   ├── imports.ts
│   ├── index.ts
│   ├── javascript.ts
│   ├── jsdoc.ts
│   ├── jsonc.ts
│   ├── jsx.ts
│   ├── markdown.ts
│   ├── nextjs.ts         ← 上游独有
│   ├── node.ts
│   ├── perfectionist.ts  ← 上游独有
│   ├── pnpm.ts
│   ├── react.ts
│   ├── regexp.ts
│   ├── solid.ts          ← 上游独有
│   ├── sort.ts
│   ├── stylistic.ts      ← 上游独有
│   ├── svelte.ts         ← 上游独有
│   ├── test.ts
│   ├── toml.ts
│   ├── typescript.ts
│   ├── unicorn.ts
│   ├── unocss.ts
│   ├── vue.ts
│   └── yaml.ts
├── cli.ts                ← 上游独有
├── config-presets.ts     ← 上游独有
├── factory.ts
├── globs.ts
├── index.ts
├── plugins.ts
├── types.ts
├── utils.ts
└── vender/
    └── prettier-types.ts
```

## 2. package.json 核心差异

### 脚本命令对比

| 命令 | 本仓库 | 上游 | 说明 |
|------|--------|------|------|
| build | `pnpm run typegen && tsup --clean --dts` | `nr gen && tsdown --clean --dts` | 构建工具不同 |
| stub | `tsup` | `tsdown` | 构建工具不同 |
| dev | `npx @eslint/config-inspector --host 0.0.0.0` | `npx @eslint/config-inspector --config eslint.config.ts` | 配置方式不同 |
| gen | `tsx scripts/typegen.ts` | `tsx scripts/typegen.ts && tsx scripts/versiongen.ts` | 上游多一个版本生成 |
| prepare | `node .husky/install.mjs` | `simple-git-hooks` | Git hooks 工具不同 |

### 导出字段对比

#### 本仓库
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js"
    }
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

#### 上游
```json
{
  "exports": {
    ".": "./dist/index.mjs",
    "./cli": "./dist/cli.mjs",
    "./package.json": "./package.json"
  },
  "main": "./dist/index.mjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.mts",
  "bin": "./bin/index.mjs"
}
```

**差异**：
- 上游导出 CLI 工具
- 上游使用 `.mjs` 和 `.mts` 扩展名
- 上游有 `bin` 字段（CLI 可执行文件）

### peerDependencies 对比

#### 本仓库特有
```json
{
  "eslint-plugin-vuejs-accessibility": "^2.4.1"
}
```

#### 上游特有
```json
{
  "@next/eslint-plugin-next": ">=15.0.0",
  "eslint-plugin-format": ">=0.1.0",
  "eslint-plugin-solid": "^0.14.3",
  "eslint-plugin-svelte": ">=2.35.1",
  "prettier-plugin-slidev": "^1.0.5",
  "svelte-eslint-parser": ">=0.37.0"
}
```

### dependencies 对比

#### 上游新增
```json
{
  "ansis": "catalog:prod",
  "cac": "catalog:prod"
}
```

#### 本仓库缺少
- 上游移除了 `prettier`，使用 `eslint-plugin-format` 代替
- 本仓库保留 `prettier` 作为直接依赖

## 3. 核心配置差异

### factory.ts 主函数签名

#### 本仓库
```typescript
export function xwbx(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
  ...userConfigs: Awaitable<
    | TypedFlatConfigItem
    | TypedFlatConfigItem[]
    | FlatConfigComposer<any, any>
    | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames>
```

#### 上游
```typescript
export function antfu(
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files' | 'ignores'> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames>
```

**差异**：
- 函数名不同 (`xwbx` vs `antfu`)
- 上游排除了 `ignores`，提供更灵活的 ignores 配置

### 默认选项差异

#### 本仓库默认值
```typescript
{
  astro: isPackageExists("astro"),
  autoRenamePlugins: true,
  gitignore: true,
  imports: true,
  jsx: true,
  pnpm: false,              // 默认关闭
  react: false,             // 默认关闭
  regexp: true,
  // 缺少 nextjs, solid, svelte 选项
}
```

#### 上游默认值
```typescript
{
  astro: false,              // 默认关闭
  autoRenamePlugins: true,
  gitignore: true,
  imports: true,
  jsdoc: true,               // 本仓库可能没有
  jsx: true,
  nextjs: false,
  node: true,
  pnpm: !!findUpSync('pnpm-workspace.yaml'),  // 自动检测
  // 更多框架选项
}
```

### 插件重命名映射

#### 本仓库
```typescript
export const defaultPluginRenaming = {
  "@eslint-react": "react",
  "@eslint-react/dom": "react-dom",
  "@eslint-react/hooks-extra": "react-hooks-extra",
  "@eslint-react/naming-convention": "react-naming-convention",
  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "import-lite": "import",
  "n": "node",
  "vitest": "test",
  "yml": "yaml",
};
```

#### 上游
```typescript
export const defaultPluginRenaming = {
  '@eslint-react': 'react',
  '@eslint-react/dom': 'react-dom',
  '@eslint-react/hooks-extra': 'react-hooks-extra',
  '@eslint-react/naming-convention': 'react-naming-convention',
  '@next/next': 'next',      // 本仓库缺少
  '@stylistic': 'style',
  '@typescript-eslint': 'ts',
  'import-lite': 'import',
  'n': 'node',
  'vitest': 'test',
  'yml': 'yaml',
}
```

## 4. 格式化配置差异

### Prettier 选项

#### 本仓库 (在 configs/formatters.ts)
```typescript
const prettierOptions = {
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
  singleQuote: false,     // 双引号
  semi: true,              // 使用分号
  endOfLine: "lf",
}
```

#### 上游
使用 `eslint-plugin-format` 而不是直接使用 Prettier，默认风格：
- 单引号 (single quotes)
- 不使用分号 (no semi)
- 通过 ESLint Stylistic 插件控制

## 5. 自动检测功能差异

### 框架自动检测

#### 本仓库
```typescript
const VuePackages = ["vue", "nuxt", "vitepress", "@slidev/cli"];
const UnocssPackages = ["unocss", "@unocss/webpack", "@unocss/nuxt"];

// Astro 自动检测
astro: isPackageExists("astro")
```

#### 上游
```typescript
// 更多的自动检测
- Vue: 检测 vue, nuxt, vitepress 等
- TypeScript: 自动检测
- pnpm: 通过 findUpSync('pnpm-workspace.yaml') 检测
- React: 可以自动检测
- Next.js: 可以自动检测
```

## 6. 构建配置差异

### 本仓库 (tsup.config.ts)
```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
});
```

### 上游
使用 `tsdown` 代替 `tsup`，可能有不同的构建配置和优化。

## 7. Git Hooks 差异

### 本仓库
使用 Husky:
```json
{
  "prepare": "node .husky/install.mjs"
}
```

### 上游
使用 simple-git-hooks:
```json
{
  "prepare": "simple-git-hooks"
}
```

## 8. 缺失的配置文件详解

### nextjs.ts (上游独有)
- Next.js 专用的 ESLint 规则
- 使用 `@next/eslint-plugin-next`

### perfectionist.ts (上游独有)
- 独立的排序和组织规则配置
- 本仓库可能集成在 `sort.ts` 中

### solid.ts (上游独有)
- Solid.js 框架支持
- 使用 `eslint-plugin-solid`

### stylistic.ts (上游独有)
- 代码风格规则的独立配置
- 使用 `@stylistic/eslint-plugin`

### svelte.ts (上游独有)
- Svelte 框架支持
- 使用 `eslint-plugin-svelte` 和 `svelte-eslint-parser`

## 9. TypeScript 配置差异

### 本仓库 (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    // ... 其他配置
  }
}
```

### 上游
可能有额外的类型生成和验证配置。

## 总结

### 技术债务和差距
1. **CLI 工具**: 完全缺失，上游有完整的 CLI 向导
2. **构建工具**: tsup vs tsdown
3. **框架支持**: 缺少 Next.js, Svelte, Solid
4. **代码风格**: 双引号+分号 vs 单引号+无分号
5. **格式化方案**: Prettier vs eslint-plugin-format
6. **版本差距**: v0.11.0 vs v6.7.3 (6个大版本)

### 优势
1. 更简洁的配置
2. 明确的 Prettier 集成
3. 保持了独立的代码风格偏好
4. 专注于 Vue 生态系统

### 建议
1. 如需要 CLI 工具，可以从上游移植 `src/cli/` 目录
2. 如需要更多框架支持，逐个移植配置文件
3. 保持代码风格的一致性（双引号+分号）
4. 定期同步核心规则更新和 bug 修复
