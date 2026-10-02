# 09 · Forms with binding

The fieldsets of HTML / SVG example 06, with each `value` bound to a field of the Data record `form`.

- One `dataSetter` writes the whole record from a dictionary (Python) or a plain object (JavaScript); a second setter adds `frequency.weekly`.
- Each field writes its own type: numbers for quantity and intensity, a list for the topics, booleans for the checkbox and the two radio buttons.
- The record on the right reads the same paths, so it changes while you edit. Intensity has `live` true and follows the slider.
- The password is bound but not shown, and the file field stays native: a file has no Data value.

**Limit:** Reset is not offered: a native reset changes the fields without an input event, so the Data would not follow.

**Try it:** Compare this page with example 06: the fieldsets are the same, and the initial values moved from the attributes to the Data record.
