# Compose an SVG scene

**Try this:** Find the repeated houses, trees and flowers. Each small method receives a position; loops reuse those methods to create one scene.

An SVG scene assembled from smaller parts. You learn how groups and reusable page-building methods keep a larger drawing easy to follow.

**Uses:** Source and native HTML/SVG. No Data binding.

<details>
<summary>More detail</summary>

**Goal:** Reuse Source-building methods to compose a scene.

**Before this lesson:** [e03 · Lists](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/03-lists.md), [e08 · SVG shapes](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/03-svg/01-svg_shapes.md). 

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

Continue with [e10 · Cards with icons](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/04-page_composition/01-cards_with_icons.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
