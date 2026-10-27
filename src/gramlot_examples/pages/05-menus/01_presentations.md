# One hierarchical menu, four presentations

Start with the explanations above each example. All four presentations call the
same Python `document_menu(menu)` method; it creates separate Source occurrences
with the same structure and shared Data bindings. There is no dropdown button in
this lesson.

| Presentation | Declaration | Try |
| --- | --- | --- |
| Popup on ordinary click | `area.menu(modifiers="*")` | Click the document, then Export → Other formats → CSV |
| Horizontal first level | `region.menu(presentation="bar", orientation="horizontal")` | Use the visible commands and open Export below the row |
| Vertical first level | `region.menu(presentation="bar", orientation="vertical")` | Open Export beside the column |
| Contextual popup | `area.menu()` | Right-click or focus the area and press Shift+F10 |

Icons and separators are part of each menu. `checked="^document.details"` keeps
the Details checkmarks and document paragraphs synchronized. The command handler
changes Data; the menu does not automatically toggle it. `disabled="^document.locked"`
controls Save everywhere. Undo is always disabled because no history is recorded.
Save and Export show a local result rather than writing a file.

The extra area uses `menu(modifiers="Shift")`: only Shift+click matches. The
combination is exact; extra keys reject it. `*` means ordinary click without
modifier keys, not a wildcard accepting arbitrary combinations. Opening modifiers
and the command message's activation modifiers are separate concepts.

A submenu belongs to its menuline and retains its submenu opening behavior.
Popup branches open sideways; a horizontal bar opens its first popup below.
Up/Down navigate popup entries; bars use their orientation's arrow keys.
Right enters a popup submenu, Left returns, Escape closes a level. Disabled
entries and separators do not dispatch commands.

Each frame has one central recipient. The menu sender is the selected occurrence;
the target is that frame's document content. This trial uses explicit parameter
bindings for the document ID. Automatic tree/grid row context, `validclass` and
attachment to a separate target are not implemented by this example.

## One definition, several presentations

Read `document_menu` first: it defines the hierarchy once. `example` chooses only where the menu is presented, and `document` declares the recipient. Both disabled and checked use the same Data paths, so changing the controls updates every presentation.
