# 16 · Checkbox group

**Sample data:** `02-checkbox_text_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

Choose several notification channels. Two groups share the same comma-separated codes; clearing all choices writes null.

**Uses:** the 0.3 input collection, labelbox, Source and Data bindings. No endpoints, stores or validation engine.

<details>
<summary>More detail</summary>

Check **SMS** in either group: both show the same selection. The Data value is a string such as `email,push,sms`, not the visible captions. Uncheck every option: Data becomes null. Existing selected codes keep their order; new choices are appended.

```python
fields.checkBoxText(value="^channels", values="email:Email,sms:SMS,push:Push",
                    lbl="Notifications", cols=2)
```

Compare **RadioButtonText**: it uses the same option and labelbox structure, but selects only one code. Here every checkbox is independent. Tab or arrow keys move focus and Space changes the focused checkbox. Home/End move to the first/last option.

Change the number of columns; label layout variants are in Settings (⚙) in the gallery footer. The group keeps its controls and selection. `values`, `cols`, `lbl_position` and `readonly` can follow Data pointers; the readonly switch locks both groups. Shared `lbl_` and `box_` attributes style the same labelbox parts as earlier lessons.

This lesson uses an inline group. Popup selection and Bag/store-backed options are separate features. Cards stay within 24rem and the column slider within 16rem.

</details>
