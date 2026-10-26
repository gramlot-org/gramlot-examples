# Mimi appearance review

24px controls / 12.5px text. This specimen uses the shared Python `PreviewPage` in
`gramlot_examples.trials.menu.theme_preview`: real fields, tabs, menus, table,
modal dialog and floatingPane. It contains no hand-built DOM behavior.

Use the profile links to compare the same content. The gallery color-mode selector
switches light/dark. Each profile also follows the system preference when standalone.
Native and component fields should align. Try Tab focus, the invalid field, Disable
Save, View → Details, the Items tab, window movement/resize and local Save delivery.
All values are page-local; no server save or persistence is implied.

Themes use existing semantic CSS variables. The profiles are intended for desktop
work; the existing touch policy keeps touch targets larger. Source-authored fixed
padding still takes precedence, so new examples use spacing tokens deliberately.
