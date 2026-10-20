# 04 · Native editing

A form displays the Data written by each control. Switch **live** on and off: you learn when typing updates Data and whether each control writes text, a number or a list.

**Uses:** Source, Data, pointers and native binding — core 0.2.0. No endpoint calls.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Observe when a control writes Data and which type it writes.

**Before this lesson:** [e06 · Forms](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/06_forms.md), [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/01_pointers.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **b04 · Native editing** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

Text and textarea write strings; number/range write numbers or null for an empty value; dates keep their string representation. Single select writes one value, multiple select a list. The checkbox controls `live` for the other fields.

```python
form.input(type=kind, value=f"^.{key}", live="^.live", id=key)
```

The right-hand values read those same paths. There is no application input-scraping handler.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. With live unchecked, type in Text without leaving it: the Data display stays “Edit me”. Leave the field: it updates.
2. Check live and type again: the display follows each input event.
3. Choose size L and change Topics: the Data stores a value and a list respectively.

## Change it and check yourself

Clear Number while live is on, then enter 7.

**Answer:** the empty control writes null (its display is empty), then numeric 7. It does not write the strings `"null"` or `"7"`. A date is still a date string; editing does not make it a Python datetime.

## The same example across stages

In e06 the browser edits native control values only. Here `value="^.text"` plus a Data setter replaces the literal default and connects editing to application state. The mirrored display needs only another pointer; no per-control copying routine is introduced.

## Limits and next step

Use `change`/leaving the field for the non-live trial; do not rely on Enter having identical behavior in every native control. Browser validation and picker presentation vary.

Continue with [b05 · Checkbox and radio](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/05_checkbox_radio.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-070) explains the full contract.

</details>
