---
name: check
description: Runs .continue/checks locally against the current diff, simulating a PR review before pushing.
---

# Local Check Runner

Run every `.continue/checks/*.md` check against the current changes before opening a PR.

## Workflow

### 1. Gather context

- Run `git diff main...HEAD` and write it to `/tmp/check-diff.patch`.
- If that diff is empty, also try `git diff --cached` and `git diff`.
- Cap very large diffs at 3000 lines and append `... (diff truncated at 3000 lines)`.
- Run `git log main..HEAD --oneline` and write it to `/tmp/check-log.txt`.
- If there are no changes at all, tell the user and stop.

### 2. Discover checks

- Find every `.continue/checks/*.md` file.
- Present the list of checks that will run, then proceed.

### 3. Run checks

For each check file, review the diff according to that check's instructions.

Each result must start with either `PASS` or `FAIL` on its own line.

For every finding:

1. State severity: Error, Warning, or Info.
2. Reference the specific file and line from the diff when possible.
3. Explain what is wrong and how to fix it.

### 4. Summarize results

Present a summary table:

```markdown
| Check                          | Result    |
| ------------------------------ | --------- |
| Architecture Layers            | Passed    |
| Data Access And Agent Patterns | 1 warning |
```

### 5. Triage

If checks fail, ask the user whether to fix or skip each finding. Then execute the selected fixes.
