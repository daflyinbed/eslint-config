# 与上游对比总结 - 快速参考

> 本文档是 [UPSTREAM_COMPARISON.md](./UPSTREAM_COMPARISON.md)、[TECHNICAL_DIFF.md](./TECHNICAL_DIFF.md) 和 [SYNC_GUIDE.md](./SYNC_GUIDE.md) 的精简版本，提供快速参考。

## 📊 版本对比

| 项目 | 本仓库 | 上游 |
|------|--------|------|
| 版本 | v0.11.0 | v6.7.3 |
| 包名 | `@xwbx/eslint-config` | `@antfu/eslint-config` |
| 主函数 | `xwbx()` | `antfu()` |

## 🎯 核心差异（5 大类）

### 1. 代码风格
```javascript
// 本仓库
const foo = "bar";  // 双引号 + 分号

// 上游
const foo = 'bar'   // 单引号 + 无分号
```

### 2. 功能支持

| 功能 | 本仓库 | 上游 |
|------|--------|------|
| Vue | ✅ | ✅ |
| React | ✅ | ✅ |
| TypeScript | ✅ | ✅ |
| Astro | ✅ | ✅ |
| UnoCSS | ✅ | ✅ |
| **Next.js** | ❌ | ✅ |
| **Svelte** | ❌ | ✅ |
| **Solid** | ❌ | ✅ |
| **CLI 工具** | ❌ | ✅ |

### 3. 构建和工具

| 工具 | 本仓库 | 上游 |
|------|--------|------|
| 构建工具 | tsup | tsdown |
| 格式化 | Prettier (直接) | eslint-plugin-format |
| Git Hooks | Husky | simple-git-hooks |

### 4. 缺失的配置文件

上游有但本仓库没有的配置：
- ❌ `src/cli/` - CLI 工具
- ❌ `src/configs/nextjs.ts` - Next.js 支持
- ❌ `src/configs/svelte.ts` - Svelte 支持
- ❌ `src/configs/solid.ts` - Solid 支持
- ❌ `src/configs/perfectionist.ts` - 排序配置（本仓库集成在 sort.ts）
- ❌ `src/configs/stylistic.ts` - 风格配置

### 5. 依赖差异

#### 本仓库特有
- `prettier` (直接依赖)
- `eslint-plugin-vuejs-accessibility`

#### 上游特有
- `eslint-plugin-format` (替代 Prettier)
- `@next/eslint-plugin-next`
- `eslint-plugin-svelte`
- `eslint-plugin-solid`
- `ansis`, `cac` (CLI 相关)

## 🔄 同步策略

### 过去如何同步
根据 git 历史，采用**选择性手动同步**：
- ✅ 同步特定功能的规则更新（如 React 规则）
- ✅ 同步依赖版本更新
- ❌ 不是完整合并上游

### 示例提交
```
feat: sync the recommended rules of react plugins (#697)
```

### 推荐同步流程

```bash
# 1. 准备
git fetch upstream

# 2. 查看差异
git diff HEAD upstream/main -- src/configs/react.ts

# 3. 手动应用有价值的更改
# 编辑文件，保持双引号+分号风格

# 4. 测试
pnpm build && pnpm test

# 5. 提交
git commit -m "feat: sync react rules from upstream v6.7.3"
```

## 📝 同步优先级

### 🔴 高优先级（建议立即同步）
1. **安全修复** - CVE、安全漏洞
2. **严重 Bug 修复** - 影响核心功能
3. **依赖安全更新** - 关键依赖的补丁

### 🟡 中优先级（按需同步）
1. **新 ESLint 规则** - React, Vue, TS 规则更新
2. **性能优化** - 提升速度和效率
3. **非关键依赖更新** - 次要依赖升级

### 🟢 低优先级（可选）
1. **新框架支持** - Next.js, Svelte, Solid
2. **CLI 工具** - 需要大量移植工作
3. **文档更新** - 说明性内容

## ⚠️ 同步注意事项

### ✅ 必须保留
- 双引号风格
- 使用分号
- Prettier 配置
- 包名 `@xwbx/eslint-config`
- 函数名 `xwbx()`

### ⚙️ 需要适配
- `antfu()` → `xwbx()`
- 单引号 → 双引号
- 无分号 → 有分号

### ❌ 不要同步
- CLI 工具（除非计划添加）
- 不需要的框架（Next.js 等）
- 构建工具变更（保持 tsup）

## 🚀 快速同步命令

```bash
# 查看上游最新更新
git fetch upstream && git log upstream/main --oneline --since="1 month ago" | head -20

# 比较特定文件
git diff HEAD upstream/main -- src/configs/react.ts

# 查看上游版本
git describe --tags upstream/main

# 检查安全更新
git log upstream/main --grep="security\|vulnerability" --since="3 months ago"
```

## 📚 相关文档

- [完整对比文档](./UPSTREAM_COMPARISON.md) - 详细的功能和版本对比
- [技术差异文档](./TECHNICAL_DIFF.md) - 深入的技术层面对比
- [同步操作指南](./SYNC_GUIDE.md) - 具体的同步步骤和工具

## 💡 建议

### 短期（保持独立性）
1. 每月检查上游的安全更新和 bug 修复
2. 选择性同步有价值的规则更新
3. 保持自己的版本号体系和代码风格

### 长期（可选）
如果想更紧密跟随上游：
1. 考虑添加 CLI 工具支持
2. 评估是否需要更多框架支持
3. 可以考虑切换到上游的构建工具链

## 🔗 资源链接

- 上游仓库: https://github.com/antfu/eslint-config
- 上游文档: https://github.com/antfu/eslint-config#readme
- 本仓库: https://github.com/daflyinbed/eslint-config

---

**最后更新**: 2026-01-13  
**对比上游版本**: v6.7.3  
**本仓库版本**: v0.11.0
