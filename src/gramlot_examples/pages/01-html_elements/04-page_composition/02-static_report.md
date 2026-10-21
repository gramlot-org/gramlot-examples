# 11 · Static report

A report with a summary, chart and table, all built from the same data. You learn how to reuse those values to create consistent views.

**Uses:** Source and native HTML/SVG — core 0.1.x. No Data binding.

<details>
<summary>More detail</summary>


**Release stage:** Source foundation (core 0.1.x); maintained syntax is used here.

**Goal:** Keep a summary, chart and table consistent with one dataset.

**Before this lesson:** [e05 · Tables](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/01-html_elements/01-html_basics/05-tables.md), [e08 · SVG shapes](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/01-html_elements/03-svg/01-svg_shapes.md), [e09 · SVG composition](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/01-html_elements/03-svg/02-svg_composition.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **e11 · Static report** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

`REGIONS` drives the summary, SVG bars, legend and table. Initially North = 12, South = 9 and West = 15, total 36. Each bar width is `value * 23`; the label’s position also uses that value. The SVG title is separate literal text.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Check the total 36 and region count 3.
2. Compare the longest bar with the table: West has 15, so its bar is 345 viewBox units wide.

## Change it and check yourself

Change North from 12 to 14. Update the literal SVG title from “North 12” to “North 14”, then reload.

**Answer:** total 38, still three regions, and North’s bar width 322. The visible table/chart recompute from the tuple; the accessible title needed an explicit edit because it is literal.

## Limits and next step

This is a static report. Do not call it a live data service, and do not leave the accessible description stale when changing its dataset.

Continue with [e12 · Complete page](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/01-html_elements/04-page_composition/03-complete_page.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
