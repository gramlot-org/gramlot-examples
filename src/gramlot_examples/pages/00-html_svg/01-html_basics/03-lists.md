# Ordered, nested and definition lists

**Try this:** Match each visible list to its loop. Add one item in your own copy; the loop supplies its markup without another hand-written block.

Bullet lists, numbered lists and terms with descriptions. You learn how a loop builds several elements from a set of values when the page is created.

**Uses:** Source and native HTML/SVG. No Data binding.

<details>
<summary>More detail</summary>

**Goal:** Distinguish a Python build-time loop from reactive Data.

**Before this lesson:** [e01 · Hello World](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/01-hello_world.md), [e02 · Text and links](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/02-text_and_links.md). 

## Read the page

`STEPS` drives an ordered list, `TERMS` drives paired `dt`/`dd` nodes, and a nested `ul` is a child of one `li`.

```python
ordered = main_content.ol()
for step in STEPS:
    ordered.li(step)
```

The loop runs when the host builds Source; the list on screen is its result.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Count three ordered steps, two definition pairs and a nested list.
2. Reload: the same constants produce the same nodes; no timer or subscription appends rows.

## Change it and check yourself

Append `"Explain the result"` to `STEPS` and `("DOM", "The browser representation.")` to `TERMS`.

**Answer:** after reload there are four ordered items and three definition pairs. Existing nested items are unaffected because their loop uses another collection.

## Limits and next step

A Python list constant is not a Data Bag subscription. Later changing a Data value does not rerun this Python loop.

Continue with [e04 · Semantic page](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/04-semantic_page.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
