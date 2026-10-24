# Internal tree drag and drop

**Sample data:** `04-internal_drag_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

Drag Project brief or Meeting notes onto Inbox or Projects, then open that folder. Locked archive rejects the same payload. Dropping onto a copied document also rejects it: only the two writable folders accept documents.

## Data first

Python declares the Bags and both trees. `onDrag` adds an `app/document` snapshot; the tree also provides `text/plain`, `nodeattr` and `treenode`. `dropTypes` selects the application payload, `dropTags` requires the document tag and `dropTargetCb` checks the actual target node. The check runs again on release.

`onDrop` copies into the destination node's Bag with `setItem`. The tree reacts to that Data change. There is no DOM manipulation or automatic move/copy in the framework. Repeating a copy uses the same document key and updates its existing entry.

## Completion

`effectAllowed='copy'` and `dropEffect='copy'` agree on the browser operation. `onDragEnd` updates the gesture status; the Source-local `endDrag` notification follows even if that callback fails. The browser effect does not certify application-operation success. An accepted drop also publishes Source-local `onDrop` before the action completes. Callback errors are reported and transient feedback is cleaned; Data changes already made are not rolled back.

This increment handles native mouse drag inside one page/renderer. Separate browser windows of the same application, typed callbacks, custom Source previews and external files are not implemented here. Touch and keyboard drag interactions are not included. Payloads must use supported TYTX values; unsupported nested JavaScript values remain a deferred dependency edge case.
