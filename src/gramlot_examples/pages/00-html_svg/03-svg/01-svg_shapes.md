# HTML and SVG

`root.svg(...)` adds an SVG drawing to the same Source tree as the HTML page.
The returned `drawing` is the parent of the circle and rectangle, declared with
their familiar SVG attributes. `viewBox` defines their coordinate system.

`role` and `aria_label` give the drawing an accessible name. Change `r` to make
the circle larger, or add another shape: no separate SVG file is needed.

These are SVG elements, just as `root.div()` declares an HTML element. Their
attributes belong to Source; later examples can bind them to changing Data.
