# Expandable sections and progress indicators

Expandable details, a progress bar and a meter. You learn how to declare controls whose basic behavior is already supplied by the browser.

**Uses:** Source and native HTML/SVG — core 0.1.x. No Data binding.

<details>
<summary>More detail</summary>


**Release stage:** Source foundation (core 0.1.x); maintained syntax is used here.

**Goal:** Recognize behavior supplied by native HTML rather than application code.

**Before this lesson:** [e03 · Lists](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/08-html_svg/01-html_basics/03-lists.md), [e04 · Semantic page](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/08-html_svg/01-html_basics/04-semantic_page.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **e07 · Native disclosure** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

Each `details` contains a `summary` and answer paragraph. The browser toggles the disclosure. `progress(value=70, max=100)` and `meter(value=8, max=10)` are fixed measurements, with explicit labels.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Open and close “What is Source?”. The answer changes visibility without an authored controller.
2. Wait: Preparation remains 70% and Quality remains 8 of 10.

## Change it and check yourself

Add another question/answer to the tuple and change the progress value to 80 **and** its label to “Preparation: 80%”.

**Answer:** another disclosure and an 80% bar appear after reload. Updating only the bar would leave a misleading label; this stage has no binding to keep them synchronized.

## The same example across stages

Later b11 revisits the FAQ with `open="^.faq_open"`: one bound checkbox controls both disclosures. The framework projects that one value to each declaration; no list of manual open/close operations is needed.

## Limits and next step

No live task or background progress is being measured. Native disclosure is not Data binding.

Continue with [e08 · SVG shapes](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/08-html_svg/03-svg/01-svg_shapes.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
