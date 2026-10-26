# Validation rules, warnings and callbacks

**Try this:** Try an empty name, quantity 11 and a malformed email. Compare drafts with Accepted Data, then make the email warning blocking and retry.

A labelled groupBox contains a compact formlet with text, multiline text, number, date, selection and boolean controls. Try required values, length, normalization, conditional rules, warnings and asynchronous validation. The group copy icon copies the accepted `profile` Bag as TYTX; its menu also offers JSON. Invalid drafts are not copied. The expandable accepted-Data panel shows what actually changed.

**Uses:** shared input validation, Source conditions, named Logic and typed RPC. The endpoint also runs in the serverless Worker. No database or form-save service.

<details><summary>More detail</summary>

```python
group = main_content.groupBox(datapath="profile", copy=True, lbl="Profile")
fields = group.formlet(lbl_position="L")
fields.textbox(value="^.code", validate_case="upper", validate_regex="(?:^[A-Z]{2,6}$)")
fields.textbox(value="^.email", validate_email=True, validate_email_iswarning="^.strict:=!{}")
fields.textbox(value="^.nickname", validate_call="checkNickname")
fields.textbox(value="^.remote_name", validate_remote="check_name")
```

Clear Name or Appointment to test required values. Write more than 40 characters in Notes. Delivery accepts a listed choice and cannot be empty. The groupBox declares `datapath="profile"` once; its formlet inherits it and fields use relative `^.field` pointers. The formlet automatically aligns left labels without fixed label widths.

Try `abc` in Code: the accepted value becomes `ABC`. Clear the fallback: it becomes Guest. Quantity rejects values outside 0–10. A malformed email is accepted with a warning unless the blocking switch is on. The length condition reads the resolved `validate_enabled` parameter as `enabled`.

The local callback reserves `admin`. The endpoint reserves `taken` and normalizes accepted names to uppercase. It returns a validation result; it does not write Data. While a request is pending, Data retains its last value. Editing again, changing the rules or removing the field makes the old response obsolete. Timeout and transport errors reject the candidate.

`validate_onAccept` runs after the Data write. `validate_onReject` sees the rejected candidate while Data still contains its previous value. Named Logic receives `(node, {value, result, validations, userChange, ...parameters})`; small inline conditions/bodies must originate in activated Source. Full syntax is documented in the core component guide.

**Sample data:** `04-validation_engine_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
