# Tree labels and classes

Style captions and rows from Bag metadata, with separate opened, closed and selected states.

## Try it

`labelAttribute="caption"` uses a node attribute; an absent attribute falls back to the node label. Empty captions remain empty. The default caption classes use `labelClassOpened` or `labelClassClosed` when nonempty, otherwise `labelClass`. `selectedLabelClass` is added on selection. `node_class` styles the node container. Classes are exposed as CSS parts, for example `.styled-tree::part(caption-open)`. Open Documents, select Meeting notes and rename it. The selected path stays `documents.notes`.
