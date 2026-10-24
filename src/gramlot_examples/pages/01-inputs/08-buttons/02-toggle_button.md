# Toggle buttons and selection state

**Sample data:** `02-toggle_button_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

A command button and a checkbox share a boolean. The LED and aria-pressed follow Data.

**Uses:** built-in command components, Source, Data and the shared action engine; the toggle example also uses inputs and layout. No endpoints or database.

<details>
<summary>More detail</summary>

`toggleButton(value="^enabled")` writes a boolean through the shared Data adapter. The LED and aria-pressed expose the current state; Space and Enter activate the native internal button. The state changes before its optional action; an action confirmation does not undo the state change. Readonly and disabled block user toggling, while external Data can still change the state.

</details>
