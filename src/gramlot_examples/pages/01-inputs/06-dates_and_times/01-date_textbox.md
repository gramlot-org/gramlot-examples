# Date fields: entry and display formats

**Try this:** Type domani and leave the field. Compare the long and short Italian date formats: they represent the same civil date.

Enter a calendar date or a word such as oggi or domani. Two fields share one civil date.

**Uses:** the 0.3 input collection, labelbox, typed Data, page locale and Gramlot formatting. No endpoint calls or validation engine.

<details>
<summary>More detail</summary>

The page locale is `it-IT`. Focus a field to edit its short date; leave it to see its chosen `format`. Try `18/10/2026`, `oggi` and `domani`. Words such as `ieri`, `oggi` and `domani` are relative to today in the browser, independently of the date already in the field. An explicit `workdate="YYYY-MM-DD"` can be used when an application deliberately needs a different reference day.

The Data value is a Python `date`, transported as TYTX `D`; JavaScript represents it as a Date at UTC midnight. It remains a civil date, independent of the page timezone. `31/02/2026` is invalid and does not change Data. Period expressions are rejected: this field edits one complete date. Clearing writes null; Escape cancels the draft. The control is a text editor first; the calendar popup of the first field is described below.

Make the fields read-only; try label layout variants from Settings (⚙) in the gallery footer. Both controls keep the shared labelbox contract (`lbl_` and `box_`). The cards stay within 24rem.

**Sample data:** `01-date_textbox_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>

The first field also opens a calendar (Alt+Down or its button). The second uses `calendar=False` to keep text editing only. See **Date calendar** for the standalone view and shared binding.
