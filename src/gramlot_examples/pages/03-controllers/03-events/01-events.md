# Handle browser and component events

**Try this:** Click a chip, type in the field and move over the pointer area. The visible readouts show which event reached each declaring Source node.

Elements declare how they respond to browser events. You learn where an event is handled and how the declaring Source node updates Data.

**Uses:** Data and inline event handlers. Named event groups need the separate Kajenn resource host.

<details>
<summary>More detail</summary>

**Goal:** Follow a declared event to the declaring node and its Data write.

**Before this lesson:** [c02 · Controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/02-controller.md), [c06 · Button controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/02-actions/01-button_controller.md).

## Read the page

`connect_onclick` declares a listener owned by the Source node. Inline `this` is the declaring node, while `event.target` may be a descendant. The section records the clicked chip’s ID; typing records length and the last key; hover writes a class.

The input’s own `event.target.value.length` is used only to explain that event’s payload, not to scrape unrelated controls or create a parallel form state. Normal application field state uses a `value` binding as in b04.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Click green: the section display shows `chip-green`, because the child was the event target.
2. Type “cat”: length becomes 3 and the last key reflects your last keypress.
3. Move over/out of the box: its class changes and then returns to card.

## Change it and check yourself

Add `connect_onfocus="this.SET('.key', 'focused')"` to the input, reload and focus it before typing.

**Answer:** Last key first shows focused; typing then replaces it with the keyboard event’s key. The same Source context resolves `.key`.

## The same example across stages

For most field editing, b04’s `value` pointer replaces an authored input-to-Data handler. This event lesson remains useful when the event payload itself matters. Both are 0.2.0 mechanisms, not separate release milestones.

## Limits and next step

Removing a node removes its listeners. Named handlers require a dotted `group.method` from `js_requires`; a root Logic method used by `func` is not a substitute. The common gallery has no resource host; the named-group lesson belongs with genro-kajenn. Inline code needs the permissive CSP profile.

Continue with [c08 · End-to-end story](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/04-complete_examples/01-end_to_end.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-075) explains the full contract.

**Sample data:** `01-events_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
