# Menus, toolbars and framePane

This Python-first chapter introduces the shared menu system step by step. The
same `menu` / `menuline` Source vocabulary describes popup menus and permanent
toolbars. A `framePane` supplies layout regions and a central command recipient.

1. **One menu, four presentations** — compare the same hierarchy as a popup,
   horizontal bar, vertical bar and context menu; try exact opening modifiers.
2. **Toolbar composition** — use fixed/elastic spacers, normal content, nested
   bars and multiple bars in one region.
3. **Vertical icon toolbar** — large icons, tooltips, shared selection, side-opening
   submenus and height-driven overflow, with a horizontal comparison.
4. **Classic menu bar** — named top-level menus and File → Export → Image,
   with checked, disabled and per-entry presentation examples.
5. **Reactive menu states** — bind checked, disabled and hidden to shared Data.
6. **FramePane: regions and recipient** — compare all five regions and observe
   sender/target isolation in a nested frame.
7. **Resolver menus and nested Bags** — load at opening, return nested/lazy
   submenus, change arguments, and test empty/error/retry states.
8. **Windows around a frame** — dialog defaults, a movable modal and floating
   tools; try collapse, close refusal, resize and retained drafts.
9. **Complete dialog editor** — top toolbar, editable draft and bottom Save/Cancel;
   compare commit/discard, reset, details, validation and window controls.
10. **Complete document workspace** — combine the pieces, including ask and delay.

Select a lesson in the navigation tree. Its Python and logic.js tabs contain the
actual application source; Explanation describes the contract and things to try.
The command collection is defined in collections/menu-trial.js and loaded through
Page.gramlots. Examples use Source, Data Bags, bindings and named Logic handlers.

**Provisional API:** this chapter targets the development menu/frame runtime.
The local Save/Export actions demonstrate command delivery; they do not persist
or download documents. Dialog and floating windows are available as a first provisional increment.


**Appearance review:** Joanna, Compact and Mimi now have matching specimens with
native/component fields, tabs, table, toolbar/menu and windows. Compare their three
densities, then use the gallery color-mode selector for light/dark. These are
provisional design variants for owner review, not accepted stable styling.


**Complete floating editor:** the same toolbar, draft fields and Save/Cancel as
Complete dialog editor, with an editable background to demonstrate nonmodality.
Compare both under the same Theme, Colors and Color mode in Gallery Settings.
