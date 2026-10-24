# Compose an SVG scene

An SVG scene assembled from smaller parts. You learn how groups and reusable page-building methods keep a larger drawing easy to follow.

**Uses:** Source and native HTML/SVG — core 0.1.x. No Data binding.

<details>
<summary>More detail</summary>


**Release stage:** Source foundation (core 0.1.x); maintained syntax is used here.

**Goal:** Reuse Source-building methods to compose a scene.

**Before this lesson:** [e03 · Lists](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/08-html_svg/01-html_basics/03-lists.md), [e08 · SVG shapes](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/08-html_svg/03-svg/01-svg_shapes.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **e09 · SVG composition** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

`house`, `tree` and `flower` populate a group in the same SVG. A transform moves the whole group, so its child coordinates stay local.

```python
for x in (115, 330):
    self.house(drawing, x)
# Inside house:
group = drawing.g(transform=f"translate({x} 0)")
```

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Count two houses, three trees and three flowers.
2. Compare the two houses: their child declarations are shared; only the group translation differs.

## Change it and check yourself

Change the house positions to `(115, 330, 210)` and reload.

**Answer:** three houses are built. The added one can overlap existing scenery: a loop reuses declarations but does not automatically solve layout. Try a wider viewBox or deliberate repositioning.

## Limits and next step

These are ordinary Page helper methods building Source, not a recipe registry or component API. The scene is static.

Continue with [e10 · Cards with icons](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/08-html_svg/04-page_composition/01-cards_with_icons.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
