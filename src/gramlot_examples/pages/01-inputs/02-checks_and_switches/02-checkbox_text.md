# checkBoxText

Select several values while keeping their **codes** in Data and showing their
**descriptions**. Three groupBoxes separate Inline, Popup and Hierarchy.
A single parent limits the page to `34rem`, with spacing between groups; it shrinks
on narrow screens. The groups organize the controls without introducing a new
Data path, so the two city controls still share the same value.

The adjacent `02-checkbox_text_data.tytx` supplies the initial city codes and the
empty options Bag; `main` only declares controls and the remote load.

## Inline

The first control omits `popup`: its default is `False`. Only the checkboxes are
visible, with no text field or chevron. The compact Columns comboBox offers 1, 2 or 3; `columns="^columns"` observes the choice and `cols="==Number(columns)"` converts its text to the integer required by the layout.
The optional Read only control binds `readonly` across all three examples.

## Popup and editable descriptions

The second control uses `popup=True`. Its integrated chevron opens the same choices.
Both city controls bind `value="^cities"`, so changing one immediately updates the
other. The `code` below displays the real Data value.

`MI:Milano` pairs a code with a description. Initial Data `MI,TO,CO` therefore reads
`Milano,Torino,Como`. Append `,pa`, choose Pavia or finish typing it, and press Enter:
Data becomes `MI,TO,CO,PV`. Remove a description to remove its code. Clear the text
or uncheck every city for null. Checks commit immediately; text commits on Enter
or when you leave the field. Escape discards an unfinished edit.

Unknown or ambiguous descriptions remain a draft on Source, leave Data unchanged,
and prevent form acceptance. Matching ignores case. Use checkboxes for duplicate
captions or captions containing commas. `_dv_displayedValue` on the value node holds
the resolved descriptions; it is not the stored selection.

## Hierarchy

`hierarchical=True` reuses Gramlot's checkbox tree on the original Bag. This example
is inline; add `popup=True` to put the same tree in the popup. Check **manual** and
expand it: its children follow the check, while **fixed** remains checked and
cannot be edited. `checkChildren=True` is the default.

`dataRemote` loads the options Bag through the small endpoint. The endpoint builds
the hierarchy and declares the disabled node; no application checking code is
needed. The value contains paths such as `manual.guide`. Use `identifier="code"`
for explicit codes on every node, and `labelAttribute="caption"` for captions.
Codes in unloaded branches are recognized after loading. Typing does not load the
whole hierarchy. See **Hierarchical choices** for an example with lazy children.

## Remote flat lists

For flat database choices, use `dbtable` or an endpoint `method` instead of `values`.
The complete eligible list is loaded, including any configured condition. See the
database checkbox example; hierarchical Bags continue to use `dataRemote`.
