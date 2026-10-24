# 04 · Multiline text and labelbox

**Sample data:** `02-text_box_area_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

Two multiline fields share one note. Switch live editing or disable the controls while keeping the text and selection.

**Uses:** the 0.3 input collection, shared labelbox, Source, Data and bindings. No endpoint calls, stores or validation engine.

<details>
<summary>More detail</summary>

`textBoxArea` wraps a native textarea; `rows` and `cols` set its visible size. With live editing off, leave the field to commit. With it on, the second field follows each edit. Native `textarea` remains available in the earlier HTML lessons.

All controls use `lbl`, `lbl_position` (TL by default; a pointer makes it follow Data) and the shared `lbl_`/`box_` style prefixes. Disable the controls to compare their common behavior. Label layout variants are in Settings (⚙) in the gallery footer.

</details>
