# HTML and components

**Try this:** edit any of the three names. They share `customer` in the Data Bag.
Use either **Clear name** button: both declarations update that same value.

## Two ways to declare a control

| HTML tag | Gramlot component |
| --- | --- |
| `input(type="text", value="^customer")` | `textbox(value="^customer")` |
| `html_button("Clear", connect_onclick="this.SET('customer', '')")` | `button("Clear", action="this.SET('customer', '')")` |

An HTML tag exposes a browser element. A component adds a Gramlot interface for
behavior such as validation, field state or command options. Use the `html_`
prefix when the HTML name would otherwise select a component, as with
`html_button` and `button`. `input` already names the HTML tag.

Both are authored in Source. Both can bind to Data. No application code reads the
DOM to copy values between controls.

## Labels and styles are shared

Open **Options** and change the label position. The first HTML input and the first
textbox use the same `lbl` and `lbl_position` mechanism: a labelbox wraps the
control. Labels are not exclusive to components.

Style attributes can be written separately: `width="100%"`, `padding="8px"`,
`color="..."`. `lbl_` targets the label, `box_` the wrapper, and `box_l_` / `box_c_`
the label/control containers. Here `box_c_width="100%"` lets the control use its
available space.

Turn **Update while typing** off, edit a name, then leave the field. The Data
changes on `change` instead of every keystroke. **Read only** stops typing; it does
not stop Data updates, so either Clear button still updates the fields.

## Read the code

`main` composes the comparison. `html_controls`, `components` and `options` build
one part each. The second textbox keeps the original two-component binding test;
the HTML input adds the comparison without creating a second record.

`01-textbox_data.tytx` supplies the sample customer. `default` initializes only
the interface options. This page introduces components; the validation and button
lessons demonstrate their richer behavior separately.
