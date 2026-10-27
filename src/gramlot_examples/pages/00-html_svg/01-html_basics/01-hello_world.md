# Your first page: headings and text

**Try this:** Compare the two element calls with the heading and paragraph. In your own copy, add a second paragraph and reload: one extra call creates one extra element.

A small page with a heading and a greeting. You learn how to create elements and nest them to build a page.

**Uses:** Source and native HTML/SVG. No Data binding.

<details>
<summary>More detail</summary>

**Goal:** Explain how a Page produces a Source tree, then add one visible element.

**Before this lesson:** [setup and release sequence](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md). 

## Read the page

`Page` extends `BasePage`; the adapter calls `main(root)`. Each element call adds a typed Source node. The browser renders that tree; the Python code does not manipulate DOM. The server links the shared theme to the page.

```python
main_content.h1("Hello, Gramlot!")
main_content.p("This heading and paragraph come from a Source tree.")
```

Here `main_content` is the local variable holding the main element, not the Page instance (`self`).

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Open the page: expect one main landmark, one heading and one paragraph.
2. Compare Python and JavaScript source: both declare that same hierarchy. There is no input or application state to change.

## Change it and check yourself

Add `main_content.p("My second paragraph")` immediately after the existing paragraph. Predict the count, save and reload.

**Answer:** two paragraphs appear below the same heading. The new call created another Source child; no separate DOM insertion code is needed.

## The same example across stages

Keep this static stage. Later, b01 replaces literal text with a Data pointer; the heading can then change without re-running `main`. That adds reactivity rather than making this two-line static example shorter.

## Limits and next step

An element call inside `main` builds structure once. Changing the source file is not a live Data update. Text is literal, not HTML markup.

Continue with [e02 · Text and links](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/02-text_and_links.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
