# Text and links

Paragraphs, emphasis and links in one page. You learn how to combine text and elements, while keeping ordinary text safe to display.

**Uses:** Source and native HTML/SVG — core 0.1.x. No Data binding.

<details>
<summary>More detail</summary>


**Release stage:** Source foundation (core 0.1.x); maintained syntax is used here.

**Goal:** Compose mixed text and links while preserving literal text.

**Before this lesson:** [e01 · Hello World](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/08-html_svg/01-html_basics/01-hello_world.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **e02 · Text and links** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

The paragraph has text and `strong`, `em`, `span` and `a` children. The `pre().code(...)` pair presents code as text. A fragment link uses the HTML `id`, not a Source label.

```python
main_content.h3("A local destination", id="destination")
main_content.a("Jump back to the heading", href="#destination")
```

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Find the literal `<tag>` text: it is displayed, not turned into an element.
2. Activate “Jump back to the heading”: the browser moves to “A local destination”. The standards link opens an external page separately.

## Change it and check yourself

Add `main_content.h3("More", id="more")` and `main_content.a("Read more", href="#more")`.

**Answer:** the new link jumps to the new heading. Changing only `href` to `#missing` does not create a destination: the two names must match.

## Limits and next step

The external link needs a network connection. Local links are native browser navigation, not a Gramlot router or a request for remote Source.

Continue with [e03 · Lists](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/08-html_svg/01-html_basics/03-lists.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
