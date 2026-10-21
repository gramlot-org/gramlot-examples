# 13 · Filtering select

Search a caption, store its code. Two fields share the same choice and the same list.

**Uses:** the 0.3 input collection, shared labelbox, Source and Data bindings. No endpoints or validation engine.

<details>
<summary>More detail</summary>

Type `Exp`, then press Enter or click **Express**. Data stores `express`, while both fields show **Express**. The arrow button opens all choices; use Up/Down to move and Enter to select. Escape restores the committed caption. Emptying and leaving the field writes null. An unknown caption stays as an invalid draft and does not overwrite Data.

`values="^choices"` reads `code:Caption` pairs separated by commas from Data. Updating that value refreshes the choices. `filteringSelect` is a component; plain `select` remains the native HTML element.

```python
fields.filteringSelect(value="^choice", values="^choices", lbl="Delivery")
```

Enable read-only mode without replacing the input; label layout variants are in Settings (⚙) in the gallery footer. Both fields use the same `lbl_` and `box_` contract as the earlier controls, with compact cards and bounded field widths.

</details>
