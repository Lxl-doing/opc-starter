---
name: 分层架构守卫
description: 检查 PR 是否违反 pages→components→hooks→stores→services→lib 的单向依赖方向，以及是否在 UI 层直接导入 Supabase 或 IndexedDB。
---

# 分层架构守卫

## Context

OPC-Starter 采用分层架构，依赖方向为：

```text
pages → components → hooks → stores → services → lib → types/utils
```

上层可导入下层，禁止逆向依赖。该约定记录在 `docs/CONVENTIONS.md`、`docs/Architecture.md` 和 `app/src/test/architecture.test.ts` 中。

## What to Check

### 1. 逆向依赖

检查 diff 中新增或修改的 import 语句，确认没有以下逆向导入：

- `services/` 导入 `components/` 或 `pages/`
- `stores/` 导入 `pages/`
- `lib/` 导入 `services/`、`stores/`、`hooks/`、`components/` 或 `pages/`
- `hooks/` 导入 `pages/`
- `types/` 或 `utils/` 导入上层模块

**BAD:**

```typescript
// app/src/services/profileService.ts
import { UserCard } from '@/components/business/UserCard'
```

**GOOD:**

```typescript
// app/src/components/business/UserCard.tsx
import { profileService } from '@/services/profileService'
```

### 2. UI 层直接导入 Supabase

`pages/`、`components/`、`hooks/` 中的文件禁止直接导入 Supabase client：

- `@/lib/supabase/client`
- `@supabase/supabase-js`

必须通过 `services/` 或 `services/data/` 层间接访问。

### 3. UI 层直接操作 IndexedDB

`pages/`、`components/`、`hooks/` 中的文件禁止直接使用 IndexedDB API 或 Dexie/idb：

- `indexedDB.open`
- `import ... from 'dexie'`
- `import ... from 'idb'`

底层数据适配器（例如 `services/db/`、`services/data/`、`lib/` 下的适配器）除外。

## Key Files

- `docs/CONVENTIONS.md` — 分层依赖方向的权威定义
- `docs/Architecture.md` — 系统架构概览
- `app/src/test/architecture.test.ts` — 自动化架构约束测试

## Exclusions

- `app/src/services/`、`app/src/services/data/` 和 `app/src/lib/` 下的底层适配器可以直接导入 Supabase client 或 IndexedDB
- `app/src/mocks/` 下的 MSW mock 文件不受此约束
- `app/src/test/` 下的测试工具文件不受此约束
- 类型导入（`import type`）不算运行时依赖违规
