# Change the current record with datapath

**Try this:** Choose Ada, edit her name, then select Alan and come back. One card follows the selected datapath; each record keeps its own values.

One card can show different records. Change its Data context and watch all its fields switch together: you learn how a variable `datapath` avoids rebuilding the card.

**Uses:** Source, Data, pointers and native binding. No endpoint calls.

<details>
<summary>More detail</summary>

**Goal:** Retarget a whole card by changing its Data context.

**Before this lesson:** [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/01-pointers.md), [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/01-native_editing.md).

## Read the page

The select stores a **path string**, such as `people.alan`, in `current`. The card’s `datapath="^current"` follows that choice; all `.name`, `.field` and `.born` references resolve within the selected record.

```python
card = pane.article(datapath="^current", class_="card stack")
card.h2("^.name", id="name")
card.input(value="^.name", id="name-field")
```

The records are loaded as a nested Bag from `02-variable_datapath_data.tytx`. The select uses `default="people.ada"` for its initial context.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Start with Ada Lovelace, Mathematics, 1815.
2. Choose Alan, edit his name to “A. M. Turing”, and leave the field.
3. Choose Grace, then Alan again: his edited name remains; Grace’s record is unchanged.

## Change it and check yourself

Add another person to `PEOPLE` with `name`, `field` and `born`; reload and choose them.

**Answer:** the existing select loop adds an option and the same card shows the new record. No separate handlers are needed for the three displays or edit field.

## The same example across stages

Compared with b01’s fixed context, one variable `datapath` retargets the same declarations together. In the later 0.2.16 c13 lesson this very technique selects a product while remote rules depend only on its category.

## Limits and next step

The selected value must be a Data path, not a record object. Reload reconstructs the initial records; local edits are not persistence. Empty/null contexts are an advanced reference case, not a new record editor.

Continue with [b03 · Setters and defaults](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/03-setters_and_defaults.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-040) explains the full contract.

**Sample data:** `02-variable_datapath_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
