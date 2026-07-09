---
name: chrisbanes-skills-use
description: "Use this skill when a Kotlin, Android, Jetpack Compose, Compose Multiplatform, coroutine, Flow, KMP, UI testing, UI API design, recomposition/performance, focus/navigation, animation, or PR shepherding task may benefit from chrisbanes/skills but installing or triggering every focused skill would be too broad. Route to only the relevant copied reference doc before giving detailed advice or editing code."
---

# Chrisbanes Skills Use

This skill is a lightweight router for the `chrisbanes/skills` skill set.

Use the index below to choose the smallest relevant reference doc, then read
`references/<skill-name>/DOC.md` before detailed advice, review findings, or
code edits. Do not assume the router body is enough for execution details: the
copied docs contain the actual guidance, examples, and cross-skill routing.

## Routing Rules

- Match the user's request against the original skill descriptions below.
- Prefer the most specific focused doc. For example, use `compose-side-effects`
  for `LaunchedEffect`, `kotlin-flow-state-event-modeling` for `StateFlow`, and
  `compose-ui-testing-patterns` for Compose UI tests.
- For broad Compose/Kotlin work where the focused doc is unclear, read
  `references/using-chrisbanes-skills/DOC.md` first, then read the focused docs
  it routes to.
- If a selected doc points to another `DOC.md`, read that doc before applying
  guidance in that area.
- Use multiple docs only when the task truly spans multiple areas, such as
  state-holder wiring plus side effects, or recomposition work that requires
  stability and deferred-read fixes.
- If the original focused skills are already installed and one clearly matches,
  use it directly. This router exists to reduce startup context when the whole
  upstream set is not installed.

## Fast Routes

| Task signal | Start with |
| --- | --- |
| Broad Compose screen review, refactor, ViewModel/component wiring, navigation, or Flow collection mixed with layout | `compose-state-holder-ui-split` |
| Local Compose state, `remember { mutableStateOf(...) }`, mutable state lists/maps, or `@ReadOnlyComposable` | `compose-state-authoring` |
| Deciding whether state is local, hoisted, in a plain holder, or in a screen holder | `compose-state-hoisting` |
| `LaunchedEffect`, `DisposableEffect`, snackbar, navigation events, analytics, focus requests, or event Flow collection | `compose-side-effects` |
| Recomposition, jank, compiler reports, Layout Inspector counts, unstable params, scroll/animation reads, or back-writing state | `compose-recomposition-performance` |
| Modifier parameters, root layout placement, hardcoded layout decisions, or modifier chain style | `compose-modifier-and-layout-style` |
| Reusable Compose component API, content slots, optional visual regions, or boolean shape flags | `compose-slot-api-pattern` |
| Compose animation API choice, transitions, visibility, content swaps, or state-driven animation | `compose-animations` |
| Keyboard, desktop, TV, D-pad, focus order, `FocusRequester`, or key events | `compose-focus-navigation` |
| Compose UI tests, screenshot tests, previews, semantics, fake image loading, keyboard input, or focus assertions | `compose-ui-testing-patterns` |
| Coroutine scope ownership, fire-and-forget launch boundaries, `runBlocking`, or cancellation handling | `kotlin-coroutines-structured-concurrency` |
| `StateFlow`, `SharedFlow`, `Channel`, `stateIn`, one-shot events, sentinel initial values, or expensive `update` blocks | `kotlin-flow-state-event-modeling` |
| KMP source set boundaries, `expect`/`actual`, platform APIs, native SDKs, or Compose Multiplatform interop | `kotlin-multiplatform-expect-actual` |
| Kotlin branching, `when`, guard conditions, sealed exhaustiveness, smart casts, nullable branching, or early returns | `kotlin-control-flow` |
| Single-field domain types, primitive obsession, or `@JvmInline value class` vs `data class` | `kotlin-types-value-class` |
| Shepherding PRs/MRs, review comment triage, CI polling, or keeping reviews moving | `shepherd` |

## Original Skill Index

{{SKILL_INDEX}}
