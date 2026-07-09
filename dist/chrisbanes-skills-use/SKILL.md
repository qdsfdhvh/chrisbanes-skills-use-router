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

| Category | Skill | Reference doc | Description |
| --- | --- | --- | --- |
| Jetpack Compose | `compose-animations` | `references/compose-animations/DOC.md` | Use when writing or reviewing Jetpack Compose motion: visibility enter/exit, animating one property toward a target, color or size transitions, multiple properties from one state, switching composable content, or choosing between AnimatedVisibility, animate*AsState, rememberTransition, AnimatedContent, and Crossfade. |
| Jetpack Compose | `compose-focus-navigation` | `references/compose-focus-navigation/DOC.md` | Use when writing or reviewing Jetpack Compose UI for TV, keyboard, desktop, accessibility focus, D-pad navigation, FocusRequester, focusProperties, key events, or initial focus behavior. |
| Jetpack Compose | `compose-modifier-and-layout-style` | `references/compose-modifier-and-layout-style/DOC.md` | Use when writing or reviewing Jetpack Compose layout APIs, modifier parameters, modifier chain construction, hardcoded root layout decisions, or layout wrappers around a single conditional. |
| Jetpack Compose | `compose-recomposition-performance` | `references/compose-recomposition-performance/DOC.md` | Use when investigating Jetpack Compose recomposition performance, skippable/restartable composables, composables.txt or compiler reports, Layout Inspector recomposition counts, back-writing snapshot state across phases, or frame-rate State reads in composition vs layout/draw, and it is not yet clear whether the cause is parameter stability, deferred reads, or cross-phase back-writing. |
| Jetpack Compose | `compose-side-effects` | `references/compose-side-effects/DOC.md` | Use when writing or reviewing Jetpack Compose code with LaunchedEffect, DisposableEffect, SideEffect, rememberCoroutineScope, rememberUpdatedState, snapshotFlow, snackbar, navigation, focus requests, analytics, or event Flow collection. |
| Jetpack Compose | `compose-slot-api-pattern` | `references/compose-slot-api-pattern/DOC.md` | Use when designing or reviewing a reusable Jetpack Compose component whose visual regions vary by caller, or when primitive content parameters and boolean shape flags are accumulating. |
| Jetpack Compose | `compose-stability-diagnostics` | `references/compose-stability-diagnostics/DOC.md` | Use when writing or reviewing Jetpack Compose parameter stability, compiler reports, skippability, unstable UI state classes, collection parameters, or Kotlin 2.0+ strong skipping behavior. |
| Jetpack Compose | `compose-state-authoring` | `references/compose-state-authoring/DOC.md` | Use when writing or reviewing Jetpack Compose code with bare local var in a @Composable, remember { mutableStateOf(...) }, mutableStateListOf/mutableStateMapOf, or @ReadOnlyComposable. |
| Jetpack Compose | `compose-state-deferred-reads` | `references/compose-state-deferred-reads/DOC.md` | Use when Jetpack Compose code reads scroll, animation, gesture, or other frame-rate State in composition, passes changing values across composable boundaries, uses value-form layout/draw modifiers, or back-writes observable state from a later phase into one that's already run. |
| Jetpack Compose | `compose-state-hoisting` | `references/compose-state-hoisting/DOC.md` | Use when deciding where Jetpack Compose UI element state or UI logic should live: local remember state, hoisted composable parameters, a plain state holder class, or a screen-level ViewModel/component. |
| Jetpack Compose | `compose-state-holder-ui-split` | `references/compose-state-holder-ui-split/DOC.md` | Use when a Jetpack Compose screen-level composable takes a ViewModel/component/controller, collects state or effects, handles navigation/snackbars, or wires callbacks while also rendering layout. |
| Jetpack Compose | `compose-ui-testing-patterns` | `references/compose-ui-testing-patterns/DOC.md` | Use when writing or reviewing Jetpack Compose UI tests, screenshot tests, previews, semantics assertions, fake image loading, keyboard input, focus assertions, interaction state (hover/pressed/focused), or tests for plain state-driven UI composables. |
| Kotlin | `kotlin-control-flow` | `references/kotlin-control-flow/DOC.md` | Use when writing or reviewing Kotlin branching and control flow: when expressions, guard conditions, sealed type exhaustiveness, smart casts, nullable branching, early returns, or replacing complex if/else chains. |
| Kotlin | `kotlin-coroutines-structured-concurrency` | `references/kotlin-coroutines-structured-concurrency/DOC.md` | Use when writing or reviewing Kotlin code that stores CoroutineScope, launches from init/non-suspending APIs, calls runBlocking, or catches broad exceptions around suspend calls. |
| Kotlin | `kotlin-flow-state-event-modeling` | `references/kotlin-flow-state-event-modeling/DOC.md` | Use when writing or reviewing Kotlin Flow state and event APIs with StateFlow, MutableStateFlow.update, SharedFlow, Channel, stateIn, SharingStarted, .value, receiveAsFlow, one-shot events, or sentinel initial values. |
| Kotlin | `kotlin-multiplatform-expect-actual` | `references/kotlin-multiplatform-expect-actual/DOC.md` | Use when designing Kotlin Multiplatform expect/actual or interface boundaries for platform services, native SDKs, source sets, Compose Multiplatform UI, permissions, files, settings, sensors, or platform interop. |
| Kotlin | `kotlin-types-value-class` | `references/kotlin-types-value-class/DOC.md` | Use when writing or reviewing Kotlin type declarations to choose @JvmInline value class over data class where appropriate, including Compose stability implications. |
| Workflow | `shepherd` | `references/shepherd/DOC.md` | Use when asked to shepherd, babysit, monitor, or poll open pull requests or merge requests — including triaging review comments, detecting CI failures, fixing trivial CI issues, and keeping PRs/MRs moving without manual intervention. |
| Routing | `using-chrisbanes-skills` | `references/using-chrisbanes-skills/DOC.md` | Use when a Kotlin, Android, or Jetpack Compose task is too broad for any single focused skill to obviously apply, especially for general review, refactor, architecture, state, performance, testing, or UI API design work. |
