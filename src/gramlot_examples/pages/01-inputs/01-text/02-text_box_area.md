# Multiline text fields

**Try this:** Edit either note. Both multiline fields share the same text; Options lets you compare live editing with updates after leaving the field.

Two multiline fields share one note. Switch live editing or disable the controls while keeping the text and selection.

**Uses:** the 0.3 input collection, shared labelbox, Source, Data and bindings. No endpoint calls, stores or validation engine.

<details>
<summary>More detail</summary>

`textBoxArea` wraps a native textarea; `rows` and `cols` set its visible size. With live editing off, leave the field to commit. With it on, the second field follows each edit. Native `textarea` remains available in the earlier HTML lessons.

All controls use `lbl`, `lbl_position` (TL by default; a pointer makes it follow Data) and the shared `lbl_`/`box_` style prefixes. Disable the controls to compare their common behavior. Label layout variants are in Settings (⚙) in the gallery footer.

**Sample data:** `02-text_box_area_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
