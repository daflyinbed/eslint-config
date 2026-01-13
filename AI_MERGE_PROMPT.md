# AI 工具合并上游代码提示词

> 本提示词用于指导 AI 工具从上游 @antfu/eslint-config 合并代码到本仓库

## 仓库信息

- **本仓库**: `@xwbx/eslint-config`
- **上游仓库**: `@antfu/eslint-config` (https://github.com/antfu/eslint-config)
- **当前版本**: v0.11.0
- **上游版本**: v6.7.3+

## 核心原则

### 🔴 最高优先级：保持提交完整性

**优先采用原封不动的 cherry-pick 方式**，将上游的完整 commit 带过来，而不是手动复制粘贴代码。

```bash
# 优先使用这种方式
git cherry-pick <upstream-commit-hash>

# 而不是手动编辑文件
```

### 合并策略优先级

1. **最优**: 完整 cherry-pick 上游提交（保留 commit message、作者信息等）
2. **次优**: 合并多个相关提交为一个（如果单个提交会导致冲突）
3. **最后手段**: 手动应用更改（仅在无法 cherry-pick 时使用）

## 任务要求

### 1. 准备工作

在开始合并之前：

```bash
# 确保上游远程已添加
git remote add upstream https://github.com/antfu/eslint-config.git
git fetch upstream

# 查看当前状态
git status
git log --oneline -10

# 创建新的工作分支
git checkout -b sync/upstream-<feature-name>
```

### 2. 选择要合并的提交

查看上游的提交：

```bash
# 按日期查看
git log upstream/main --oneline --since="3 months ago"

# 按功能查看
git log upstream/main --oneline --grep="react\|vue\|typescript"

# 查看特定提交的详情
git show <commit-hash>
```

### 3. Cherry-pick 提交

**核心要求**: 尽可能原封不动地 cherry-pick 上游提交

```bash
# 单个提交
git cherry-pick <commit-hash>

# 多个连续提交
git cherry-pick <start-hash>^..<end-hash>

# 如果需要修改 commit message（保留原作者）
git cherry-pick <commit-hash> --edit
```

### 4. 处理冲突的策略

当 cherry-pick 出现冲突时：

#### 4.1 代码风格冲突（最常见）

**自动转换规则**:
- 单引号 `'` → 双引号 `"`
- 移除分号处 → 添加分号 `;`
- `antfu()` → `xwbx()`

**处理步骤**:
```bash
# 1. Cherry-pick 会停止并报告冲突
git cherry-pick <commit-hash>

# 2. 查看冲突文件
git status

# 3. 对于每个冲突文件，应用代码风格转换
# 编辑文件，将：
#   'single quotes' → "double quotes"
#   没有分号 → 添加分号
#   antfu → xwbx

# 4. 标记冲突已解决
git add <resolved-files>

# 5. 继续 cherry-pick
git cherry-pick --continue
```

#### 4.2 功能冲突

如果是实质性的代码冲突：

1. **优先保留上游的逻辑**（功能更新）
2. **应用本仓库的代码风格**（双引号、分号）
3. **保留本仓库特有的配置**（如果有）

#### 4.3 依赖冲突

```bash
# 如果 package.json 有冲突
# 1. 接受上游的依赖版本
# 2. 保留本仓库特有的依赖
# 3. 运行 pnpm install 更新 lock 文件
```

### 5. 必须保留的差异

在合并时，以下差异**必须保留**，不要被上游覆盖：

#### 5.1 包信息
```json
// package.json
{
  "name": "@xwbx/eslint-config",  // 不要改成 @antfu/eslint-config
  "author": "xwbx <1677759063@qq.com>",  // 保留
  "homepage": "https://github.com/daflyinbed/eslint-config"  // 保留
}
```

#### 5.2 主函数名
```typescript
// src/factory.ts 和 src/index.ts
export function xwbx(...)  // 不要改成 antfu()
export { xwbx }  // 不要改成 antfu
```

#### 5.3 代码风格
- **所有文件**: 双引号 `"` 而不是单引号 `'`
- **所有文件**: 使用分号 `;`
- **Prettier 配置**: 保持 `singleQuote: false` 和 `semi: true`

#### 5.4 构建工具
```json
// package.json - 保留这些
{
  "scripts": {
    "build": "pnpm run typegen && tsup --clean --dts",  // 保留 tsup
    "prepare": "node .husky/install.mjs"  // 保留 Husky
  }
}
```

### 6. 可以选择性合并的功能

以下功能来自上游，可以根据需要选择是否合并：

#### 不需要立即合并（可选）
- ❌ CLI 工具 (`src/cli/`)
- ❌ Next.js 支持 (`src/configs/nextjs.ts`)
- ❌ Svelte 支持 (`src/configs/svelte.ts`)
- ❌ Solid 支持 (`src/configs/solid.ts`)

#### 推荐合并（优先级高）
- ✅ 安全修复
- ✅ Bug 修复
- ✅ React 规则更新
- ✅ Vue 规则更新
- ✅ TypeScript 规则更新
- ✅ 依赖版本更新（安全补丁）

### 7. 验证合并结果

每次 cherry-pick 后，必须验证：

```bash
# 1. 检查代码风格是否正确
# 确保使用双引号和分号

# 2. 构建测试
pnpm install
pnpm build

# 3. 运行测试
pnpm test

# 4. Lint 检查
pnpm lint

# 5. 查看更改
git diff HEAD~1
```

### 8. Commit Message 规范

#### 如果直接 cherry-pick（推荐）
保留原始的 commit message，可以添加注释：

```bash
git cherry-pick <commit-hash>

# Commit message 会是:
# <原始 upstream commit message>
# 
# (cherry picked from commit <hash>)
# Adapted for @xwbx/eslint-config:
# - Applied double quotes code style
# - Applied semicolon code style
```

#### 如果手动合并（不推荐，但必要时）
```bash
git commit -m "feat: sync <feature> from upstream v<version>

- <描述具体更改>
- Adapted from upstream commit: <commit-hash>
- Applied xwbx code style (double quotes, semicolons)

Co-authored-by: <上游作者> <邮箱>"
```

### 9. 特殊情况处理

#### 9.1 上游重构了整个文件

如果上游完全重写了某个文件：

1. **备份当前文件**
   ```bash
   cp src/configs/react.ts src/configs/react.ts.backup
   ```

2. **Cherry-pick 上游提交**
   ```bash
   git cherry-pick <commit-hash>
   ```

3. **应用代码风格转换**
   - 全局替换: `'` → `"`
   - 添加缺失的分号
   - 替换函数名

4. **对比备份，恢复本仓库特有的配置**
   ```bash
   diff src/configs/react.ts.backup src/configs/react.ts
   ```

#### 9.2 上游删除了我们需要的功能

如果上游删除了某个本仓库需要保留的功能：

1. Cherry-pick 其他更改
2. 手动恢复被删除的功能
3. 在 commit message 中说明

#### 9.3 处理 package.json 合并

```bash
# 策略：
# 1. dependencies: 优先使用上游的版本
# 2. devDependencies: 优先使用上游的版本
# 3. peerDependencies: 合并两者（保留本仓库特有的）
# 4. scripts: 保持本仓库的（不要改成上游的）
# 5. name, author, homepage: 保持本仓库的
```

### 10. 批量合并多个提交

如果要合并一系列相关的提交：

```bash
# 方法 1: 逐个 cherry-pick（推荐，保持提交历史）
git cherry-pick <commit1>
git cherry-pick <commit2>
git cherry-pick <commit3>

# 方法 2: 合并为一个提交（如果提交太多）
git cherry-pick --no-commit <commit1>
git cherry-pick --no-commit <commit2>
git cherry-pick --no-commit <commit3>
git commit -m "feat: sync multiple upstream changes

Cherry-picked commits:
- <commit1>: <message1>
- <commit2>: <message2>
- <commit3>: <message3>

Applied xwbx code style."
```

## 示例工作流程

### 场景: 合并上游的 React 规则更新

```bash
# 1. 准备
git fetch upstream
git checkout -b sync/react-rules-v6.7.3

# 2. 找到相关提交
git log upstream/main --oneline --grep="react" --since="2024-06-01"
# 假设找到 commit: abc1234 "feat(react): update recommended rules"

# 3. 查看提交详情
git show abc1234

# 4. Cherry-pick（原封不动）
git cherry-pick abc1234

# 5. 如果有冲突（代码风格）
# 编辑冲突文件:
#   - 'single' → "double"
#   - 无分号 → 加分号
git add .
git cherry-pick --continue

# 6. 验证
pnpm build && pnpm test

# 7. 推送
git push origin sync/react-rules-v6.7.3
```

## 工作清单

在执行合并任务时，按顺序检查：

- [ ] 已 fetch 上游最新代码
- [ ] 已创建新的工作分支
- [ ] 已确定要合并的提交列表
- [ ] 优先使用 cherry-pick 而非手动编辑
- [ ] 保留了包名、作者、函数名等标识信息
- [ ] 应用了代码风格转换（双引号、分号）
- [ ] 保留了构建工具配置（tsup, Husky）
- [ ] 运行了构建测试 (pnpm build)
- [ ] 运行了单元测试 (pnpm test)
- [ ] 运行了 lint (pnpm lint)
- [ ] Commit message 包含了上游 commit 信息
- [ ] 已推送分支并准备创建 PR

## 常见错误和解决方案

### 错误 1: Cherry-pick 后代码风格不一致

**问题**: 合并后的代码使用单引号和无分号

**解决**:
```bash
# 使用编辑器的查找替换功能
# 在 VS Code 中:
# 查找: '([^']*)'  替换为: "$1"
# 然后手动添加分号
```

### 错误 2: 包名被改成了 @antfu/eslint-config

**解决**:
```bash
git checkout HEAD -- package.json
# 然后手动合并 package.json 的其他部分
```

### 错误 3: 函数名被改成了 antfu()

**解决**:
```bash
# 全局查找替换
grep -r "antfu(" src/
# 替换为 xwbx()
```

## 最后提醒

1. **永远优先 cherry-pick**: 这样可以保留完整的 git 历史和作者信息
2. **小步快跑**: 一次合并少量提交，而不是一次性合并几十个
3. **频繁测试**: 每次 cherry-pick 后都运行 build 和 test
4. **保持差异**: 记住本仓库的特色（双引号、分号、Prettier）
5. **记录来源**: 在 commit message 中标注上游 commit hash

## 参考文档

- [UPSTREAM_COMPARISON.md](./UPSTREAM_COMPARISON.md) - 详细的差异对比
- [TECHNICAL_DIFF.md](./TECHNICAL_DIFF.md) - 技术实现差异
- [SYNC_GUIDE.md](./SYNC_GUIDE.md) - 同步操作指南
- [上游仓库](https://github.com/antfu/eslint-config)
