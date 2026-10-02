# 06 · Style and visibility

Every attribute of the box is a `^` pointer, so the controls restyle it through the Data.

- `class` and `style` take a string, or null to remove the attribute.
- The style shortcuts `color`, `background_color`, `font_size`, `padding` and the macro `rounded` compose one `style` attribute with `style` itself. A shortcut wins over the same property written in `style`; a null shortcut drops only its own property.
- `visible` false sets `visibility: hidden`: the box disappears and keeps its space. `hidden` is the native attribute: the box leaves the layout.

Values need their CSS unit: `font_size='1.5rem'`, not `1.5`.

**Try it:** Write `color: red` in the style field: the shortcut `color` still wins. Then clear the visible checkbox, and afterwards check hidden.
