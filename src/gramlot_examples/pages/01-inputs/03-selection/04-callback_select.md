# Load choices with a browser callback

Search 100 random samples generated once in this page. The callback reads a Data Bag, without a server request.

**Uses:** the 0.3 input collection, shared labelbox, Source and Data bindings and named browser Logic. No endpoints or validation engine.

<details>
<summary>More detail</summary>

Search `Sample 02` to see samples 020–029, then choose one. The second field recovers its caption from the selected code. Searching again does not regenerate the random values: inspect `samples` in the Data inspector to see the same 100 records.

Python declares the control and names its browser Logic method:

```python
fields.callbackSelect(value="^choice", callback="searchChoices", lbl="Sample")
```

The Logic method receives `(node, kw)`. `_querystring` asks for matches; `_id` asks for the record of a code already in Data. It returns `{rows, identifier: 'id', caption: 'name'}`. Rows are objects with string codes and captions. The example reads them from a Data Bag initialized by an ordinary startup controller. No endpoint, manual DOM code or second application state is needed.

A callback may also return a Promise. The control shows pending state and discards responses from superseded searches or removed controls. Callback failures appear below the input. The same code/caption, keyboard and invalid-draft rules apply as in Filtering select.

Enable read-only mode without replacing the input; label layout variants are in Settings (⚙) in the gallery footer. Both fields use the same `lbl_` and `box_` contract as the earlier controls, with compact cards and bounded field widths.

</details>
