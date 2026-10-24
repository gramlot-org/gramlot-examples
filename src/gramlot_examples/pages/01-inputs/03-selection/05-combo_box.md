# Combine free text and suggestions

**Sample data:** `05-combo_box_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

Choose a suggested city or enter a different one. Two fields share the same text; suggestions do not restrict what you can write.

**Uses:** the 0.3 input collection, labelbox, Source and Data bindings. No endpoints or validation engine.

<details>
<summary>More detail</summary>

Type `Pa` and choose **Paris** from the suggestions. Then type a city absent from the list and press Enter or leave the field: the new text is accepted and appears in both controls.

```python
fields.comboBox(value="^choice", values="Rome,Paris,Berlin", lbl="City")
```

`comboBox` stores the text, including the caption of a chosen suggestion. Compare **Filtering select**, which accepts only listed choices and stores their codes. If `values` contains `code:Caption` pairs, comboBox still stores the caption, not the code.

The arrow opens all suggestions. Up/Down moves the highlight; Enter or a click chooses it. Escape cancels an uncommitted draft. Empty text writes an empty string; an untouched initial null stays null. `live=True` enables text updates while typing, through the same binding and IME handling as textbox.

`values`, `lbl_position` and readonly can follow Data pointers. Changing the label preserves the input and caret. Cards and fields remain compact, using the shared `lbl_` and `box_` styling contract.

</details>
