# Initialize values: defaults and dataSetter

**Try this:** Compare the initialized values below. Defaults fill missing values; dataSetter writes explicitly and is then removed from Source. This lesson demonstrates that distinction deliberately.

Fields start with values supplied by setters and defaults. You learn when those values are applied and why an existing zero differs from a missing value.

**Uses:** Source, Data, pointers and native binding. No endpoint calls.

<details>
<summary>More detail</summary>

**Goal:** Predict initialization order and distinguish an absent value from zero.

**Before this lesson:** [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/01-pointers.md).

## Read the page

Setters run before first render, parents before descendants in Source order. The later `.customer` setter wins, so the first display is Grace Hopper. The nested shipping dictionary supplies London.

```python
form.input(type="number", value="^.quantity", default=1, id="quantity")
form.input(value="^.note", default_value="No note", default="Never used", id="note")
```

`default_value` wins over `default`; defaults fill null/missing paths, not `0`, `False` or `""`. `attr_currency="EUR"` sets metadata on the price Data node; `^.price?currency` reads it.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Before editing, predict Customer = Grace Hopper, Quantity = 1, Note = No note, Price = 12.5, Currency = EUR and City = London.
2. Find the later setter below the form: visual position does not delay initialization.

## Change it and check yourself

Remove only the later `.customer` setter and add `pane.dataSetter(".quantity", 0)`.

**Answer:** after reload Customer is Ada Lovelace and Quantity is 0. The earlier customer setter now wins; the quantity default cannot overwrite a real zero.

## Limits and next step

These are build-time defaults, not record/new-record defaults or automatic refill whenever a user clears a control. Destination paths are bare Data paths, not `^` pointers or `?attr` destinations.

Continue with [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/01-native_editing.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-045) explains the full contract.

</details>
