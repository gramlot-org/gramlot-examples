# Hello, Gramlot!

`Page` inherits from Gramlot's base page. The host calls `main(root)` to build
its Source: `root.h1(...)` adds a heading and `root.p(...)` adds a paragraph.
The browser renders those declarations as HTML.

There is no HTML template to keep in sync with the Python code. Add another
`root.p(...)` and reload: one call adds one paragraph. The surrounding gallery
layout and theme are supplied outside the example.

Next, see [children and styles](03-lists.md). Later chapters introduce Data,
bindings and Gramlot components.
