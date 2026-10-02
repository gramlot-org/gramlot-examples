# 04 · Native editing

A control whose `value` is a `^` pointer shows the Data and writes it back when you edit.

- Text and textarea write a string; number and range write a number, or null when the field is empty; date writes its text such as `2026-09-30`; color writes the color string.
- A single select writes the chosen value; a multiple select writes a list.
- With `live` false a field writes at `change`, when you leave it or press Enter. With `live` true text, textarea, number and range write at every `input`. Here `live='^.live'` follows the checkbox, without rebuilding the fields.

The list on the right reads the same Data paths.

**Try it:** Type in the text field with the checkbox off, then on, and compare when the list changes.
