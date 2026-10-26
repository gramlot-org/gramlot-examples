# Tray workspace

Arrange a small workspace without rebuilding its contents. The four cards contain ordinary widgets: a border layout with tabs, two sliders, a checklist and a note editor. Each helper builds one card; a loop composes the workspace.

## Try it

1. Edit the note and the Owner field. Drag a card by its dark title, then resize it with the lower-right grip. Your edits and active tabs stay in place.
2. Select a card, then Shift+click another. The border shows the selection. Drag a selected title to move both together, keeping their distance. Alternatively, drag from empty tray space to enclose several cards. Shift adds to the selection; Escape cancels the rectangle.
3. Bring two cards together: on the same layer they stop at contact. Open the layers icon at the upper right and choose a different integer layer (−10 to +10). Cards on different layers may overlap; larger numbers appear above. A layer change that would cause an overlap is refused.
4. Rotate from the upper-left grip; change zoom using the other upper-right icon. Contact uses each transformed outer rectangle, excluding shadows and rounded corners. Fields remain interactive.
5. Set **Grid px** and **Shift °** in the toolbar. Hold Shift while moving, resizing or rotating to snap; release it for free movement. **Grid** only shows the grid. A step of zero disables snapping.
6. Choose **Save layout**, rearrange the cards, and choose **Restore**. Position, size, layer, rotation, zoom, selection and toolbar settings return to the snapshot. The contents of the cards are not rolled back.
7. **Lock layout** hides handles and disables arrangement, while fields, tabs and buttons remain usable.

The workspace deliberately stays wide on narrow screens: scroll to reach all cards, rather than compressing their controls into unreadable columns.

## What belongs where

The outer `framePane` provides a top region for a regular `menu(presentation="bar")` toolbar and a center for the `trayPane`. The tray owns arrangement; the toolbar uses bindings to its settings. Each direct child has a stable `node_label` and a `lbl`. Membership supplies card chrome and arrangement handles.

`storepath="layout"` points to the Data Bag. Each child uses its `node_label` as the row key:

| Path | Meaning |
| --- | --- |
| `layout.workspace.left`, `.top` | Position in tray coordinates |
| `layout.workspace.width`, `.height` | Unscaled card size |
| `layout.workspace.layer` | Stacking and collision layer |
| `layout.workspace.rotation` | Angle in degrees |
| `layout.workspace.scale` | Zoom factor; 1 means 100% |
| `layout.workspace.selected` | Selection state |

The sibling `07-tray_data.tytx` supplies the starting arrangement as a Bag. The card contents have their own datapaths (`project`, `mixer`, `checklist`, `memo`). Changing geometry updates the DOM presentation of the same widgets; it does not replace their Source or recreate them.

## Saving is a Data operation

The example copies `layout` and `ui` with `deepcopy()` into separate snapshot paths. Restore copies them back. This demonstrates a layout round trip **inside the current page**: reloading the page discards the snapshot. An application can serialize that Bag as TYTX and store it through its own server API. The example does not silently save to browser storage or disk.

Use the Code tab to compare the Python and JavaScript versions. The helpers are ordinary functions: reuse one under a different datapath to give it independent data.
