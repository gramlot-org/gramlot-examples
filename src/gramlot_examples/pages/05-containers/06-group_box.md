# groupBox: group fields and copy Data

**Try this:** Edit the customer, then use the group's copy command. Only that datapath is copied; the note in the other group is excluded. TYTX preserves types.

Group customer data under a heading. Copy TYTX with its types or choose plain JSON from the copy menu.

**Uses:** the 0.3 inputs and layout collections, labelbox and Source/Data bindings. No database, form-save service or endpoints.

<details>
<summary>More detail</summary>

`groupBox` supplies a heading around slotted Source children. `lbl_variant="underline"` gives a lighter heading. `copy=True` reads the current Bag at the group's explicit `datapath`, including nested data. The default clipboard text is TYTX, preserving supported types and node attributes. The menu's JSON choice uses Bag values as an ordinary object; it omits node attributes and can lose type distinctions. It does not copy rendered text, rejected drafts or unrelated Data. The browser must permit clipboard writing; a denied operation is reported beside the copy action without changing Data.

**Sample data:** `06-group_box_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
