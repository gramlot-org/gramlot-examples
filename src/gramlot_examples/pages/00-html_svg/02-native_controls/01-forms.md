# Labels and boxes

> **What you learn**
>
> Give any HTML element a label and style its outer box, using the same
> Labelbox mechanism as Gramlot components.

`input` and `div` are ordinary HTML elements. Adding `lbl` asks Gramlot to
present the element inside a Labelbox with that label. The `div` keeps its
paragraph as a child: a Labelbox can surround content, not only an input.

`box_width`, `box_padding`, `box_border` and `box_border_radius` style the outer
Labelbox. Both boxes have the same width; `box_max_width="100%"` lets the Summary
fit smaller panels. The border uses the current theme's color. They are
separate from `color` or `padding` on the element itself. Try changing the
width or padding, or add `lbl_position="L"` to place a label on the left.

This is the same Labelbox used by Gramlot components, which are introduced in the
next chapter. `html_button` explicitly selects the native HTML button; `button`
selects Gramlot's richer component. The native button in this example has no action.
