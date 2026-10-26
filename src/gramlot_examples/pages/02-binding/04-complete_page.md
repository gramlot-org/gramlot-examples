# A complete page driven by Data

**Try this:** Edit the page's bound controls and follow the repeated values in the complete page. Compare this live version with the earlier static page.

The event page from **A complete page** now follows shared Data. Change one value and see it update in several places. You learn how to make an existing page interactive while retaining its structure.

**Uses:** Source, Data, pointers and native binding. No endpoint calls.

<details>
<summary>More detail</summary>

**Goal:** Revisit the event page with shared Data driving several destinations.

**Before this lesson:** [e12 · Complete page](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/04-page_composition/03-complete_page.md), [b05 · Checkbox and radio](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/02-checkbox_radio.md), [b06 · Style and visibility](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/03-presentation/01-style_and_visibility.md), [b10 · SVG shapes with binding](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/03-presentation/03-svg_shapes.md).

## Read the page

The `event` Data record drives the title, speaker visibility, map selection and FAQ. `html_main`, stored in `main_content`, is the HTML landmark.

```python
header.h1("^.title", id="title")
header.input(value="^.title", live=True, id="title-field")
# In the hero:
hero.p("^.title")
```

One speaker flag controls the schedule row and speaker card. The joint session has no visibility pointer and stays visible. Radio booleans control the map rings; both FAQ disclosures bind `open` to one flag.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Edit Event title: heading and hero text change together.
2. Uncheck Sessions of Theo: his solo row and card become invisible while retaining space; the joint session remains.
3. Choose Hall: its ring appears and Studio’s disappears. Check Open all answers: both FAQ answers open.

## Change it and check yourself

In `04-complete_page_data.tytx`, change `event.title` and set `event.show.theo` to false.

**Answer:** both title destinations get the new value and both Theo destinations start invisible. You change initial Data once for each concept, not every affected Source node.

## The same example across stages

**Earlier e12:** schedule, cards and FAQ are static, and the map has no selection.

**Later 0.2.0:** `visible="^.show.theo"` can be reused for both Theo destinations; `open="^.faq_open"` controls both answers. A set of declarative pointers replaces separate per-destination update routines. The title is deliberately reused in the hero, whose earlier static description differed. The page also omits the earlier Highlights section: this is a teaching variation, not a pixel-identical rewrite.

## Limits and next step

The map has no routing service. Manually toggling a native disclosure is not declared as a write-back to `.faq_open`; the shared checkbox is the state-control demonstration. No server save or booking is performed.

Continue with [c01 · Formula](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/01-formula.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-070) explains the full contract.

**Sample data:** `04-complete_page_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
