# 上游同步指南

本文档提供具体的步骤来从上游 @antfu/eslint-config 同步代码。

## 快速参考

- **上游仓库**: https://github.com/antfu/eslint-config
- **当前版本**: v0.11.0
- **上游版本**: v6.7.3
- **Git 远程**: `upstream` (已配置)

## 同步方式总结

根据 git 历史分析，本仓库采用**选择性手动同步**的方式：

### 历史同步示例

```bash
# 找到的同步相关提交
commit 7c24ce7c5c2372ebcd37bc450934d20036f6ed4a
    feat: sync the recommended rules of react plugins (#697)

commit ea15e1d...
    feat: sync the recommended rules of react plugins (#693)
```

## 同步操作步骤

### 1. 准备工作

```bash
# 确保上游远程已添加
git remote -v | grep upstream

# 如果没有，添加上游
git remote add upstream https://github.com/antfu/eslint-config.git

# 获取最新的上游代码
git fetch upstream
```

### 2. 查看上游更新

```bash
# 查看上游最近的提交
git log upstream/main --oneline --since="1 month ago"

# 查看上游的发布标签
git tag -l --sort=-v:refname | grep upstream | head -20

# 比较当前分支和上游的差异
git log HEAD..upstream/main --oneline
```

### 3. 查看特定文件的差异

```bash
# 比较配置文件
git diff HEAD upstream/main -- src/configs/react.ts
git diff HEAD upstream/main -- src/configs/vue.ts
git diff HEAD upstream/main -- src/configs/typescript.ts
git diff HEAD upstream/main -- src/factory.ts

# 查看 package.json 的差异
git diff HEAD upstream/main -- package.json
```

### 4. 同步特定功能

#### 方法 A: Cherry-pick 特定提交

```bash
# 1. 找到需要同步的提交
git log upstream/main --oneline --grep="react" --since="2024-06-01"

# 2. 查看提交详情
git show <commit-hash>

# 3. Cherry-pick 提交（如果适用）
git cherry-pick <commit-hash>

# 4. 如果有冲突，解决冲突
git status
# 编辑冲突文件
git add .
git cherry-pick --continue
```

#### 方法 B: 手动复制和适配

```bash
# 1. 查看上游文件的最新版本
git show upstream/main:src/configs/react.ts > /tmp/upstream-react.ts

# 2. 对比本地文件
diff -u src/configs/react.ts /tmp/upstream-react.ts

# 3. 手动编辑本地文件，应用有价值的更改
# 注意保持代码风格一致（双引号、分号等）

# 4. 测试更改
pnpm install
pnpm build
pnpm test
```

### 5. 同步依赖更新

```bash
# 查看 package.json 的差异
git show upstream/main:package.json > /tmp/upstream-package.json
diff -u package.json /tmp/upstream-package.json

# 手动更新依赖版本
# 编辑 package.json

# 更新 pnpm-lock.yaml
pnpm install

# 测试
pnpm build
pnpm test
```

## 需要同步的优先级

### 高优先级（建议定期同步）

1. **安全修复**
   ```bash
   git log upstream/main --oneline --grep="security\|vulnerability\|CVE" --since="6 months ago"
   ```

2. **Bug 修复**
   ```bash
   git log upstream/main --oneline --grep="^fix" --since="3 months ago"
   ```

3. **依赖更新**（特别是安全补丁）
   - TypeScript
   - ESLint 核心插件
   - Vue/React 相关插件

### 中优先级（按需同步）

1. **新的 ESLint 规则**
   - React 规则更新
   - Vue 规则更新
   - TypeScript 规则更新

2. **现有功能改进**
   - 性能优化
   - 配置优化

### 低优先级（可选）

1. **新框架支持**
   - Next.js
   - Svelte
   - Solid

2. **CLI 工具**
   - 需要移植整个 `src/cli/` 目录

## 同步时的注意事项

### ✅ 应该保留的差异

1. **代码风格**
   - 保持双引号 (`"`) 而不是单引号 (`'`)
   - 保持使用分号 (`;`)
   - 不要改变 Prettier 配置

2. **包名和标识**
   - 保持 `@xwbx/eslint-config` 包名
   - 保持 `xwbx()` 函数名
   - 保持作者信息

3. **版本号体系**
   - 保持独立的版本号 (v0.x.x)

### ⚠️ 需要适配的内容

1. **函数名引用**
   - 将 `antfu()` 改为 `xwbx()`

2. **代码风格**
   - 单引号 → 双引号
   - 无分号 → 有分号

3. **导入路径**
   - 确保导入路径正确

### ❌ 不应该同步的内容

1. CLI 工具相关代码（除非决定添加 CLI）
2. 不需要的框架支持（Next.js, Svelte, Solid）
3. 构建工具变更（保持 tsup）
4. Git hooks 工具变更（保持 Husky）

## 同步示例：React 配置更新

### 完整流程

```bash
# 1. 创建新分支
git checkout -b sync/react-rules-update

# 2. 查看上游 React 配置的变化
git diff HEAD upstream/main -- src/configs/react.ts > /tmp/react-diff.patch

# 3. 查看差异
cat /tmp/react-diff.patch

# 4. 手动编辑文件
# 编辑 src/configs/react.ts
# - 添加新的规则
# - 更新规则配置
# - 保持代码风格（双引号、分号）

# 5. 如果有依赖更新
git show upstream/main:package.json | grep -A 5 "eslint-react"
# 更新 package.json 中的版本

# 6. 测试
pnpm install
pnpm build
pnpm test
pnpm lint

# 7. 提交
git add src/configs/react.ts package.json pnpm-lock.yaml
git commit -m "feat: sync react rules from upstream v6.7.3

- Update react/xxx rule configuration
- Update @eslint-react/eslint-plugin to vX.X.X
- Sync with upstream commit: <commit-hash>"

# 8. 推送并创建 PR
git push origin sync/react-rules-update
```

## 定期维护建议

### 每月检查清单

```bash
# 1. 获取最新上游代码
git fetch upstream

# 2. 查看上游新版本
git tag -l | grep "^v" | sort -V | tail -5

# 3. 查看上游重要更新
git log upstream/main --oneline --since="1 month ago" --grep="feat\|fix"

# 4. 检查安全更新
git log upstream/main --oneline --since="1 month ago" --grep="security\|vulnerability"

# 5. 查看依赖更新
git show upstream/main:package.json > /tmp/check-deps.json
# 对比关键依赖的版本
```

### 每季度深度同步

1. 审查上游的主要功能更新
2. 评估是否需要移植新功能
3. 更新所有依赖到最新的稳定版本
4. 运行完整的测试套件
5. 更新文档

## 工具脚本

### 快速查看上游更新

```bash
#!/bin/bash
# scripts/check-upstream.sh

echo "Fetching upstream..."
git fetch upstream

echo -e "\n=== Latest upstream tags ==="
git tag -l | grep "^v" | sort -V | tail -10

echo -e "\n=== Recent commits on upstream/main ==="
git log upstream/main --oneline --since="1 month ago" | head -20

echo -e "\n=== Your current version ==="
git describe --tags HEAD 2>/dev/null || echo "No tags on current HEAD"

echo -e "\n=== Files changed in upstream ==="
git diff --name-only HEAD upstream/main | head -20
```

### 批量检查配置文件差异

```bash
#!/bin/bash
# scripts/diff-configs.sh

CONFIGS=(
  "react"
  "vue"
  "typescript"
  "javascript"
)

for config in "${CONFIGS[@]}"; do
  echo "=== Checking src/configs/${config}.ts ==="
  git diff HEAD upstream/main -- "src/configs/${config}.ts" | head -50
  echo ""
done
```

## 参考资源

- [上游仓库](https://github.com/antfu/eslint-config)
- [上游文档](https://github.com/antfu/eslint-config/blob/main/README.md)
- [上游更新日志](https://github.com/antfu/eslint-config/releases)
- [ESLint 官方文档](https://eslint.org/)

## 遇到问题？

### 合并冲突

如果在 cherry-pick 或合并时遇到冲突：

1. 保持冷静，查看冲突的文件
2. 理解冲突的原因（通常是代码风格差异）
3. 手动解决冲突，保持本仓库的风格
4. 测试解决后的代码

### 依赖冲突

如果依赖版本不兼容：

1. 查看上游的 package.json 和 pnpm-lock.yaml
2. 逐个更新依赖，测试每个更新
3. 如果遇到破坏性更改，查看上游的迁移指南
4. 必要时保持旧版本，等待上游修复

### 功能不兼容

如果上游的功能与本仓库不兼容：

1. 评估是否真的需要这个功能
2. 如果需要，考虑如何适配
3. 如果不需要，跳过这个更新
4. 在文档中记录为什么不同步某个功能
