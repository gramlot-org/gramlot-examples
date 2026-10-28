# Bound forms

**Try this:** change Name, then leave the field. Its Data entry changes.
Drag Intensity: that entry changes immediately because the slider uses `live=True`.

This is the **Native forms** lesson with bindings added. The browser controls
stay familiar; one Data Bag now owns the editable record.

## One path, two views

```python
parent.input(type=kind, value=f"^.{key}", **attrs)
summary.dd(f"^.{key}")
```

The page declares `datapath="form"`. Relative pointers such as `^.name` therefore
refer to `form.name`. The input and the summary read the same value; no controller
copies text between them. Moving that parent datapath relocates both views.

## Read the code

`main` composes the form and its summary. Three methods build **Identity**,
**Choices and ranges**, and **Flags and states**. `field` supplies the repeated
label/input pair; a short loop declares the date, time, month and week controls.
`data_record` renders the listed paths with another loop.

Initial values come from `03-forms_data.tytx`. To start with a different quantity,
change `form.quantity` in that Bag, then reload: both views receive it.
There is no separate `RECORD` constant or repeated default in each input.

## Explore the different values

- **Region** selects one string; **Topics** selects a list of strings.
- **Receive updates** writes a boolean.
- **Daily / Weekly** use one radio group. Select Daily: `frequency.weekly` becomes
  false. The summary deliberately shows only the weekly path.
- **Password** is bound but omitted from the summary. This is a display choice,
  not a security boundary.
- **Read-only code**, **Unavailable choice** and **Attachment** remain unbound.
  File selection does not upload a file.

## Reset and submit

The earlier native form has an HTML Reset button. This bound version deliberately
does not: native reset does not emit the input/change events needed to synchronize
the Data Bag. Submit is disabled. Saving a record is a separate application task,
not a side effect of binding.
