# Choose and bind a color

Choose a color in either picker. Both controls and the swatch follow the same Data value.

**Uses:** the 0.3 input collection, shared labelbox, Source, Data and bindings. No endpoint calls, stores or validation engine.

<details>
<summary>More detail</summary>

`colorpicker` uses the native browser color dialog and a `#rrggbb` string. Live mode uses the input events the browser supplies; otherwise the value commits on change. The swatch uses ordinary Source style binding. The dialog appearance can differ between browsers.

All controls use `lbl`, `lbl_position` (TL by default; a pointer makes it follow Data) and the shared `lbl_`/`box_` style prefixes. Disable the controls to compare their common behavior. Label layout variants are in Settings (⚙) in the gallery footer.

</details>
