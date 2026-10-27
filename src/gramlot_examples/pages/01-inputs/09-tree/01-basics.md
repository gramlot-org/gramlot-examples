# Browse hierarchical Data with a tree

**Try this:** Expand Catalog to request its children, then select a row. Add or rename a document and watch the tree follow changes in its Bag.

The tree always reads a Data Bag. `storepath` identifies the Bag; `selectedPath` binds the selected node path relative to that store. `labelAttribute` uses a node attribute for its caption and otherwise retains the label.

The Documents branch is already loaded. Catalog is installed with `dataRemote(cacheTime=-1)` and loads only when expanded. Its endpoint returns a Bag. Rendering and unrelated Data updates do not evaluate the resolver. Reopening uses the resolver cache. The gallery itself uses the same mechanism for its sections.

The buttons use ordinary Gramlot Data writes: insertion and caption changes update the tree, and an external selection opens loaded ancestors. Arrow keys move focus; Enter selects. Folder/file icons are separate from the disclosure control.

Style through the host class and CSS parts: `tree`, `group`, `node`, `branch`, `leaf`, `row`, `branch-row`, `leaf-row`, `selected-row`, `expander`, `spacer`, `icon`, `branch-icon`, `leaf-icon`, `opened-icon`, `closed-icon`, `caption`. The component keeps its own structure and lifecycle.

This basic lesson does not teach every tree option. The following tree lessons
cover caption/icon callbacks and drag/drop. The shared `searchText` feature is
used by gallery navigation; it still needs its own focused lesson (see the
[coverage checklist](https://gramlot-examples.readthedocs.io/en/latest/docs/035-feature-coverage.html)). Resolver expiry and request errors retain the existing resolver/provider contract; the tree does not introduce a request service.

## Scalar values

`hideValues` defaults to false: expand a scalar node to read its value as a visual child. Toggle **Hide scalar values** to remove these children. Clicking a value selects its owning Bag node; the store and selectedPath contain no synthetic node. Rendering never loads a resolver; expanding one does.

**Sample data:** `01-basics_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.
