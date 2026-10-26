# Expandable sections and progress indicators

**Try this:** Open and close each question. The progress bar and meter show fixed example values; opening a question does not start a task.

Expandable details, a progress bar and a meter. You learn how to declare controls whose basic behavior is already supplied by the browser.

**Uses:** Source and native HTML/SVG. No Data binding.

<details>
<summary>More detail</summary>

**Goal:** Recognize behavior supplied by native HTML rather than application code.

**Before this lesson:** [e03 · Lists](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/03-lists.md), [e04 · Semantic page](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/04-semantic_page.md). 

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

Continue with [e08 · SVG shapes](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/03-svg/01-svg_shapes.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
