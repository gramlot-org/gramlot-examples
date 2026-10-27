# Dropdown buttons and command menus

**Try this:** Open Export and choose CSV. Repeat with Shift held: the command also becomes the main action. The unavailable item cannot execute.

The main surface executes; the arrow opens the menu. Shift-select a command to run it and make it the default.

**Uses:** built-in command components, Source, Data and the shared action engine. No endpoints or database.

<details>
<summary>More detail</summary>

`dropDownButton` is one split command: the main surface never opens its menu. The arrow opens it; arrow keys, Home/End and Escape navigate or close it. Normal selection only executes; Shift+selection executes and changes the default action/caption. `persist=True` requires a stable id and saves the item code for this page URL in browser storage. Nothing executable is stored. On touch, ordinary selection executes; setting a default currently requires Shift. This is a local flat menu, without nested menus or button bars.

**Sample data:** `03-dropdown_button_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
