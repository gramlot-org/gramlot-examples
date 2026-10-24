# Time fields: entry and display formats

**Sample data:** `02-time_textbox_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

Edit a civil time with hours, minutes and optional seconds. The two fields keep the same typed value.

**Uses:** the 0.3 input collection, labelbox, typed Data, page locale and Gramlot formatting. No endpoint calls or validation engine.

<details>
<summary>More detail</summary>

Type `14:35`, `14:35:20` or `14:35:20.125`. Editing uses the 24-hour clock; display uses the page locale and `format` (`short` or `medium`). A short display can hide seconds, but it does not remove them from Data. Focus the field to see the complete time again.

Python starts with `datetime.time`; TYTX `H` carries a civil time, represented in JavaScript on 1970-01-01 UTC. No timezone shift is applied. Midnight is a valid value; an empty field writes null. `25:00` stays as an invalid draft without overwriting Data. Enter or leaving the field commits; Escape cancels. Millisecond precision is supported; this editor does not provide a time picker popup.

Make the fields read-only; try label layout variants from Settings (⚙) in the gallery footer. Both controls keep the shared labelbox contract (`lbl_` and `box_`). The cards stay within 24rem.

</details>
