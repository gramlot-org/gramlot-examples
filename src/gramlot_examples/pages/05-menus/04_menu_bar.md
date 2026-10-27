# Classic menu bar and hierarchical menus

The first level is `menu(presentation="bar")` with caption-only menuline entries.
Each entry owns a popup menu. File → Export → Image demonstrates three nested
popup levels. The first popup opens below its bar; descendants open to the side,
subject to viewport fitting. Separators use `menuline("-")`.

View → Show details binds checked to Data and toggles it through page Logic.
Undo and Full screen are disabled deliberately. All other example actions merely
update the central message. No clipboard, document or browser operation is claimed.

Toolbar selection uses a background; popup/overflow checked entries retain their
check mark. Emoji icons are ordinary icon values, not a separate icon registry.


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

## Read the composition

`main` creates one bar and calls `file_menu`, `edit_menu` and `view_menu`. Follow `file_menu` to see the nesting: File → Export → Image. `item` removes repeated action wiring; the hierarchy itself stays visible in the code. `entry_style` is an optional styling comparison.
