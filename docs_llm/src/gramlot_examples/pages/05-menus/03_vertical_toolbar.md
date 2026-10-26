# Vertical icon toolbar

This is menu(presentation="bar", orientation="vertical", labelPosition="tooltip",
iconSize=32), not a separate slotbar component. menuline supplies each command;
a separator remains menuline("-"). Home and Tools are retained, other entries
have descending overflow priorities. The rail height is bound to a slider.

The selected section is page Data, read by checked bindings and updated by the
named selectSection Logic method. This demonstrates highlighting without adding a
new core radio/selection contract. The same state updates both rail orientations
and their overflow entries. Tooltips keep names available when text is hidden.

Submenu triggers point right (›) in vertical bars and down (▾) in horizontal bars.
Overflow uses a distinct right-facing double chevron (») with a More commands tooltip. Menu descendants keep lateral chevrons; viewport fitting may flip an
actual popup to the left when necessary. Overflow always shows full captions
beside compact icons. The continuation control remains outside the scrolling strip.

Try narrowing the height, selecting Overview from overflow, opening Tools,
choosing Settings, and navigating by keyboard. Shared selected state should
update the central heading without recreating menu entries. This remains a
provisional local gallery exercise; user-customizable visibility is deferred.


## Icons and entry presentation

`icon` accepts emoji/text; `iconSrc` accepts an image URL, including SVG. SVG is
loaded in an img, never inserted as HTML. The rail uses self-contained SVG image
URLs; a served SVG path works through the same parameter. Its iconSize is 32 px.
Popup and overflow images return to the compact menu icon scale.

The entry's caption, class_, color, width and height are independent of iconSize.
Color affects the entry text; an SVG image retains its own authored colors.
Classes are placed on the Source element and obey normal shadow-DOM boundaries.
The menu-bar lesson includes a blue, 140 × 52 px entry with a 24 px emoji.

```python
bar.menuline("documenti:save", caption="Save a copy",
             iconSrc="/icons/save.svg", iconSize=24,
             class_="save-copy", color="#93c5fd", width="140px", height="52px")
```

A registered command may supply iconSrc alongside label/publish. An occurrence
with an explicit icon or iconSrc replaces that registered icon choice; iconSrc
wins when both are supplied. Bindings can change either image source or text.
Toolbar checked state uses background only; popup checked state retains a tick.
