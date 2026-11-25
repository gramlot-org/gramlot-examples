# Tree checkboxes

## Try it

1. Check **Documents** before opening it. The loaded children inherit the check;
   **Catalog (lazy)** records it without requesting its children yet.
2. Expand **Documents**, then **Catalog (lazy)**. The endpoint is called now:
   **guide** and **reference** arrive already checked.
3. Uncheck **guide**. The parent shows a partial check. Watch **Checked paths**
   change without writing an event handler.
4. Click **Clear checks** to write an empty string to the binding. **Required (locked on)** stays checked;
   **Unavailable (locked off)** stays unchecked. Neither checkbox can be edited.

## The declaration

`storepath` points to the Data Bag containing the nodes. `checkedPaths` is a two-way
binding: the tree writes comma-separated paths relative to that Bag, and an
application can change the same Data value to update the checks.

The `checkedPaths` list is the only source of the checks: each draw computes them
from the text at the address, so editing the text changes the checks and emptying
it clears every editable check. `checkChildren=True` checks the descendants of a
checked path. The default is already true; it is explicit here to make the lesson
readable. With false, each node is independent. Checking a parent does not eagerly
fetch its unresolved children. Expanding Catalog evaluates its `dataRemote`
resolver; the arriving children follow the list. The cached Bag is reused on
reopening. Checking an unresolved branch directly can also start its resolver.

The sample Bag in `05-checkboxes_data.tytx` supplies captions. Only the node
attribute `checked='disabled:on'` or `'disabled:off'` fixes a check that clicks and
the list do not change; these locked nodes are not included in `checkedPaths`.
With `checkChildren` the list holds the checked nodes without loaded children, so
an unresolved branch stands for itself until its loaded descendants replace it.
A branch with checked and unchecked loaded children has a mixed check.

The Python endpoint only supplies the lazy Bag. The component manages propagation,
partial checks and binding; the example needs no custom JavaScript behavior.

An empty initial or updated `checkedPaths` clears editable checks, preserving
`disabled:on` and `disabled:off`. Naming a disabled path in the binding also
leaves its locked state unchanged.
