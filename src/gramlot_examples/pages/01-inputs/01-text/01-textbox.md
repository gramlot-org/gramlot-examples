# Text fields: live updates and labels

**Try this:** Type a customer name and watch the second field follow. Open Options, turn off live editing, then type again: the shared value changes when you leave the field.

Two textboxes share a customer name. Type in either one, switch live editing off and on, and move the label without rebuilding the field.

**Uses:** the first 0.3 input components, shared labelbox, Source, Data and bindings. No endpoints or validation engine.

<details>
<summary>More detail</summary>

`lbl_` styles the label; `box_` styles the whole labelbox. `box_l_` and `box_c_` address its label and control containers. Read only stops editing while Data updates can still reach the field.

**Try it:** choose each of `TL`, `TC`, `TR`, `L`, `R`, `BL`, `BC`, `BR`. The default is `TL`. Open the inspector to see the same values in Data.

**Sample data:** `01-textbox_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
