---
name: chrisbanes-skills-use
description: "Use this skill when a Kotlin, Android, Jetpack Compose, Compose Multiplatform, coroutine, Flow, KMP, UI testing, UI API design, recomposition/performance, focus/navigation, animation, or PR shepherding task may benefit from chrisbanes/skills but installing or triggering every focused skill would be too broad. Route broad or unclear tasks through the copied using-chrisbanes-skills guide, then read only the focused reference docs it selects."
---

# Chrisbanes Skills Use

This skill is a lightweight router for the `chrisbanes/skills` skill set.

Use `references/using-chrisbanes-skills/DOC.md` as the canonical upstream route
guide. Read it first for broad or unclear Kotlin, Android, and Jetpack Compose
work, then read only the focused `references/<skill-name>/DOC.md` files it
selects before detailed advice, review findings, or code edits.

Do not assume the router body is enough for execution details: the copied docs
contain the actual guidance, examples, and cross-skill routing.

## Routing Rules

- Default to `references/using-chrisbanes-skills/DOC.md` when the request is a
  broad review, refactor, architecture question, state/performance/testing task,
  or any task that may span multiple focused skills.
- Skip directly to a focused doc only when the user names a narrow concern that
  clearly matches one skill. Examples: `LaunchedEffect` ->
  `compose-side-effects`, `StateFlow` -> `kotlin-flow-state-event-modeling`,
  Compose UI tests -> `compose-ui-testing-patterns`.
- If a selected doc points to another `DOC.md`, read that doc before applying
  guidance in that area.
- Use multiple docs only when the task truly spans multiple areas, such as
  state-holder wiring plus side effects, or recomposition work that requires
  stability and deferred-read fixes.
- If the original focused skills are already installed and one clearly matches,
  use it directly. This router exists to reduce startup context when the whole
  upstream set is not installed.

## Primary Route

| Task signal | Start with |
| --- | --- |
| Broad Kotlin, Android, or Compose review/refactor/architecture work | `references/using-chrisbanes-skills/DOC.md` |
| Multiple possible focused skills may apply | `references/using-chrisbanes-skills/DOC.md` |
| Unsure which focused skill applies | `references/using-chrisbanes-skills/DOC.md` |
| Narrow concern that clearly matches one skill | The matching focused doc from the index below |

## Original Skill Index

{{SKILL_INDEX}}
