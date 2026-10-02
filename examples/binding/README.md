# Binding

The pages of this family keep their content in the Data and let the DOM follow it.

A `^` pointer in a text or an attribute reads a Data path and keeps the element up to date. A native control whose `value` is a `^` pointer also writes the Data when you edit it. `dataSetter` puts the initial values in the Data before the first render.

Start with **Pointers**, then follow the order of the list: a context that changes, initial values and defaults, editing, booleans, style and SVG, freeze. The last three pages take the content of HTML / SVG examples 06, 08 and 12 and add the binding, so the same page shows the difference.

Each example has a Python page and its JavaScript equivalent. Both run on the same packaged runtime.
