# 07 · Bound SVG

Controls and an SVG drawing share the same values. Change a value and watch the shape follow: binding works for SVG geometry as well as HTML text.

**Uses:** Source, Data, pointers and native binding — core 0.2.0. No endpoint calls.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Use the same Data value for a native control and SVG geometry.

**Before this lesson:** [e08 · SVG shapes](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/08_svg_shapes.md), [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/04_native_editing.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **b07 · Bound SVG** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

The circle’s radius/fill and bar’s width/fill are pointers; their controls write the same paths. Radius and width ranges are live. SVG `fill` and `stroke` are presentation attributes, not HTML style shortcuts.

```python
controls.input(type="range", min=5, max=80, value="^.radius", live=True, id="radius")
art.circle(cx=100, cy=100, r="^.radius", fill="^.fill", id="circle")
art.text("^.radius", x=100, y=190, text_anchor="middle", fill="currentColor", id="radius-label")
```

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. The circle begins at radius 40; its numeric label also shows 40. The bar width is 160.
2. Drag Radius to 60: both circle and label follow, while the bar remains unchanged.

## Change it and check yourself

Add a range bound to `.cy` (min 40, max 160), initialize it with `pane.dataSetter(".cy", 100)`, and replace the circle’s `cy=100` with `cy="^.cy"`.

**Answer:** moving the new range moves the same circle vertically; radius remains controlled independently. There is no new Source lookup or attribute-setting action.

## The same example across stages

Earlier e13 explicitly called `setAttr` on a Source node for each animated coordinate. For user-controlled geometry here, one pointer replaces repeated update calls. The two lessons solve different triggers: this is a simplification of value synchronization, not an identical animation.

## Limits and next step

The range has to remain compatible with the viewBox; a large radius near an edge can be clipped. This lesson changes geometry, not SVG structure.

Continue with [b08 · Freeze](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/08_freeze.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
