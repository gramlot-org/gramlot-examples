# Input components

This section uses only the first input components, their shared labelbox, Source,
Data and bindings. It revisits native forms and binding with `textbox`, `checkbox`,
`radioButtonText`, multiline/password fields, single radios, colors and sliders;
the tree group also introduces a Bag store and lazy resolver branches.

The gallery activates the `inputs` collection once in its application configuration.
Python uses its generated JSON grammar; the browser loads its JavaScript implementation.
The widget names are the same in Python and JavaScript.

Start with Textbox, then compare the boolean checkbox and the single-choice radio
group. All controls use `lbl`, the same reactive `lbl_position` and the `lbl_`/`box_`
style prefixes. The controls belong to the shared inputs collection.


Continue with **Filtering select** for searchable local code/caption pairs, then
**Callback select** for the same interaction backed by 100 stable random records
in a Data Bag. These lessons add named browser Logic, with no endpoint calls.


**Combo box** allows free text as well as suggestions; **Checkbox group** stores
several selected codes together. Compare them with Filtering select and
RadioButtonText to understand the different value contracts.


**Date calendar (w17):** one civil date shared by an inline calendar, a popup field and a text-only field. Compare `dateCalendar`, the default `dateTextBox(calendar=True)` and `calendar=False`. The same labelbox and compact sizes apply.


**Required values and length (w18):** compare a rejected draft with the last accepted Data value. Shared validation covers required text, text length and a required number, with compact labelbox fields and a live-edit switch.

Use **Settings (⚙)** in the gallery footer to compare themes, light/dark and label positions across components. **As in the example** restores the lesson's own layout. The first lesson keeps a local position selector to explain its Data binding; later lessons focus on their particular input behavior.

**Formlet and shared labels (w19):** Arrange fields in columns and share label settings. Changing the layout preserves each field and its draft.

**GroupBox and typed copy (w20):** Group customer data under a heading. Copy TYTX with its types or choose plain JSON from the copy menu.

**Checkbox as a switch (w21):** A switch and a checkbox share one boolean. Compare their appearance, captions and read-only state.

- `w25`: complete local validation engine, conditional rules, warnings, Logic callbacks and RPC validation. DB/grid rules remain in their own integration scope.


## Gallery groups

The navigation groups these lessons by topic. Select a group label for its introduction, or expand its arrow to choose an example.

- **Text inputs**: Textbox and labelbox, Multiline text and labelbox, Password and labelbox.
- **Checkboxes and switches**: Checkbox and labelbox, Checkbox group, Checkbox as a switch.
- **Selecting values**: RadioButtonText and labelbox, Single radio buttons, Filtering select, Callback select, Combo box.
- **Numbers and sliders**: Horizontal slider, Vertical slider, Number editing.
- **Dates and times**: Date editing, Time editing, Date calendar.
- **Forms and validation**: Required values and length, Formlet and shared labels, GroupBox and typed copy, Validation rules and callbacks.
- **Buttons and commands**: Button commands, Toggle button with LED, Dropdown commands and persistence.

- **Tree**: Bag tree (w26), Tree labels and classes (w27), Tree callbacks, HTML and icons (w28). Compare hideValues, attribute and computed captions, CSS parts, explicit sanitized HTML and custom icons.
