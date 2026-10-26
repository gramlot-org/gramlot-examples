# Text and links

**Try this:** Follow the local link and compare emphasis, quoted text and the code sample. The literal <tag> remains text rather than becoming an HTML element.

Paragraphs, emphasis and links in one page. You learn how to combine text and elements, while keeping ordinary text safe to display.

**Uses:** Source and native HTML/SVG. No Data binding.

<details>
<summary>More detail</summary>

**Goal:** Compose mixed text and links while preserving literal text.

**Before this lesson:** [e01 · Hello World](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/01-hello_world.md). 

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

Continue with [e03 · Lists](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/03-lists.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
