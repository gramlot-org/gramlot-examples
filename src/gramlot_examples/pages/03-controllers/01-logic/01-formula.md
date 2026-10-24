# Calculate a value with dataFormula

**Sample data:** `01-formula_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

A formula calculates a result from the fields. You learn which inputs trigger a calculation and which are read only when it runs: `^` follows changes, while `=` supplies the current value.

**Uses:** Data binding and formulas — core 0.2.0.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Separate calculation dependencies from values read only at execution.

**Before this lesson:** [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/01-pointers.md), [b03 · Setters and defaults](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/03-setters_and_defaults.md), [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/01-native_editing.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c01 · Formula** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

## Read the page

The first `dataFormula` computes price × quantity into `.total`; gross depends on total but only **reads** VAT. The formula for size uses `_if`/`_else`. `_init=True` evaluates after initial Data and defaults are installed.

```python
pane.dataFormula(".total", "price * quantity", price="^.price", quantity="^.quantity", _init=True)
```

A formula returns its result; the provider writes it. The JavaScript expression runs in the browser, even inside a Python string. The result path is bare, not `^.total`.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Initially price 12.5 × quantity 4 gives total 50, gross 60 and “small order”.
2. Change VAT from 0.2 to 0.1: gross remains 60.
3. Change quantity to 8: total becomes 100 and gross 110; size stays “small order” because the condition is **greater than** 100.

## Change it and check yourself

Change `vat="=.vat"` to `vat="^.vat"`, reload and change only VAT to 0.1.

**Answer:** gross now becomes 55 immediately. VAT became a trigger. The formula body is unchanged; one declaration changes dependency tracking.

## The same example across stages

Earlier e05 computed totals once while building Source. In 0.2.0, `dataFormula` declares what to recompute and which paths trigger it. Compared with a controller that explicitly calls `this.SET('.total', price * quantity)`, the formula body only returns `price * quantity`; the destination declaration owns the write. These are two forms within the same release, not a fabricated later release.

## Limits and next step

A formula is for a derived value; use a controller for effects. VAT here is a fraction (0.2), while c09 later uses a percentage (22); do not copy the number unchanged.

Continue with [c02 · Controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/02_controller.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-055) explains the full contract.

</details>
