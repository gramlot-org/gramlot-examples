# Bind SVG geometry and color

**Try this:** Move the geometry controls and change the color. The same six SVG shapes update through bound attributes without rebuilding the scene.

The six shapes from **SVG shapes** now have editable dimensions and stroke settings. You learn how pointers connect controls to the drawing without a separate update routine for each shape.

**Uses:** Source, Data, pointers and native binding. No endpoint calls.

<details>
<summary>More detail</summary>

**Goal:** Revisit the six-shape SVG with bound dimensions and shared stroke state.

**Before this lesson:** [e08 · SVG shapes](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/03-svg/01-svg_shapes.md), [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/01-native_editing.md), [b07 · Bound SVG](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/03-presentation/02-bound_svg.md).

## Read the page

The six shapes retain their positions. Width, radius, ellipse height, shared stroke, triangle color and caption now read Data. The ranges and caption text use `live=True`; the color field uses its native change behavior.

```python
art.circle(cx=172, cy=58, r="^.radius", default_r=38,
           fill="var(--gramlot-warning)", id="circle")
```

Line and polyline both read `.stroke`. Their initial shared width is 7; e08 originally used 8 for the line and 7 for the polyline, so this is an explicit small visual change, not exact pixel identity.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Begin with rectangle width 95, radius 38 and ellipse height 38.
2. Move Stroke width to 10: both line and polyline change together.
3. Type a new Label: the SVG caption follows each keystroke; changing Triangle color changes only the polygon.

## Change it and check yourself

Add a range for `.cx`, initialize it to 172, and replace only the circle’s `cx=172` with `cx="^.cx"`.

**Answer:** the control moves that circle without moving the ellipse or rectangle. No code for finding/updating the circle in DOM is needed.

## The same example across stages

Compare e08’s `r=38` with this page’s `r="^.radius", default_r=38`. Static structure stays; the range and circle now share Data. For stroke, one `.stroke` replaces two independently authored widths. The additional controls add code, while the binding removes the need to author separate synchronization behavior.

## Limits and next step

Not every control is live: the color field uses change. SVG presentation values retain their own types/units. This is a maintained current-API comparison, not an old-package installation exercise.

Continue with [b11 · Complete page with binding](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/04-complete_page.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-070) explains the full contract.

</details>
