# Project attributes and preview HTML

**Try this:** Edit the bound value and compare its text, attributes and HTML preview. The preview is sandboxed and does not execute scripts.

One name appears in a greeting and a tooltip with different formatting. You learn how templates and masks reuse a bound value without copying text. The later **0.2.3** section previews HTML in a separate sandboxed frame.

**Uses:** Data binding, explicit pointer templates and text masks; sandboxed Data `srcdoc` only in the later part (0.2.3).

<details>
<summary>More detail</summary>

**Goal:** Reuse one Data value in text and attributes, then distinguish text from a sandboxed HTML document.

**Before this lesson:** [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/01-pointers.md), [b06 · Style and visibility](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/03-presentation/01-style_and_visibility.md), [c04 · Inline expressions](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/04-inline_expressions.md).

## Read the page

A template reads another attribute of its own Source node **after pointer resolution**:

```python
pane.div("Hover to read the title", customer="^.name",
         title="^.name:Customer: {customer}")
pane.p("^.name", mask="Hello, {}")
```

`:` opens the pointer template. `{customer}` reads the current Source attribute; `customer` remains a normal projected DOM attribute. Ordinary `${customer}` is literal text. `mask` formats the projected text; it does not enable HTML. The maintained syntax uses `{}`; older releases used `%s`.

The later section uses `pane.iframe(srcdoc="^.html", ...)`. Data-provided HTML gets `sandbox=""`: it is an isolated document, with scripts/forms/popups blocked by default. Ordinary `pane.p("^.html")` would show literal markup instead.

## Try it and predict the result

1. Initially the greeting is “Hello, Ada”; hover the card and expect title “Customer: Ada”.
2. Type Grace: both follow the same Data value. Inspect the card: it has both the formatted `title` and the resolved `customer` attribute.
3. Clear Name: the greeting becomes empty; the title retains its authored prefix.
4. Replace Preview HTML with `<h2>Preview two</h2><p>Only this frame changes.</p>`. The heading appears inside the frame; the outer page stays intact. Inspect the iframe's `sandbox` attribute: it is present with an empty value.

## Change it and check yourself

Change the mask to `Welcome, {}` and the title to `^.name:Guest: {customer}`. Leave the Data pointer alone.

**Answer:** one Name edit still updates both destinations with different formatting; no extra provider or shared formatted Data value is needed.

Separate invalid-edit exercise: rename only the template slot to `{missing}`, then reload. Expect a missing Source-attribute error. Restore it. Use `:=` for an expression with typed slots; ordinary `${...}` text is not interpolated or consumed.

## The same example across stages

e02 taught literal text; b01 added a pointer. The 0.2.0 stage now adds presentation around that same value without a controller copying strings into multiple outputs. The 0.2.3 section is explicitly later: an iframe preview is not a replacement for safe literal text, and the sandbox does not imply a widget or raw-HTML injection API.

## Limits and next step

Templates apply to visual attributes, not node text or data-element declarations. A static Python f-string runs on the host once. A mask never interprets HTML. Keep the default empty sandbox for this exercise; do not add script permissions. A literal authored srcdoc has a different contract. JavaScript counterparts use quoted template text here, not JS backtick interpolation.

Continue with [c17 · Data exchange](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/03-data_exchange.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-130) provides the full contract.

**Sample data:** `03-attribute_projection_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
