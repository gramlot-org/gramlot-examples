# Control styles and visibility from Data

**Try this:** Change the color and dimensions, then toggle visibility. Notice that an invisible box still reserves its place in the layout.

Controls change an element’s appearance and visibility. You learn how Data drives styles and classes, and how hiding content differs from removing its space in the layout.

**Uses:** Source, Data, pointers and native binding. No endpoint calls.

<details>
<summary>More detail</summary>

**Goal:** Predict attribute precedence and distinguish visibility from layout removal.

**Before this lesson:** [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/01-native_editing.md), [b05 · Checkbox and radio](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/02-checkbox_radio.md).

## From Python to Source to DOM

The controls above change Data. The preview box reads that Data through its bindings.
Follow three steps side by side; these are **excerpts of the existing page**, not
additional declarations to paste into it. Source cells list attributes, not serialized
Bags; DOM cells show only relevant CSS and omit other styles/classes. Browsers may
normalize colors to `rgb(...)` and change declaration spacing/order.

| Python declaration | Source attributes | DOM inline style at startup |
| --- | --- | --- |
| `color="^.color"` | `color: "^.color"` | `color: #ffffff` |
| `background_color="^.background"` | `background_color: "^.background"` | `background-color: #456bc4` |
| `font_size="^.size"` | `font_size: "^.size"` | `font-size: 1.5rem` |
| `padding="1rem"` | `padding: "1rem"` | `padding: 1rem` |
| `style="^.style"` | `style: "^.style"` | `border: 4px dashed #ffc400` |

All these attributes belong to the **same** preview div. Its enclosing pane has
`datapath="look"`, so `^.color` follows `look.color`. The renderer combines the
resolved values into one HTML `style` attribute. It does not put a `color` HTML
attribute on the div or replace the Source pointer with its current value.

For comparison, a literal declaration has no Data dependency:

| Python | Source attributes | DOM |
| --- | --- | --- |
| `pane.div("Hello", color="red", font_size="18px")` | `color: "red"`, `font_size: "18px"` | `<div style="color: red; font-size: 18px;">Hello</div>` |

This comparison uses the literal styling foundation; the controls in this lesson
add the core 0.2.0 Data binding layer. No later controller or component feature is needed.

## Try the binding

1. Choose a new **Text color**, for example `#ff0000`.
2. The color input writes its value to `look.color`.
3. The preview's `color="^.color"` reads that value and becomes red.
4. Inspect its Source: `color` still contains `^.color`. Inspect the preview element
   in browser DevTools: the inline style now has the resolved red color.

The input writes Data; the div displays it. This is not the div's CSS writing back
to Data. Python built the Source; these edits and projections execute in the browser.

## Which style wins?

Restore **Text color** to white, then replace the **style** field with
`color: red; border: 4px dashed #ffc400` and leave the field to commit the edit.

| Declaration retained in Source | Current Data | Resulting inline style (excerpt) |
| --- | --- | --- |
| `style="^.style"`, `color="^.color"` | `look.style = "color: red; border: 4px dashed #ffc400"`; `look.color = "#ffffff"` | `color: #ffffff; border: 4px dashed #ffc400` |

**The text stays white:** the explicit `color` shortcut wins over the same property
inside `style`. The border survives because it has no conflicting shortcut. Now
replace the style field with only `color: red`: the border disappears, while text
stays white. Replacing the style string removes its old declarations; other shortcut
properties still compose into the result.

This is Gramlot's composition of inline style. The browser then applies the CSS
cascade: an applicable `!important` stylesheet rule can change the computed result.
A resolved null shortcut removes its property; it does not restore an overwritten
property from the style string. Class/style values accept strings or null, not objects.

## What about the reverse direction?

As a temporary debugging exercise, select the preview's `#box` element in browser
DevTools and change its inline `color` to green. Source still has `^.color`, and
Data still has the selected color: **editing CSS does not update either one**.
Choose another Text color in the page: the Data-driven projection takes over again.
Reloading also rebuilds the page from its declarations.

Editing a literal Source attribute through the Gramlot inspector does project it to
the DOM, but does not save it to the Python/JS source file. The inspector's **Styles**
tab previews theme variables, not reverse conversion of element CSS into Source;
use **Download CSS** there to export applied theme overrides. Computed CSS may come
from classes, inheritance or variables, so there is no single reverse mapping.

## Visibility and a small exercise

Uncheck **visible**: the box keeps its space. Restore it and check **hidden**: the
space collapses. Restore visible and clear hidden, then choose **2rem** font size
and **24px** corners. The same box changes appearance; its Source structure stays
unchanged. Use explicit CSS units for sizes.

For the broader theme and cascade explanation, see
[Python styles and a reactive example](https://github.com/gramlot-org/gramlot/blob/main/docs/public/096-themes-and-css.md#gc-096-040).

## Limits and next step

Stay with the agreed string/null contract. This lesson does not teach object coercions or rely on them.

Continue with [b07 · Bound SVG](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/03-presentation/02-bound_svg.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-070) explains the full contract.

</details>
