# Color Maker: one block, three contexts

**Try this:** Open the palette, select Background, Text or Shadow and move a slider. Random changes only the selected block; the three editors use the same method under different datapaths.

This is a learning example of reusable Source blocks.

Open the floating palette with the palette icon beside the title. Select a block
by clicking inside it or focusing one of its sliders; its background is highlighted.
The floating window is non-modal and movable. Close and reopen it to retain the colors.

Move **Red**, **Green** or **Blue** in one panel. Its swatch, numeric RGB value and
part of the poster update immediately. The other two panels keep their values.
The palette has **one Random button**. It assigns three random integers from 0 to
255 to the selected block only. Background is selected initially using a Data
default. Selection belongs to the palette; the reusable RGB helper does not know
which block is selected and still uses only its own relative datapath.

Try the sliders with the keyboard as well: focus a slider and use the arrow keys.

## What to notice

The nine sliders are created by two loops, not nine copied declarations.
`palette()` calls `color_rgb()` on three sections with different relative datapaths:
`.background`, `.ink` and `.shadow`, below the page's `maker` context.
The method's `^.red`, `^.green`, `^.blue` and `.rgb` paths stay unchanged.

`color_rgb()` defines one local formula; its three instances calculate independently.
`preview()` binds to their results. A short button action uses the selected context to write random channel values.
There are no manual DOM updates, RPC or custom browser Logic. Initial colors are interface defaults on the sliders.
Reloading restores them; this example does not save a palette.

## Read the code in this order

1. **main**: open the palette and compose the example.
2. **palette**: create three contexts, track selection and randomize the selected one.
3. **color_rgb / colorRgb**: loop over channels and calculate the local RGB value.
4. **preview**: consume the three results in background, text and shadow styles.

The companion stylesheet handles layout, typography and responsive presentation;
it contains no application behavior. The controls live in a separate floating palette, leaving the main preview visible.
Light and dark gallery themes style the surrounding controls; the chosen poster
colors are your own and can intentionally produce poor contrast.

## Reuse it in a project

See the [composition guide](README.md) for `from mywidgets import color_rgb`.
Extract the method into a function accepting a parent Source node, with no `self`.
A different parent `datapath` relocates all its local bindings. Passing the same
context to two instances instead makes them edit the same Data.

The same rule applies to larger blocks: a customer address form, a filter panel or
a summary card can be a function before it needs to become a new component.
