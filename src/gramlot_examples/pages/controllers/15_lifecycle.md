# 15 · Lifecycle

Start and stop a branch, then remove it. You learn when its lifecycle actions run and which work ends with that branch.

**Uses:** Source, Data, controllers and lifecycle (0.2.0); module layout from 0.2.5.

<details>
<summary>More detail</summary>


**Release stage:** core 0.2.0; the maintained Page/Logic file layout is from 0.2.5.

**Goal:** Predict when a branch starts and which work ends when it is removed.

**Before this lesson:** [c03 · Named logic](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/03_named_logic.md), [c06 · Button controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/06_button_controller.md), [b08 · Freeze](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/08_freeze.md).

**Open and edit:** open this page in your environment's gallery. Read Python first; Python builds Source on the host and named JavaScript Logic runs in the browser. The JavaScript Page is the equivalent host/Worker declaration. The gallery shows source; to change it, copy the page into your editable project following the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md). Read the **logic.js** tab (the Logic class from `15_lifecycle.js`) when using Python. Reload after source edits.

## Read the page

The same branch contains three named controllers. Each labels a different hook:

```python
observed.dataController(func="record", stage="init", _init=True)
observed.dataController(func="record", stage="built", _onBuilt=True)
observed.dataController(func="record", stage="start", _onStart=True)
```

Data setters run before these hooks. `_init` installs initial behavior, `_onBuilt` follows the first successful build, and `_onStart` follows readiness. A separate timer controller uses `_timing=1` (seconds). Hook delays, if numeric, are milliseconds. The trace and tick count are ordinary Data, displayed outside the removable branch.

Inspect finds the branch by its `nodeId` with `gramlot.src.builder.nodeById('observed')`, which throws once the branch is removed, and then uses `gramlot.dom.getDomNode(sourceNode)` and `getBaseSourceNode(domNode)` for read-only identity lookup. It does not mutate the DOM. `nodeId` locates Source; the separate HTML `id` locates the rendered element.

## Try it and predict the result

1. Open the page: Hook trace becomes `init → built → start`. Data ticks begins at 1 because the timer also has `_onStart=True`.
2. Press Inspect: expect `Source → DOM → same Source`.
3. Freeze; wait two seconds. Both Data ticks and the number already built inside the branch continue increasing. Freeze defers structural Source projection, not updates to existing bound text.
4. Thaw: the three hooks are not appended again. Compare b08, where pending structural removals appear at thaw.
5. Remove branch and wait two seconds: its DOM disappears, the hook trace remains unchanged and ticks stop. Timer cancellation is observed from the stopped counter; the page does not invent a disposal hook. Inspect now reports `Source branch absent`. Reload to restore the original branch.

## Change it and check yourself

Change `_timing=1` to 2 in the Python timer declaration (or `_timing: 2` in JS), then reload.

**Answer:** the initial start still adds one tick; subsequent ticks are about two seconds apart. Do not change `_onStart` to 2 expecting seconds: its numeric delay uses milliseconds.

Advanced: freeze, then remove the branch before thawing. The Data ticks stop even though the frozen DOM remains visible. Inspect reports that Source is absent. The buttons no longer find that removed Source branch, so reload to reset this trial. Use the Data count as the cleanup evidence, not whether old pixels are still visible.

## The same example across stages

b08 introduced a frozen visual branch. This lesson revisits it with explicit lifecycle observations. `_timing` owns repeated controller scheduling and cancellation, as in e13: no page timer handle or `clearInterval` is needed. Source/DOM lookup is diagnostic; it does not introduce another state system.

## Limits and next step

Freeze defers structural projection and insertion/rebuild work; existing nodes still follow Data. Removing a branch is different from hiding it. This page uses named Logic; no new lifecycle hook or timer implementation is invented. Full page disposal also ends its providers. Late startup and insertion while frozen are advanced contract cases, not extra steps needed for the basic trace.

Continue with [c16 · Attribute projection](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/16_attribute_projection.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-080) provides the full contract.

</details>
