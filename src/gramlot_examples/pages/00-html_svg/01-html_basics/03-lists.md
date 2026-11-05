# Children and styles

> **What you learn**
>
> Build a container with children, generate a list with a loop, and style the
> result through separate attributes.

## A container and its children

`section = root.section(...)` creates a container. Calling `section.h2(...)`
adds its heading; `section.ul()` adds its list. The returned `items` lets you
add children inside that list.

In Inspector, open Source: the heading and list belong to the section;
the three list items belong to the list.

## One declaration, three items

The loop calls `items.li(name)` once for each name. Add another name and reload:
you get another list item without another declaration.

The loop builds Source when the page is created. It does not observe later Data
changes like the bindings in the previous lesson.

## Styles as attributes

On the section, `padding` provides inner spacing, `border_radius` rounds the
corners and `background` gives the group a visible surface. On the heading,
`color` changes only the title. Gramlot translates these attributes into CSS.

The `var(...)` values use the current theme's colors, so the example works in
light and dark mode. Change a style value and reload to compare the result.

## Compare the example and code side by side

Example, Explanation and Code each have a detach icon inside their panel.
Use it to open the panel in a floating window. Move the window by its title bar
and resize it from its corner to arrange the example beside these instructions
or its code.

Close the floating window with **×** to return the same panel to its tab.
Detaching and docking preserve the running example's state.
