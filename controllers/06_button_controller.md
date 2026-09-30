# 06 · Button controller

A button runs one click mechanism: a nested `dataController`, an `action`, or the `fire` family. Declaring two of them on one button is an error.

- **Nested controller.** The `dataController` inside the button runs once per click. Its code reads `button_counter`, which counts the clicks of this button and survives a rebuild, and `button_shift`, `button_ctrl`, `button_alt`, `button_meta`; `_evt` is the DOM event.
- **fire.** `fire='.saved'` fires the path at each click. The value is the modifier string, such as `Shift`, or `true` without modifiers.
- **fire_<name>.** `fire_save` and `fire_close` fire their paths with the values `save` and `close`, in attribute order: the log gets two entries per click.

A button with a mechanism gets `type="button"`, so it never submits a form by itself.

**Try it:** Press the first button with Shift, then Save with Alt.
