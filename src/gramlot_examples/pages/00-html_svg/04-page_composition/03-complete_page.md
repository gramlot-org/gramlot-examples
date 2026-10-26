# Build a complete event page

**Try this:** Use the page navigation, inspect the schedule and open a question. This complete static page combines the small HTML and SVG techniques from the earlier lessons.

A complete event page that combines the HTML and SVG pieces from this section. You learn how to organize a larger page into small building methods. Later, **Complete page with binding** makes the same page follow shared Data.

**Uses:** Source and native HTML/SVG. No Data binding.

<details>
<summary>More detail</summary>

**Goal:** Assemble a complete static page from already understood Source sections.

**Before this lesson:** [e04 · Semantic page](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/04-semantic_page.md), [e07 · Native disclosure](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/02-native_controls/02-native_disclosure.md), [e09 · SVG composition](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/03-svg/02-svg_composition.md), [e11 · Static report](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/04-page_composition/02-static_report.md). 

## Read the page

`main` calls helpers for header, hero, highlights, schedule, speakers, map and FAQ. The schedule and speaker cards read local tuples. Native anchor links connect the navigation to section IDs; the map is an SVG illustration.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Follow Schedule and count three sessions; Speakers shows Mira and Theo.
2. Open the FAQ about the map: it says the map is not interactive. There is no booking action.

## Change it and check yourself

Add a fourth session tuple, then change the table caption from “Three short sessions” to “Four short sessions”.

**Answer:** four rows appear after reload; the caption requires its own edit because it is literal. Adding a speaker to a session does not automatically add a speaker card: `SPEAKERS` is a separate dataset.

## The same example across stages

Keep this page as the earlier stage. In **0.2.0**, [b11 · Complete page with binding](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/04-complete_page.md) revisits the event page: one Data title drives multiple texts, one speaker flag controls both row and card, and one FAQ flag controls every answer. These shared pointers eliminate separate update code for each destination; the new controls make the later page richer rather than universally shorter.

## Limits and next step

“Complete” means a composed example of the features at this stage, not a booking application or coverage of all Gramlot APIs.

Continue with [e13 · Live Source playground](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/07-tools/01-live_source.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
