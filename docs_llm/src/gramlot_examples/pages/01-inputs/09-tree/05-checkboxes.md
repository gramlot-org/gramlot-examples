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

`checkChildren=True` propagates a branch check to its descendants. The default is
already true; it is explicit here to make the lesson readable. With false, each
node is independent. Checking a parent does not eagerly fetch its unresolved
children. Expanding Catalog evaluates its `dataRemote` resolver; the arriving
children inherit its current check. The cached Bag is reused on reopening.
Checking an unresolved branch directly can also start its resolver.

The sample Bag in `05-checkboxes_data.tytx` supplies captions and the node attribute
`checked`: `disabled:on` and `disabled:off` lock a check in either state. These
locked states are not included in `checkedPaths`,
which lists editable checked leaves (or an unresolved checked path until it loads).
A branch with mixed child states has an indeterminate check.

The Python endpoint only supplies the lazy Bag. The component manages propagation,
partial checks and binding; the example needs no custom JavaScript behavior.

An empty initial or updated `checkedPaths` clears editable checks, preserving
`disabled:on` and `disabled:off`. Naming a disabled path in the binding also
leaves its locked state unchanged.
