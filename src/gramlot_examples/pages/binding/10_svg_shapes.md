# 10 · SVG shapes with binding

The six shapes from **SVG shapes** now have editable dimensions and stroke settings. You learn how pointers connect controls to the drawing without a separate update routine for each shape.

**Uses:** Source, Data, pointers and native binding — core 0.2.0. No endpoint calls.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Revisit the six-shape SVG with bound dimensions and shared stroke state.

**Before this lesson:** [e08 · SVG shapes](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/08_svg_shapes.md), [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/04_native_editing.md), [b07 · Bound SVG](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/07_bound_svg.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **b10 · SVG shapes with binding** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

The six shapes retain their positions. Width, radius, ellipse height, shared stroke, triangle color and caption now read Data. The ranges and caption text use `live=True`; the color field uses its native change behavior.

```python
art.circle(cx=172, cy=58, r="^.radius", fill="var(--gramlot-warning)", id="circle")
pane.dataSetter(".radius", 38)
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

Compare e08’s `r=38` with this page’s `r="^.radius"` and one setter. Static structure stays; the range and circle now share Data. For stroke, one `.stroke` replaces two independently authored widths. The additional controls add code, while the binding removes the need to author separate synchronization behavior.

## Limits and next step

Not every control is live: the color field uses change. SVG presentation values retain their own types/units. This is a maintained current-API comparison, not an old-package installation exercise.

Continue with [b11 · Complete page with binding](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/11_complete_page.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
