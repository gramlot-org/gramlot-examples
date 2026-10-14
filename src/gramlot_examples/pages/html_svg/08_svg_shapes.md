# 08 · SVG shapes

Six SVG shapes with different sizes, fills and strokes. You learn how to describe a drawing alongside HTML. Later, **SVG shapes with binding** makes these shapes respond to controls.

**Uses:** Source and native HTML/SVG — core 0.1.x. No Data binding.

<details>
<summary>More detail</summary>


**Release stage:** Source foundation (core 0.1.x); maintained syntax is used here.

**Goal:** Read SVG geometry and distinguish Source attributes from CSS.

**Before this lesson:** [e01 · Hello World](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/01_hello_world.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **e08 · SVG shapes** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

An HTML `figure` contains one SVG viewport (`viewBox="0 0 480 200"`), six shapes and a label. The SVG title supplies the accessible name. `cx`, `cy` and `r` describe the circle in viewBox coordinates.

```python
art.circle(cx=172, cy=58, r=38, fill="var(--gramlot-warning)")
```

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Locate the circle between the rectangle and ellipse.
2. Compare its radius 38 with the ellipse’s separate `rx=26` and `ry=38`: a circle has one radius, an ellipse has two.

## Change it and check yourself

Change only the circle’s `cx` from 172 to 182 and reload.

**Answer:** its center moves ten viewBox units right; its radius and fill do not change. This is a new Source build, not animation.

## The same example across stages

In **0.2.0**, [b10 · SVG shapes with binding](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/10_svg_shapes.md) returns to these six shapes. `r=38` becomes `r="^.radius"`; a range and the circle share `.radius`. A pointer replaces explicit Source-attribute updates for each edit. The initial drawing is comparable, but interaction is new.

## Limits and next step

Coordinates and SVG presentation attributes are not HTML style shortcuts. This stage has no controls or animation.

Continue with [e09 · SVG composition](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/09_svg_composition.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
