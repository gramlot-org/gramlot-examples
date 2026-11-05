# Hierarchical choices

Open **Documents** and check the **documents** branch. Expand **documents**, then **catalog**, to load the remote branch and inspect the
result: **fixed** stays checked, **blocked** stays unchecked, and the two remote
catalogue entries become checked when they arrive. **Clear** clears the editable
selection; it does not change either disabled node.

## Why these lines

- `Bag` holds the actual hierarchy. Dotted paths create the `documents` branch.
  The two `checked` attributes demonstrate fixed on/off states.
- `dataSetter` installs that Bag in Data. `dataRemote` adds a lazy resolver at
  `options.documents.catalog`; `cacheTime=-1` retains its result after loading.
- `hierarchical=True` makes `checkBoxText` reuse the existing checkbox tree,
  observing this Bag directly. It does not copy the data or implement another
  propagation mechanism. `checkChildren=True` is already the default.
- `popup=True` puts that tree in a popup. Omit it for an inline tree. Selecting
  several entries leaves the popup open; Escape closes it.
- `value="^selected"` stores a comma-separated string of paths. The `code` line
  shows the value, including the transition from a pending branch to its leaves.
  An empty selection is `null`. Fixed disabled states remain in the options Bag
  and are not added to the editable selection.
- The endpoint returns only the two children. Loading a branch and applying its
  pending check are responsibilities of the shared tree.

## Explicit codes instead of paths

Add `identifier="code"` to save each node's `code` attribute instead of its path.
Every node, including branches, must then have a unique, nonempty text code
without commas. `labelAttribute="caption"` chooses a caption attribute. Unknown
codes are retained; a code in a lazy branch is recognized only after that branch
loads. Reading captions does not load branches.

`dbtable` and `method` load flat lists. For a remote hierarchy, use a Bag and
`dataRemote`, as above. `cols` only affects flat choices.
