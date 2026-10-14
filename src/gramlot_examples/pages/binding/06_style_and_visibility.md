# 06 · Style and visibility

Controls change an element’s appearance and visibility. You learn how Data drives styles and classes, and how hiding content differs from removing its space in the layout.

**Uses:** Source, Data, pointers and native binding — core 0.2.0. No endpoint calls.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Predict attribute precedence and distinguish visibility from layout removal.

**Before this lesson:** [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/04_native_editing.md), [b05 · Checkbox and radio](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/05_checkbox_radio.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **b06 · Style and visibility** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

The box binds class, style, color, background, size, radius and visibility to Data. Supported class/style values are strings or null. CSS shortcuts compose the style and take precedence over a duplicate property in `style`.

`visible=False` sets hidden visibility but retains space; native `hidden=True` removes the box from layout. Use CSS units such as `1.5rem` for font size.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Expect a blue box, white text, dashed border, 1.5rem font and rounded corners.
2. Replace the style field with `color: red` and leave it: the color shortcut still makes the text white; replacing the style string also removes its old border declaration.
3. Uncheck visible: the space remains. Then check hidden: the space collapses.

## Change it and check yourself

Restore visible, clear hidden and choose 2rem with 24px corners.

**Answer:** the same box changes appearance from Data; its text and Source structure are unchanged. A null shortcut removes its own property, not every other style declaration.

## Limits and next step

Stay with the agreed string/null contract. The development review has a pending renderer-parity correction for rejection of unsupported class/style types; this lesson does not teach object coercions or rely on them.

Continue with [b07 · Bound SVG](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/07_bound_svg.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
