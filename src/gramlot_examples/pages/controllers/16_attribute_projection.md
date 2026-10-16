# 16 · Attribute projection

One name appears in a greeting and a tooltip with different formatting. You learn how templates and masks reuse a bound value without copying text. The later **0.2.3** section previews HTML in a separate sandboxed frame.

**Uses:** Data binding, attribute templates and text masks (0.2.0); sandboxed Data `srcdoc` only in the later part (0.2.3).

<details>
<summary>More detail</summary>


**Release stage:** core 0.2.0 templates/masks, followed by the separate 0.2.3 Data-srcdoc sandbox step.

**Goal:** Reuse one Data value in text and attributes, then distinguish text from a sandboxed HTML document.

**Before this lesson:** [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/01_pointers.md), [b06 · Style and visibility](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/06_style_and_visibility.md), [c04 · Inline expressions](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/04_inline_expressions.md).

**Open and edit:** open this page in your environment's gallery. Read Python first; Python builds Source on the host and named JavaScript Logic runs in the browser. The JavaScript Page is the equivalent host/Worker declaration. The gallery shows source; to change it, copy the page into your editable project following the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md). This page needs no Logic methods; compare the Python and JavaScript Page declarations. Reload after source edits.

## Read the page

A template reads another attribute of its own Source node **after pointer resolution**:

```python
pane.div("Hover to read the title", customer="^.name",
         title="Customer: ${customer}")
pane.p("^.name", mask="Hello, {}")
```

`${customer}` is Gramlot syntax, not Python interpolation. `customer` supplies the template and is consumed instead of becoming a DOM attribute. `mask` formats the projected text; it does not enable HTML. The maintained syntax uses `{}`; older releases used `%s`.

The later section uses `pane.iframe(srcdoc="^.html", ...)`. Data-provided HTML gets `sandbox=""`: it is an isolated document, with scripts/forms/popups blocked by default. Ordinary `pane.p("^.html")` would show literal markup instead.

## Try it and predict the result

1. Initially the greeting is “Hello, Ada”; hover the card and expect title “Customer: Ada”.
2. Type Grace: both follow the same Data value. Inspect the card: it has `title`, but no `customer` attribute.
3. Clear Name: the greeting becomes empty; the title retains its authored prefix.
4. Replace Preview HTML with `<h2>Preview two</h2><p>Only this frame changes.</p>`. The heading appears inside the frame; the outer page stays intact. Inspect the iframe's `sandbox` attribute: it is present with an empty value.

## Change it and check yourself

Change the mask to `Welcome, {}` and the title to `Guest: ${customer}`. Leave the Data pointer alone.

**Answer:** one Name edit still updates both destinations with different formatting; no extra provider or shared formatted Data value is needed.

Separate invalid-edit exercise: rename only the template reference to `${missing}`, then reload. Expect an unknown-template-parameter error, not a blank substitute. Restore it. A preceding backslash escapes `${`; an `==` attribute cannot supply a template parameter, and `==` expressions cannot contain a template. See the reference for the permitted expression/template dependency order.

## The same example across stages

e02 taught literal text; b01 added a pointer. The 0.2.0 stage now adds presentation around that same value without a controller copying strings into multiple outputs. The 0.2.3 section is explicitly later: an iframe preview is not a replacement for safe literal text, and the sandbox does not imply a widget or raw-HTML injection API.

## Limits and next step

Templates apply to visual attributes, not node text or data-element declarations. A static Python f-string runs on the host once. A mask never interprets HTML. Keep the default empty sandbox for this exercise; do not add script permissions. A literal authored srcdoc has a different contract. JavaScript counterparts use quoted template text here, not JS backtick interpolation.

Continue with [c17 · Data exchange](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/17_data_exchange.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) provides the full contract.

</details>
