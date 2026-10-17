# 03 · RadioButtonText and labelbox

Choose one delivery option in each group. Change the column count, and try the arrow keys inside a group.

**Uses:** the first 0.3 input components, shared labelbox, Source, Data and bindings. No endpoints or validation engine.

<details>
<summary>More detail</summary>

`values="standard:Standard,express:Express,pickup:Pick up"` separates stored codes from visible captions. Each group writes only its own Data path; `cols` and `lbl_position` can follow pointers.

The controls stay above the groups so changing the number of rows does not move the slider while you drag it. The number beside **Columns** shows the current Data value, from 1 to 3.

**Try it:** click either checkbox and inspect the shared boolean in Data. For layout variants, use Settings (⚙) in the gallery footer.

</details>
