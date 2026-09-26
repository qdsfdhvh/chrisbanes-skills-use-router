
# Using chrisbanes skills

## Core principle

Route by the decision the code needs, not by the number of APIs mentioned.
Load one cluster when its shared procedure owns the concern; add a specialist
only when its independent behavior changes the same work.

## Routing procedure

1. Read the task. For Kotlin or Compose work, inspect the source that makes the
   concern concrete. For an Android benchmark comparison, inspect the supplied
   reports, configurations, and traces instead.
2. If one focused skill clearly matches, load it directly and stop routing.
3. Before loading a Compose skill, point to a concrete Compose API or composable
   in the inspected source, or to an explicit request to create or design
   Compose code. A hypothetical UI consumer is not evidence. If neither form
   of evidence exists, stay in the Kotlin cluster even when the task mentions
   UI, routes, or navigation.
4. Match each observed code signal to the table below.
5. Add a second skill only when it owns an independent decision in the same
   change; do not load adjacent skills speculatively. For example, a flow
   delivery defect plus a separate catch-all over a sealed route needs both
   `kotlin-concurrency-and-flow` and `kotlin-control-flow`. Load the latter
   because the branch mapping needs an explicit decision, including whether a
   data-bearing subtype's payload is used through a smart cast or deliberately
   discarded, not merely because a `when` appears in the file.
6. Finish routing when every material concern has one focused owner and those
   skills are loaded before advice or edits.

## Common routes

| Task signal | Start with |
|---|---|
| Evidenced Compose state, effects, screen ownership, or UI event collection | [`compose-state-and-effects`](../compose-state-and-effects/DOC.md) |
| Recomposition, stability, frame-rate reads, back-writing, or `@ReadOnlyComposable` | [`compose-performance`](../compose-performance/DOC.md) |
| Component modifiers, caller placement, slots, or public content shape | [`compose-component-design`](../compose-component-design/DOC.md) |
| Visibility, value, transition, content-swap, or other motion API choice | [`compose-animations`](../compose-animations/DOC.md) |
| Keyboard, TV, D-pad, focus targets, custom traversal, or key events | [`compose-focus-navigation`](../compose-focus-navigation/DOC.md) |
| Compose UI, screenshot, semantics, focus/key, or interaction-state tests | [`compose-ui-testing-patterns`](../compose-ui-testing-patterns/DOC.md) |
| Coroutine ownership, raw `Thread` or `Executor` work, cancellation, Flow state/events, sharing, or replay | [`kotlin-concurrency-and-flow`](../kotlin-concurrency-and-flow/DOC.md) |
| Kotlin classification, `when`, guards, exhaustiveness, smart casts, or null branches | [`kotlin-control-flow`](../kotlin-control-flow/DOC.md) |
| Kotlin function ownership, domain types, expect/actual, or platform seams | [`kotlin-api-design`](../kotlin-api-design/DOC.md) |
| Planned Gradle execution or a Gradle-centered warning/failure workflow | [`gradle-run`](../gradle-run/DOC.md) |
| Comparing physical Android benchmark configurations, reversed rankings, or an Android default | [`android-benchmark-comparison`](../android-benchmark-comparison/DOC.md) |
| Kotlin library release preparation, publication, or readiness | [`release-kotlin-library`](../release-kotlin-library/DOC.md) |

## Combination boundaries

- Add [`kotlin-concurrency-and-flow`](../kotlin-concurrency-and-flow/DOC.md)
  to Compose state work only when delivery, replay, sharing, or cancellation is
  a separate concern. Add state ownership or performance only when animation
  work changes that concern too.
- Pair focus navigation with UI testing when the task also needs a test shape.
  For a focus-aware `AnimatedContent` swap, load Compose animations as well:
  rendering each outgoing and incoming branch from its content-lambda target
  is a separate identity decision from focus timing and the interaction test.
- Add [`kotlin-control-flow`](../kotlin-control-flow/DOC.md) when a Kotlin
  concern also has an independent branch decision, such as a catch-all over a
  sealed result that hides cases or branch payload. Plain route delivery with
  no separate branching issue does not need it. Do not add Compose without the
  evidence required in step 3.
- Encapsulating a Compose snapshot property behind a read-only public accessor
  remains one state-ownership decision. Do not add `kotlin-api-design` merely
  because the accessor is public; add it when the same change also needs a
  separate function-ownership, domain-type, compatibility, or platform-boundary
  decision.
- Load [`gradle-run`](../gradle-run/DOC.md) only for planned Gradle execution
  or an existing Gradle workflow, not incidental Kotlin or Compose advice.
