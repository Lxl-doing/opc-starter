# BMAD 工作流产物

> BMAD Method v6 输出目录 | 与 `docs/` 稳定文档隔离

本目录由 BMAD skill 读写。**不要**把 Architecture.md、API.md 等稳定项目文档放这里；那些留在 `docs/`。

## 目录结构

```
_bmad-output/
├── README.md                       # 本文件
├── project-context.md              # generate-project-context 后生成
├── planning-artifacts/             # Phase 1–3：分析、规划、方案
│   ├── architecture.md             # 本次 initiative 方案架构（≠ docs/Architecture.md）
│   ├── epics.md                    # Epic/Story 拆解
│   └── research/
│       └── technical-{slug}-research-{date}.md
├── implementation-artifacts/       # Phase 4：实施
│   ├── sprint-status.yaml          # Sprint 进度
│   ├── {epic}-{story}-{slug}.md    # Story 文件
│   └── epic-{N}-retro-*.md         # Epic 回顾
└── specs/                          # Quick Dev 独立 spec
    └── spec-*.md
```

## 与其他文档体系的关系

| 体系                 | 位置               | 用途                                            |
| -------------------- | ------------------ | ----------------------------------------------- |
| **BMAD 流程产物**    | `_bmad-output/`    | PRD、Epic、Story、sprint-status、Quick Dev spec |
| **稳定项目文档**     | `docs/`            | Architecture.md、API.md、CONVENTIONS.md 等      |
| **执行计划（可选）** | `docs/exec-plans/` | 调研/改进计划；与 BMAD 轨可并存                 |
| **Epic 索引**        | `docs/Epics.yaml`  | 统一进度仪表盘                                  |

## 配置

路径由 `_bmad/custom/config.toml` 锁定（团队覆盖，提交到 Git）：

- `output_folder` → `_bmad-output`
- `planning_artifacts` → `_bmad-output/planning-artifacts`
- `implementation_artifacts` → `_bmad-output/implementation-artifacts`
- `project_knowledge` → `docs`
