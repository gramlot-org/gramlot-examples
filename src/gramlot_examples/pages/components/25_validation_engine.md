# 25 · Validation rules and callbacks

A labelled groupBox contains a compact formlet with text, multiline text, number, date, selection and boolean controls. Try required values, length, normalization, conditional rules, warnings and asynchronous validation. The group copy icon copies the accepted `profile` Bag as TYTX; its menu also offers JSON. Invalid drafts are not copied. The expandable accepted-Data panel shows what actually changed.

**Uses:** shared input validation, Source conditions, named Logic and typed RPC. The endpoint also runs in the serverless Worker. No database or form-save service.

<details><summary>More detail</summary>

```python
group = pane.groupBox(datapath="profile", copy=True, lbl="Profile")
pane = group.formlet(lbl_position="L")
pane.textbox(value="^.code", validate_case="upper", validate_regex="(?:^[A-Z]{2,6}$)")
pane.textbox(value="^.email", validate_email=True, validate_email_iswarning="^.strict:=!{}")
pane.textbox(value="^.nickname", validate_call="checkNickname")
pane.textbox(value="^.remote_name", validate_remote="check_name")
```

Clear Name or Appointment to test required values. Write more than 40 characters in Notes. Delivery accepts a listed choice and cannot be empty. The groupBox declares `datapath="profile"` once; its formlet inherits it and fields use relative `^.field` pointers. The formlet automatically aligns left labels without fixed label widths.

Try `abc` in Code: the accepted value becomes `ABC`. Clear the fallback: it becomes Guest. Quantity rejects values outside 0–10. A malformed email is accepted with a warning unless the blocking switch is on. The length condition reads the resolved `validate_enabled` parameter as `enabled`.

The local callback reserves `admin`. The endpoint reserves `taken` and normalizes accepted names to uppercase. It returns a validation result; it does not write Data. While a request is pending, Data retains its last value. Editing again, changing the rules or removing the field makes the old response obsolete. Timeout and transport errors reject the candidate.

`validate_onAccept` runs after the Data write. `validate_onReject` sees the rejected candidate while Data still contains its previous value. Named Logic receives `(node, {value, result, validations, userChange, ...parameters})`; small inline conditions/bodies must originate in activated Source. Full syntax is documented in the core component guide.

</details>
