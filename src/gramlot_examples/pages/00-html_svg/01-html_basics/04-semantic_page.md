# Semantic page

**Try this:** Use Story and Notes to move between sections. Compare header, navigation, main, article and footer with the structure in the source.

A page with a header, navigation, main content and footer. You learn how HTML gives each part a role and how links lead to sections within the page.

**Uses:** Source and native HTML/SVG. No Data binding.

<details>
<summary>More detail</summary>

**Goal:** Build semantic regions and connect navigation to their IDs.

**Before this lesson:** [e02 · Text and links](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/02-text_and_links.md), [e03 · Lists](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/03-lists.md). 

## Read the page

The Source declares `header`, `nav`, a main landmark, an `article`, an `aside` and `footer`. `aria_label` names the navigation. The Story and Notes links target `id="story"` and `id="notes"`.

```python
nav.a("Story", href="#story")
article = main_content.article(id="story", class_="stack")
```

Here `main_content` is an element variable, distinct from the Page method `main(root)`.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Activate Notes, then Story. Each link targets its section inside the preview.
2. Inspect the Source: visual cards and semantic landmarks are declarations, not a separate HTML template.

## Change it and check yourself

Add `main_content.article(id="references").h2("References")` and a navigation link with `href="#references"`.

**Answer:** a third destination appears; the browser handles the jump. Adding a link alone would not create an article.

## Limits and next step

Landmark markup does not by itself prove accessibility of an entire application. This lesson has no client router or database.

Continue with [e05 · Tables](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/05-tables.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
