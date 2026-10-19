# 10 · Number editing

Try a comma decimal, an integer and an exact Decimal. Invalid text stays in the field without changing Data.

**Uses:** the 0.3 input collection, labelbox, typed Data, page locale and Gramlot formatting. No endpoint calls or validation engine.

<details>
<summary>More detail</summary>

The page locale is `it-IT`: enter `38,25`, without thousands separators. The amount accepts 0–100; the integer field rejects fractions. `dtype="N"` keeps a Decimal, including digits beyond JavaScript's safe integer range. `format="0.00"` controls display, not the stored precision. The Exact Decimal field starts empty: type `9007199254740993.25` and the stored value keeps every digit, in Python and in JavaScript.

Try `38x`: it stays visible with an error while the previous Data value remains intact. Clear a field to write null. Enter or leaving the field commits a valid draft; Escape restores the last accepted value. With live editing, each complete valid input updates Data. Partial or invalid input never writes a replacement value.

Make the fields read-only; try label layout variants from Settings (⚙) in the gallery footer. All the number fields keep the shared labelbox contract (`lbl_` and `box_`). The cards stay within 24rem.

</details>
