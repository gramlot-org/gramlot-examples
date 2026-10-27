# Customize tree labels and row styles

**Try this:** Select Notes and rename it. The caption changes while its node key and selected path remain stable.

Style captions and rows from Bag metadata, with separate opened, closed and selected states.

## Try it

`labelAttribute="caption"` uses a node attribute; an absent attribute falls back to the node label. Empty captions remain empty. The default caption classes use `labelClassOpened` or `labelClassClosed` when nonempty, otherwise `labelClass`. `selectedLabelClass` is added on selection. `node_class` styles the node container. Classes are exposed as CSS parts, for example `.styled-tree::part(caption-open)`. Open Documents, select Meeting notes and rename it. The selected path stays `documents.notes`.

**Sample data:** `02-labels_and_classes_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.
