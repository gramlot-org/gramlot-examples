# 05 · Tables

A table with headings, rows and a total. You learn how to turn a small dataset into a readable table without repeating the row declarations.

**Uses:** Source and native HTML/SVG — core 0.1.x. No Data binding.

<details>
<summary>More detail</summary>


**Release stage:** Source foundation (core 0.1.x); maintained syntax is used here.

**Goal:** Derive rows and totals from one fixed dataset.

**Before this lesson:** [e03 · Lists](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/03_lists.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **e05 · Tables** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

`ROWS` contains North (12, 8), South (9, 11) and West (15, 6). `thead`, `tbody` and `tfoot` give the table structure; `scope` identifies row/column headings. Python computes `q1 + q2` before writing each cell.

```python
for value in (q1, q2, q1 + q2):
    row.td(str(value))
```

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Check row totals: 20, 20 and 21.
2. Check the footer: Q1 = 36, Q2 = 25, total = 61. Explain why both totals use the same tuples.

## Change it and check yourself

Add `("East", 2, 3)` to `ROWS` and reload.

**Answer:** the new row totals 5; the footer becomes 38, 28 and 66. No cell-specific arithmetic needs editing, because the loop and sums read the enlarged dataset.

## The same example across stages

In the later 0.2.0 c01 lesson, the same idea of a computed total becomes `dataFormula`: inputs change Data and the framework schedules recomputation. The old static calculation remains valid for a fixed report.

## Limits and next step

The totals are fixed in the built Source. Editing a constant requires a rebuild/reload; it does not establish live formulas.

Continue with [e06 · Forms](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/06_forms.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
