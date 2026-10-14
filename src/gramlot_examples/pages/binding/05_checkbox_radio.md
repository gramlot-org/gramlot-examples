# 05 · Checkbox and radio

Checkboxes and radio buttons control boolean values. You learn how to represent yes/no choices and how radio buttons keep a single choice selected.

**Uses:** Source, Data, pointers and native binding — core 0.2.0. No endpoint calls.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Model checkboxes and a radio group as boolean Data.

**Before this lesson:** [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/04_native_editing.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **b05 · Checkbox and radio** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

A checkbox’s bound `value` is boolean. Each radio has a separate boolean path; `group="plan"` makes them mutually exclusive. The runtime supplies the DOM group name.

```python
row.input(type="radio", group="plan", value=f"^.plan.{key}", id=key)
```

Only `.plan.plus` starts true. Basic and Team begin null; selecting one writes it true and writes the previously selected path false.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Newsletter is checked, Paper invoice is off and Plus is selected.
2. Choose Team: Plus becomes false, Team true, Basic remains empty.
3. Choose Basic: Basic becomes true, Team false, Plus stays false.

## Change it and check yourself

Add `("pro", "Pro")` to `PLANS` and include `plan.pro` in the displayed key list.

**Answer:** the new radio joins the same group. On selection it becomes true and the old selection becomes false. No manual loop clearing all radio paths is necessary.

## Limits and next step

A radio’s bound value is not a string enum. Unselected paths need not all have been written false. Use the existing `group` contract rather than assigning a shared native name manually.

Continue with [b06 · Style and visibility](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/06_style_and_visibility.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
