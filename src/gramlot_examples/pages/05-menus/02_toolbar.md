# Toolbar groups and overflow

**Learn:** turn a menu into a toolbar, keep related controls together and decide
what happens when space runs out. A slotbar uses the same `menu` and `menuline`
API; there is no second command system.

Start with this small composition:

```python
bar = frame.top.menu(presentation="bar")
editing = bar.menuline(group=True, priority=80)
editing.menuline("documenti:save", parameters=dict(id=42))
editing.menuline("documenti:undo")
bar.spacer(flex=1)
search = bar.menuline(group=True, overflowable=False)
search.input(value="^document.query", live=True)
```

`group=True` keeps its children together. `spacer(flex=1)` pushes Search to the
far end. `overflowable=False` keeps that group in the toolbar. The commands are
already registered by this page's collection, so their labels need not be repeated.

## Try one behavior at a time

| Try | Expected result | Source helper |
| --- | --- | --- |
| Compare the three button styles and hover an icon | The label is beside, below or in a tooltip; commands and state stay the same | `button_styles` |
| Reduce Toolbar width | Copy/Export (10) leave before Details (40), then Save/Undo (80); each group moves together | `priority_overflow`, `priority_bar` |
| Type into Movable search, then reduce the width | The same input appears in overflow with its value and binding intact | `moving_input` |
| Scroll the retained-only toolbar | All groups remain reachable and no group is split | `retained_groups` |
| Reduce the vertical toolbar's height | The same priority policy applies vertically | `vertical_overflow` |

Lower `priority` values overflow first; ties start at the end. The default is 0.
Elastic space shrinks first. Fixed spacers retain their size; neither kind appears
as an overflow entry. The overflow menu preserves declaration order.

If retained groups cannot fit, the strip scrolls. Retained means reachable in the
bar, not necessarily visible all at once. The continuation button remains reachable.

## Shared state and command delivery

Disable Save and toggle Details, then open overflow: disabled/checked state must
follow there too. Type in Search and watch Query below. Search only demonstrates
binding; it does not query a server. Copy, Save and Export report command delivery;
they do not use the clipboard, persist a document or download a file.

Each frame calls `recipient` to declare its central `frameTarget`. The command
arrives there with sender, target, command, parameters and modifiers. The browser
`Logic` methods update Data; Python's methods compose the Source.

## Icon and label choices

`labelPosition="beside"`, `"below"` or `"tooltip"` changes toolbar presentation.
`iconSize` controls the graphic independently of the button. A group or entry can
override the bar's defaults. Keep the caption for accessibility, even in tooltip
mode. Popup and overflow menus always show compact icon-and-label rows.

The comparison loop reuses the same commands with three presentation settings.
`export_group` creates the nested PDF/CSV menu; `recipient` reuses the message
receiver. All initial values come from `02_toolbar_data.tytx`.
