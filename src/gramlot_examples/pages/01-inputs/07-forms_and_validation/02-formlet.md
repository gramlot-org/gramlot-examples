# Arrange fields with formlet

**Try this:** Switch between one and two columns. The same fields move without losing their values; the note keeps its own label-position override.

Arrange fields in columns and share label settings. Changing the layout preserves each field and its draft.

**Uses:** the 0.3 inputs and layout collections, labelbox and Source/Data bindings. No database, form-save service or endpoints.

<details>
<summary>More detail</summary>

`formlet` automatically sizes left labels to the widest label in each rendered column, without fixed label widths. It supplies a grid and shared `lbl_*` / `box_*` defaults. A field's own declaration wins. Defaults that contain pointers resolve in the formlet's Data scope. Layout updates preserve the same controls, focus and uncommitted text. `columns` accepts an integer or CSS track list; `col_min_width` selects a responsive grid, as demonstrated by GroupBox. Use the gallery settings to preview other label positions.

**Sample data:** `02-formlet_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
