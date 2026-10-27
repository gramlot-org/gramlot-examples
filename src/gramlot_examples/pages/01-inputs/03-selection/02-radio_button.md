# Individual radio buttons

**Try this:** Select Standard, Express and Pick up in turn. Their booleans are exclusive within one group; the independent choice belongs to another group.

Each radio binds its own boolean. A shared group makes the choices exclusive; a separate group stays independent.

**Uses:** the 0.3 input collection, shared labelbox, Source, Data and bindings. No endpoint calls, stores or validation engine.

<details>
<summary>More detail</summary>

`radioButton` uses one boolean per control; `group` names the exclusive group within the current Source form (or page). Selecting Express writes `express=True` and clears the selected peer. Use arrow keys between choices or click the captions. Compare w03: `radioButtonText` stores one selected code instead. These are two different value contracts.

All controls use `lbl`, `lbl_position` (TL by default; a pointer makes it follow Data) and the shared `lbl_`/`box_` style prefixes. Disable the controls to compare their common behavior. Label layout variants are in Settings (⚙) in the gallery footer.

**Sample data:** `02-radio_button_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
