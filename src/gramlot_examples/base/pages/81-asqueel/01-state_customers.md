# State and customer

Change State after choosing a Customer. A hard condition retains the old selection with an error; a weak condition is a preference. Parameters are reactive Data bindings. Switch State label between Full name and Code: caption_field refreshes the label while retaining the selected key.

**Free text or customer** is a `dbComboBox`: its value is the text itself. Enter keeps free text; arrows or a click choose a suggestion from the same customers table, and `selected_suburb` copies that customer's locality into Data.
