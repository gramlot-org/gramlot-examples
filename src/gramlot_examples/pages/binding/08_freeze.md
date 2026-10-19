# 08 · Freeze

Freeze a list, add or remove items, then thaw it. You learn that structural changes can wait while existing Data bindings keep working. Return here after **Named logic** and **Button controller**.

**Uses:** Source freeze/thaw, Data binding and local controllers (0.2.0); shared Page/Logic module layout from 0.2.5.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0). The maintained Page/Logic module arrangement is from 0.2.5; it does not move the original behavior into a later release.

**Goal:** Observe immediate Data updates and deferred structural rendering separately.

**Before this lesson:** [e10 · Cards with icons](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/10_cards_with_icons.md), [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/01_pointers.md), [c03 · Named logic](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/03_named_logic.md), [c06 · Button controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/06_button_controller.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **b08 · Freeze** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

The buttons call named `Logic` methods through nested `dataController` declarations. Freeze targets the `board` Source node, which the Logic finds by its `node_id` with `gramlot.src.builder.nodeById`. `add` increments `.count`; despite the method’s short name, it does **not** create a list item. `removeLast` deletes a Source child.

```python
actions.button(label, id=method).dataController(func=method)
```

Existing Data bindings continue while the branch is frozen. Source removal takes effect semantically at once; DOM rebuilding waits until unfreeze.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python. Read the gallery’s **logic.js** tab (the Logic class from `08_freeze.js`) beside the Python source.

## Try it and predict the result

1. Start with count 0, frozen false and three items. Click Freeze.
2. Click Increment Data count: count becomes 1 immediately. Remove last item twice: three items are still visible.
3. Click Thaw: only Item 1 remains; count is still 1 and frozen is false.

## Change it and check yourself

Reload, freeze, increment twice, remove once, then thaw.

**Answer:** count 2 is visible before thaw; two list items are visible after thaw. The Data counter is deliberately independent of list length, so it must not be used as an item count.

## Limits and next step

Freeze is not a transaction, a Data pause or a persistence mechanism. Removed nodes stop participating even while old DOM waits for thaw. Avoid adding arbitrary DOM operations to “force” the visual change.

Continue with [b09 · Forms with binding](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/09_forms.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md#gc-095-030) explains the full contract.

</details>
