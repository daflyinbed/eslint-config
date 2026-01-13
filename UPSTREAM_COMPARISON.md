# 与上游 @antfu/eslint-config 的差异对比

## 概述

本仓库 `@xwbx/eslint-config` 是基于上游 [@antfu/eslint-config](https://github.com/antfu/eslint-config) 的一个分支版本。

- **当前版本**: v0.11.0
- **上游版本**: v6.7.3 (截至 2026-01-13)
- **版本差异**: 落后上游约 ~6 个大版本

## 主要差异

### 1. 包名称和作者信息

| 项目 | 本仓库 | 上游 |
|------|--------|------|
| 包名 | `@xwbx/eslint-config` | `@antfu/eslint-config` |
| 作者 | xwbx | Anthony Fu |
| 主函数导出 | `xwbx()` | `antfu()` |
| 版本号 | v0.11.0 | v6.7.3 |

### 2. 功能支持差异

#### 本仓库缺失的功能 (上游有但本仓库没有)

1. **CLI 工具**
   - 上游提供了完整的 CLI 向导工具 (`@antfu/eslint-config@latest`)
   - 本仓库没有 CLI 相关代码 (无 `src/cli/` 目录)

2. **框架支持**
   - ❌ **Next.js**: 上游支持，本仓库不支持
   - ❌ **Svelte**: 上游支持，本仓库不支持  
   - ❌ **Solid**: 上游支持，本仓库不支持

3. **插件和规则**
   - ❌ **perfectionist**: 上游独立配置，本仓库集成在 sort 中
   - ❌ **stylistic**: 上游独立配置，本仓库可能集成在其他配置中

4. **构建工具**
   - 上游使用 `tsdown` 进行构建
   - 本仓库使用 `tsup` 进行构建

5. **Prettier 集成**
   - 上游通过 `eslint-plugin-format` 支持多种格式化工具
   - 本仓库直接使用 Prettier 作为格式化器

6. **pnpm catalog 支持**
   - 上游有更强大的 pnpm workspace 和 catalog 支持
   - 本仓库的 pnpm 支持较基础

### 3. 配置文件结构差异

#### 上游存在但本仓库缺失的配置文件

```
src/configs/
├── nextjs.ts          ❌ 本仓库缺失
├── perfectionist.ts   ❌ 本仓库缺失
├── solid.ts           ❌ 本仓库缺失
├── stylistic.ts       ❌ 本仓库缺失
└── svelte.ts          ❌ 本仓库缺失
```

#### 配置命名差异

本仓库有一些配置文件使用了不同的组织方式：
- 本仓库: `sort.ts` (包含导入排序)
- 上游: 分为 `perfectionist.ts` 和独立的排序功能

### 4. TypeScript 和类型定义

- 上游有自动生成的类型定义 (`src/cli/constants-generated.ts`)
- 上游的类型系统更完善，包含更多的类型导出

### 5. Prettier 选项差异

#### 本仓库的默认 Prettier 配置
```js
{
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
  singleQuote: false,  // 双引号
  semi: true,          // 使用分号
  endOfLine: "lf",
}
```

#### 上游的风格原则
```
- Single quotes, no semi (单引号，不使用分号)
- Sorted imports, dangling commas
- Minimal for reading, stable for diff, consistent
```

**核心差异**: 本仓库使用双引号和分号，上游使用单引号且不使用分号。

### 6. 依赖差异

#### 上游新增的依赖 (本仓库可能没有)

- `ansis` - ANSI 颜色支持
- `cac` - CLI 框架
- `@next/eslint-plugin-next` - Next.js 支持
- `eslint-plugin-solid` - Solid 支持
- `eslint-plugin-svelte` - Svelte 支持
- `svelte-eslint-parser` - Svelte 解析器
- `prettier-plugin-slidev` - Slidev 插件

#### 共同的核心依赖

两个仓库都使用以下核心依赖：
- `eslint-flat-config-utils`
- `@typescript-eslint/eslint-plugin`
- `eslint-plugin-vue`
- `eslint-plugin-react` (通过 @eslint-react)
- `eslint-plugin-perfectionist`
- 等等...

### 7. 文档差异

#### 上游文档更完善
- 提供了更详细的使用说明
- 包含 IDE 集成说明 (VS Code, Neovim 等)
- 有视频讲座链接和演讲资料

#### 本仓库文档
- 较为简洁
- 主要关注 Vue 2/3 的支持
- 中文用户友好

## 如何从上游同步代码

根据 git 历史分析，本仓库过去的同步方式：

### 1. 历史同步模式

从 git 提交记录中可以看到类似的提交：
```
feat: sync the recommended rules of react plugins (#697)
feat: sync the recommended rules of react plugins (#693)
```

这表明同步是**选择性**的，主要是：
- ✅ 同步特定功能的规则更新
- ✅ 同步插件版本更新
- ❌ 不是完整的合并上游所有更改

### 2. 推荐的同步流程

#### 方法 A: 手动选择性同步（当前采用的方式）

1. **添加上游远程** (已完成)
   ```bash
   git remote add upstream https://github.com/antfu/eslint-config.git
   git fetch upstream
   ```

2. **查看上游更改**
   ```bash
   git log upstream/main --oneline --since="2024-01-01"
   ```

3. **选择性合并特定提交**
   ```bash
   # 查看特定提交
   git show <commit-hash>
   
   # 如果需要，cherry-pick 特定提交
   git cherry-pick <commit-hash>
   ```

4. **手动应用更改**
   - 对于大的功能差异，手动复制和调整代码
   - 保留本仓库的特色（如 Prettier 配置、双引号风格等）

#### 方法 B: 基于 diff 的同步

1. **比较特定文件**
   ```bash
   # 比较配置文件
   git diff upstream/main HEAD -- src/configs/react.ts
   git diff upstream/main HEAD -- src/configs/vue.ts
   ```

2. **提取有用的更改**
   - 新的规则配置
   - Bug 修复
   - 性能优化

3. **适配到本仓库**
   - 调整以符合本仓库的代码风格（双引号、分号等）
   - 确保与本仓库的架构兼容

### 3. 同步时需要注意的事项

#### ⚠️ 不应该同步的内容
- CLI 工具相关代码（除非决定添加 CLI 支持）
- Next.js/Svelte/Solid 相关配置（如果不需要这些框架）
- 代码风格差异（单引号 vs 双引号，分号等）
- 包名和作者信息

#### ✅ 应该同步的内容
- 新的 ESLint 规则和最佳实践
- Bug 修复
- 现有功能的改进（Vue, React, TypeScript 等）
- 依赖版本更新（特别是安全更新）
- 性能优化

### 4. 具体同步步骤示例

假设要同步 React 相关的更新：

```bash
# 1. 查看上游 React 配置的变化
git diff HEAD..upstream/main -- src/configs/react.ts

# 2. 如果有有用的更新，手动应用
# 编辑 src/configs/react.ts，添加新规则或修复

# 3. 测试更改
pnpm install
pnpm build
pnpm test

# 4. 提交更改
git add src/configs/react.ts
git commit -m "feat: sync react rules from upstream v6.7.3"
```

## 版本同步建议

### 短期策略（保持独立性）
如果想保持本仓库的独立性和特色：
1. 定期查看上游的重要更新（每月一次）
2. 选择性地同步有价值的规则和修复
3. 保持自己的版本号体系

### 长期策略（跟进上游）
如果想更紧密地跟随上游：
1. 考虑重新基于上游的最新版本
2. 将自定义功能作为配置选项
3. 使用上游的版本号体系，加上自己的后缀（如 v6.7.3-xwbx.1）

## 总结

1. **本仓库特色**：
   - 使用 Prettier 和双引号 + 分号的代码风格
   - 专注于 Vue 2/3 支持
   - 更简洁的配置，不包含某些高级功能

2. **与上游的主要差距**：
   - 缺少 CLI 工具
   - 缺少 Next.js/Svelte/Solid 支持
   - 版本落后约 6 个大版本

3. **同步方式**：
   - 主要采用选择性手动同步
   - 针对特定功能和规则更新
   - 保持本仓库的独特风格和配置

4. **建议**：
   - 继续保持选择性同步的方式
   - 定期检查上游的重要安全更新和 bug 修复
   - 如果需要新框架支持（如 Next.js），可以从上游移植相关配置
