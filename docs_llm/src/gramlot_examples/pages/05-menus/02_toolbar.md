# Toolbar groups and responsive overflow

This provisional Python lesson uses only menu, menuline and spacer. A toolbar is
menu(presentation="bar"); its Source children remain in declaration order.

```python
bar = frame.top.menu(presentation="bar")
editing = bar.menuline(group=True, priority=80)
editing.menuline("documenti:save", parameters=dict(id=42))
editing.menuline("documenti:undo")
bar.spacer(flex=1)
search = bar.menuline(group=True, overflowable=False)
search.input(value="^document.query", live=True)
```

A group owns its overflow policy and moves as one unit. priority defaults to 0;
lower values move first, ties start at the end. overflowable defaults to True;
False retains the entry/group in the toolbar. Groups have no command of their
own. A retained group may need scrolling to reach it: retained does not mean all
content is simultaneously visible in a narrow viewport.

Fixed spacers keep their declared size; elastic space gives way before entries
move. Spacers never become overflow entries. The continuation button stays outside
the scrollable strip so the menu remains reachable. Menu entries keep declaration
order even when priority chooses a different transfer order.

The first frame retains its title and search. The second allows its search group
to move. The third retains every group, demonstrating horizontal scrolling. A fourth example applies the same policy along the vertical axis with a height slider. Values
and binding remain attached to the original controls; the runtime uses named-slot
projection, not duplicate Source nodes. If a focused input moves into overflow,
the menu opens so editing can continue. Escape closes the menu and returns focus
to its continuation button. These focus rules are provisional and require usability
feedback alongside resize and keyboard testing.

All commands reach the explicit frameTarget in their own frame. The result reports
local command delivery; Copy and Save are illustrative Data updates, not persistence
or clipboard operations. Search is a bound input, not a server search. User-selected
visibility/sessionStorage customization is deferred.


## Toolbar icon and label styles

menu(labelPosition="beside" | "below" | "tooltip", iconSize=24) sets toolbar
defaults. menuline can override either setting, including on a group; the nearest
group setting is inherited unless the entry overrides it. below uses a small
caption beneath the icon, tooltip retains the full caption in the native tooltip
and accessible name. Do not set caption="" to hide toolbar text.

Toolbar icons are 24 px by default (28 px in the comparison examples); buttons
have a larger hit area, subtle hover background, focus outline and checked/open
feedback. Popup and overflow entries always use compact icon-and-caption rows;
custom tooltip text remains available without replacing the caption.
