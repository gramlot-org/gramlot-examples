# Horizontal slider: range and steps

Two horizontal sliders share a numeric level. Drag or use the arrow keys; switch live editing to compare immediate and committed updates.

**Uses:** the 0.3 input collection, shared labelbox, Source, Data and bindings. No endpoint calls, stores or validation engine.

<details>
<summary>More detail</summary>

`horizontalSlider` wraps a native range input. `min`, `max` and `step` define its numeric range and can also use Data pointers. The Data value is a number, not text. With live editing off, releasing the slider commits the value. Native clamping affects display and does not rewrite an out-of-range Data value by itself.

All controls use `lbl`, `lbl_position` (TL by default; a pointer makes it follow Data) and the shared `lbl_`/`box_` style prefixes. Disable the controls to compare their common behavior. Label layout variants are in Settings (⚙) in the gallery footer.

</details>
