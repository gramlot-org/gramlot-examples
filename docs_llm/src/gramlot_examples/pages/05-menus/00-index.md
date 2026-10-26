# Menus and toolbars

A toolbar (or **slotbar**) is the permanently visible first level of a `menu`.
Use `menuline` for commands and groups, and `spacer` for fixed or flexible space.
Submenus and overflow remain compact hierarchical menus. The examples below use
one shared command collection; Save and Export demonstrate local command delivery,
not persistence or file downloads.

## Start with the menu

1. **One menu, four presentations:** compare popup, horizontal, vertical and context
   menus. Change the shared checkboxes, open Export and try Shift+click.
2. **Toolbar groups, priority and overflow:** resize the toolbar; watch whole groups
   move into overflow. Retained controls scroll when they cannot fit. Compare labels
   beside icons, below icons and shown only as tooltips.
3. **Vertical icon toolbar:** select an SVG icon and shorten the rail. Selection,
   tooltips and submenu direction work in both orientations.
4. **Classic menu bar:** open File → Export → Image. Compare separators, disabled
   commands and checked View entries.
5. **Reactive states:** change checked, disabled and hidden without rebuilding the menu.

## Connect commands to a workspace

6. **FramePane:** top, bottom, left, right and center; multiple bars per region;
   messages carry sender, target, command, parameters and modifiers.
7. **Resolver menus:** load at opening, reuse cached results, return nested Bags,
   change arguments and try empty/error/retry states.
8. **Complete workspace:** combine the same commands, a resolver and a central recipient.

## Put the workspace in a window

9. **Dialog and floating:** compare modality, movement, resize, collapse, maximize,
   close guards and retained Data.
10. **Complete dialog editor:** use the left tools, top toolbar and bottom Save/Cancel.
    Only Save commits the draft to the document displayed on the page.
11–13. **Joanna, Compact and Mimi:** compare the same fields, menus, table and windows
    at three densities. Gallery Settings controls theme and light/dark appearance.
14. **Complete floating editor:** use the same three toolbar regions while continuing
    to edit the background page.

Each lesson has **Example**, **Explanation** and **Code** tabs. The source uses
small reusable methods and loops; initial demonstration records come from the
same-name `_data.tytx` Bag. Python is the primary authoring example and each lesson
also has a JavaScript Page with the same behavior. The collection source is
`collections/menu-trial.js`, loaded through `Page.gramlots`.

These teaching examples exercise the current development API. Explore one behavior
at a time; they are not production document editors.
