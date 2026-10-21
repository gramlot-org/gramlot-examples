# 05 · Password and labelbox

Two password fields share a sample value. The browser masks the characters; changing either field updates the other.

**Uses:** the 0.3 input collection, shared labelbox, Source, Data and bindings. No endpoint calls, stores or validation engine.

<details>
<summary>More detail</summary>

`passwordbox` wraps a native password input. Masking changes its display, not the value in Data: this lesson uses a sample, and the inspector can read it. It has the same string, live editing and labelbox behavior as `textbox`.

All controls use `lbl`, `lbl_position` (TL by default; a pointer makes it follow Data) and the shared `lbl_`/`box_` style prefixes. Disable the controls to compare their common behavior. Label layout variants are in Settings (⚙) in the gallery footer.

</details>
