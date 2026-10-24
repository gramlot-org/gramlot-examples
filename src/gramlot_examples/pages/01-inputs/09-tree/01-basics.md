# Browse hierarchical Data with a tree

**Sample data:** `01-basics_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

The tree always reads a Data Bag. `storepath` identifies the Bag; `selectedPath` binds the selected node path relative to that store. `labelAttribute` uses a node attribute for its caption and otherwise retains the label.

The Documents branch is already loaded. Catalog is installed with `dataRemote(cacheTime=-1)` and loads only when expanded. Its endpoint returns a Bag. Rendering and unrelated Data updates do not evaluate the resolver. Reopening uses the resolver cache. The gallery itself uses the same mechanism for its sections.

The buttons use ordinary Gramlot Data writes: insertion and caption changes update the tree, and an external selection opens loaded ancestors. Arrow keys move focus; Enter selects. Folder/file icons are separate from the disclosure control.

Style through the host class and CSS parts: `tree`, `group`, `node`, `branch`, `leaf`, `row`, `branch-row`, `leaf-row`, `selected-row`, `expander`, `spacer`, `icon`, `branch-icon`, `leaf-icon`, `opened-icon`, `closed-icon`, `caption`. The component keeps its own structure and lifecycle.

This increment does not yet implement icon callbacks, badges, hover actions, checkbox/search, or expandAll. Resolver expiry and request errors retain the existing resolver/provider contract; the tree does not introduce a request service.


## Scalar values

`hideValues` defaults to false: expand a scalar node to read its value as a visual child. Toggle **Hide scalar values** to remove these children. Clicking a value selects its owning Bag node; the store and selectedPath contain no synthetic node. Rendering never loads a resolver; expanding one does.
