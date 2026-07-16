---
name: chrisbanes-skills-use
version: "2026.7.8"
description: "Use this skill when a Kotlin, Android, Jetpack Compose, Compose Multiplatform, coroutine, Flow, KMP, UI testing, UI API design, recomposition/performance, focus/navigation, animation, or PR shepherding task may benefit from chrisbanes/skills but installing or triggering every focused skill would be too broad. Route broad or unclear tasks through the copied using-chrisbanes-skills guide, then read only the focused reference docs it selects."
---

# Chrisbanes Skills Use

This skill is a lightweight router for the `chrisbanes/skills` skill set.

Use `references/using-chrisbanes-skills/DOC.md` as the canonical upstream guide
for choosing focused skills. Read that guide before detailed advice, review
findings, or code edits unless the user names a narrow concern that clearly
matches one focused skill.

Do not assume the router body is enough for execution details. The copied docs
contain the actual guidance, examples, and cross-skill routing. After
`using-chrisbanes-skills` selects focused skills, read only those
`references/<skill-name>/DOC.md` files.

## Routing Rules

- Read `references/using-chrisbanes-skills/DOC.md` first for broad or unclear
  Kotlin, Android, and Jetpack Compose work.
- Match narrow requests against the original skill descriptions below only when
  one focused skill clearly applies.
- Read the selected focused `DOC.md` files before applying guidance in those
  areas.
- Read additional copied files under the selected skill only when that skill
  tells you to or when that specific resource is needed.
- If the original focused skills are already installed and one clearly matches,
  use it directly instead of this router.

## Original Skill Index

| Category | Skill | Reference doc | Description |
| --- | --- | --- | --- |
| Primary Router | `using-chrisbanes-skills` | `references/using-chrisbanes-skills/DOC.md` | Use when a Kotlin, Android, or Jetpack Compose task is too broad for any single focused skill to obviously apply, especially for general review, refactor, architecture, state, performance, testing, or UI API design work. |
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
