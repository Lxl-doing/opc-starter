---
name: 数据访问与 Agent 规范
description: 检查 PR 是否绕过 Service/DataService 直接访问数据，以及 Agent/A2UI/LLM 调用是否遵守 OPC-Starter 约定。
---

# 数据访问与 Agent 规范

## Context

OPC-Starter 的核心价值是为 AI-friendly SaaS 提供可复用分层、数据同步和 Agent UI 基础。PR 审查应重点防止绕过这些基础能力，避免 fork 项目后出现不可维护的旁路实现。

## What to Check

### 1. 绕过 Service/DataService 直接访问数据

检查 diff 中 `pages/`、`components/`、`hooks/` 下的文件是否直接调用 Supabase 或 IndexedDB：

- `supabase.from(...)`
- `supabase.rpc(...)`
- `supabase.storage.*`
- `indexedDB.open(...)`
- Dexie/idb 表操作

UI 层应通过 `services/`、`services/data/`、stores 或 hooks 暴露的稳定接口访问数据。

### 2. 直接调用 LLM API

检查新增代码是否直接请求第三方 LLM API 或 SDK。前端和普通业务模块不得直接调用 LLM：

- `fetch('https://dashscope...')`
- `new OpenAI(...)`
- 直接使用 provider API key

应通过 `ai-assistant` Edge Function 或 `docs/API.md` 中定义的 API 入口。

### 3. A2UI 组件类型未注册

检查 `renderUI`、Agent tool result 或 A2UI schema 是否使用了未在 registry 中注册的组件类型。新增组件类型时必须同步更新：

- `app/src/components/agent/a2ui/registry.ts`
- 相关 validator / 类型定义
- `docs/API.md` 或 `docs/Architecture.md` 中的扩展说明

### 4. Mock mode 可用性

涉及 Supabase、认证、数据服务、Agent API 的改动，应确认 MSW mock mode 仍可运行：

- `npm run dev:test`
- `npm run test`
- 相关 mock handler 或 fixture 已同步

## Key Files

- `docs/API.md` — AI Assistant API 和 Agent 工具契约
- `docs/Architecture.md` — 模块关系与扩展指南
- `docs/CONVENTIONS.md` — 数据访问、命名、错误处理规范
- `.cursor/rules/agent-studio.md` — Agent Studio 开发规范
- `.cursor/rules/supabase-patterns.md` — Supabase 数据访问规范

## Exclusions

- `app/src/services/`、`app/src/services/data/`、`app/src/lib/` 中的底层实现可以直接访问数据库或本地存储
- `app/src/mocks/` 中的 mock handler 可以模拟网络和数据库行为
- 测试文件可以构造 mock client，但不能把测试旁路复制到生产代码
