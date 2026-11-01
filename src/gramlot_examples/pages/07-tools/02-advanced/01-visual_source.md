# Visual editor

## Try it

Open **Tools → Advanced tools → Visual editor**. This is a full-page tool.

1. Open **Catalogue**, search for `tabContainer`, and drag it onto `pageRoot` in Source.
2. Drop `formlet` onto the new container. Enter the required tab title and choose **Insert**.
3. Select the formlet. In **Properties → Container**, change its title or pageName.
   Other property tabs cover styles, behavior and validation. Changes update Source.
4. Add a text field. Click it in the preview to select it and type normally;
   command buttons and links select without executing their actions.
5. Detach a sidebar region using its icon; close its floating to dock it again.
   Source, Data, bindings and input instances remain the same.
6. Download or Copy Source, choose New, then Open the saved `.grmlt`.
   Invalid files leave the current design intact.

The Source tree inspects pageRoot; the Data tree inspects the page's real Data,
excluding reserved `__editor` state. Both have the tree's native search.
A nonempty `data_root` / `dataRoot` scopes the editor to a particular Data Bag.

## Read the code

Python and JavaScript each compose `VisualEditor` in one main method and expose
`SourceImport` through the shared upload contract. The environment supplies the
collections. Reusable behavior is `VisualEditorLogic`, not duplicated page code.
Widget and parent metadata supply the property forms. Only required insertion
parameters prompt before creation; optional parameters remain editable afterward.

Download and Copy Source contain the same page-only TYTX. They exclude UI state,
collections and named Logic. New clears the edited document and its Data while
retaining editor controls. Open accepts a typed Source with one pageRoot, up to
5 MiB. Only open trusted Source because its behavior can execute.

## Optional code and chat

A host may configure a Python or JavaScript document and attach the Code panel.
Changes remain a draft until explicit Save. Revision and syntax checks protect
against overwriting a changed file. Preview runs the saved Page.main; it does not
install target endpoints or companion Logic. The ordinary gallery has no configured
file and does not enable Remote Edit.

The optional Python chat launcher composes the same editor with ChatPane. Provider
configuration is supplied separately; chat edits the draft, never saves implicitly.

## Boundaries

Moving a Source branch rebuilds that moved control; detaching a panel only moves
its DOM. The root cannot move, cycles and incompatible destinations are rejected.
Resolver-backed nodes cannot be moved. Undo/redo and sibling reordering are not
implemented. Scalar/enum property editors do not cover every object/callback type.
Unsupported values are retained, not silently converted. HTML attributes without
metadata expose common styles and textual content; this is not a complete HTML IDE.

WebKit automatic bottom-region sizing remains a known layout defect. File-origin
Worker uploads also retain the documented WebKit File-reading limitation. Chromium
file export and WebKit over HTTP use the shared uploader without a fallback.
