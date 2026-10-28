# Tabs

**Try this:** type a one-letter customer name, switch to Notes and return.
The invalid draft remains in the same field; the accepted Data value stays unchanged.

## Switch, then close

Each child declares a `pageName` and a `title`:

```python
tabs = pane.tabContainer(selectedPage="^.page", height="240px")
customer = tabs.contentPane(pageName="customer", title="Customer")
customer.textbox(value="^.name", lbl="Name")
```

Switching tabs hides a panel without discarding its controls or unfinished edits.
Closing a `closable=True` panel removes its Source and controls. Those operations
are different: neither automatically deletes the Data record.

Write something in **Notes**, switch away and return. Next, close Notes. The
**Saved notes** line keeps the text. Reload to recreate the closed panel.

## Options

The collapsed **Options** section controls the main workspace:

- **Selected page** changes the bound `selectedPage`; clicks on tabs update it too.
  `selected` reports the zero-based index.
- **Presentation** chooses shaped tabs or an underline. **Tab position** chooses
  top, bottom, left or right. **Alignment** positions labels along that side.
- **Unread messages**, **Badge color** and **Notes icon** update the tab even when
  its panel is hidden.
- **Prevent closing Notes** makes `onClose` refuse closure. Turn it off to close.

**Nested border** shows that a tab can contain another layout: resize its Tools
region, collapse its drawer, or edit the same accepted customer name.

## Events and visual reference

**Inspect container events** reports hiding, showing, selection, closing and
closure. Controllers record these messages in Data; ordinary tab switching needs
no application controller.

**Compare tab styles, positions and alignment** contains the advanced reference:
8 cards for two styles on four sides, then 6 for horizontal/vertical alignment.
All remain working editors. Their selection is independent, while their fields
share relative Data paths. Left/right strips keep their text horizontal. If a
strip is too short, its labels scroll.

## Read the code

`main` composes options, workspace, event report and reference. The three workspace
panels have separate methods. `variant_card` is reused by two loops: there are no
14 copied panel definitions. You can start with `workspace` and its three panel
methods; the other methods demonstrate optional behavior.

`02-tabs_data.tytx` supplies sample values. Interface `default` attributes initialize
the options; bindings handle later changes. All 14 reference cards and the main
workspace retain their original features.
