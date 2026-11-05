# Toolbar groups and overflow

**Learn:** turn a menu into a toolbar, keep related controls together and decide
what happens when space runs out. A slotbar uses the same `menu` and `menuline`
API; there is no second command system.

Start with this small composition:

```python
bar = frame.top.menu(presentation="bar")
editing = bar.menuline(group=True)
editing.menuline("documenti:save", parameters=dict(id=42))
editing.menuline("documenti:undo")
bar.spacer(flex=1)
search = bar.menuline(group=True)
search.input(value="^document.query", live=True)
```

`group=True` keeps its children together. `spacer(flex=1)` pushes Search to the
far end. The first group that cannot fit and all following groups enter the vertical menu. The commands are
already registered by this page's collection, so their labels need not be repeated.

## Try one behavior at a time

| Try | Expected result | Source helper |
| --- | --- | --- |
| Compare the three button styles and hover an icon | The label is beside, below or in a tooltip; commands and state stay the same | `button_styles` |
| Reduce Toolbar width | Only a continuous prefix remains visible; every following group moves into the menu | `ordered_overflow`, `ordered_bar` |
| Type into Movable search, then reduce the width | The same input appears in overflow with its value and binding intact | `moving_input` |
| Open the menu of the narrow grouped toolbar | All groups remain reachable and no group is split | `retained_groups` |
| Reduce the vertical toolbar's height | The same declaration-order policy applies vertically | `vertical_overflow` |

Elastic space shrinks first. Then the first non-fitting unit and the complete
following suffix move to the menu. A smaller later command never fills a gap
left by an earlier command. Groups remain indivisible. Spacers are decorative
and do not become menu entries. No per-element overflow or priority flag is needed.

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

## Field labels

`lbl` declares the visible label and associates it with the input through the
shared labelbox. No separate HTML label or repeated ARIA name is needed.
