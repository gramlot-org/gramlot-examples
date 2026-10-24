# Validate required values and text length

**Sample data:** `01-validation_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

Try a missing, short or long name. You learn the difference between the draft visible in a field and the last accepted value in Data.

**Uses:** the 0.3 input collection, shared validation, labelbox and Data bindings. No form/save service, callbacks or remote validators.

<details>
<summary>More detail</summary>

```python
fields.textbox(value="^name", lbl="Name", validate_notnull=True,
               validate_len="2:8", validate_len_error="Use 2 to 8 characters.")
```

Type `A`, then leave the field: the message appears, while the accepted name stays `Ada`. Try more than eight characters: nothing is truncated. Type `Grace` and leave the field: both Data views update and the message disappears. Clear the field: the required message appears and Data stays `Grace`.

Turn **Validate while typing** on to use `live=True`. The same rules now run on each edit, after IME composition has finished. Otherwise text fields validate on their normal change/blur event; typed number/date/time editors also confirm on Enter.

`validate_notnull` rejects null and the empty string. Zero and false are values. `validate_len="2:8"` accepts 2–8 characters, `"2:"` sets only a minimum, `":20"` only a maximum, and `"4"` requires an exact length. Length counts JavaScript string units, as in the existing PoC; it is not a grapheme counter. Optional empty text passes the length rule, as the note demonstrates. No trimming or normalization is added.

The error messages can be customized with `validate_notnull_error` and `validate_len_error`; they are marked as localizable strings for the future localization service. Rules and messages may follow Data pointers. The next edit uses the current rules. Changing a label does not discard an invalid draft; a different external Data value replaces it. Validation does not filter writes performed directly by application logic.

The shared message also drives ARIA and native custom validity. Gramlot remains the rule owner; `maxlength` is not imposed because that would prevent the invalid draft from being entered and inspected. Required quantity demonstrates that clearing a typed editor is rejected while zero is accepted.

</details>

An invalid field keeps a pale red background. Its message floats without moving the other fields,
then fades out after about two seconds (no animation with reduced motion). Focus or hover the field to read it again;
Escape dismisses it. The error and last accepted Data value remain until corrected.
