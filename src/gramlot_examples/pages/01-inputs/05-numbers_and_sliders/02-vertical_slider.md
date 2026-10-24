# Vertical slider: orientation and values

Vertical and horizontal sliders share the same level. The vertical minimum is at the bottom and the maximum at the top.

**Uses:** the 0.3 input collection, shared labelbox, Source, Data and bindings. No endpoint calls, stores or validation engine.

<details>
<summary>More detail</summary>

`verticalSlider` shares the numeric and editing contract of `horizontalSlider`. Standard CSS writing mode gives the native range its vertical orientation; the value increases upwards. Try ArrowUp and ArrowDown, then move the label. Home/End follow the browser's native writing-mode behavior: WebKit and Chromium can select opposite endpoints. The horizontal companion shows that orientation does not change the Data value.

All controls use `lbl`, `lbl_position` (TL by default; a pointer makes it follow Data) and the shared `lbl_`/`box_` style prefixes. Disable the controls to compare their common behavior. Label layout variants are in Settings (⚙) in the gallery footer.

</details>
