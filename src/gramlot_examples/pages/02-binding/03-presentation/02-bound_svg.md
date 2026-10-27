# Update SVG from Data

**Try this:** Move the controls and watch the drawing change. SVG attributes use the same Data bindings as text and form fields.

Controls and an SVG drawing share the same values. Change a value and watch the shape follow: binding works for SVG geometry as well as HTML text.

**Uses:** Source, Data, pointers and native binding. No endpoint calls.

<details>
<summary>More detail</summary>

**Goal:** Use the same Data value for a native control and SVG geometry.

**Before this lesson:** [e08 · SVG shapes](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/03-svg/01-svg_shapes.md), [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/01-native_editing.md).

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

Add a range bound to `.cy` (min 40, max 160), give that range `default=100`, and replace the circle’s `cy=100` with `cy="^.cy"`.

**Answer:** moving the new range moves the same circle vertically; radius remains controlled independently. There is no new Source lookup or attribute-setting action.

## The same example across stages

Earlier e13 explicitly called `setAttr` on a Source node for each animated coordinate. For user-controlled geometry here, one pointer replaces repeated update calls. The two lessons solve different triggers: this is a simplification of value synchronization, not an identical animation.

## Limits and next step

The range has to remain compatible with the viewBox; a large radius near an edge can be clipped. This lesson changes geometry, not SVG structure.

Continue with [b08 · Freeze](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/04-freeze.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-070) explains the full contract.

</details>
