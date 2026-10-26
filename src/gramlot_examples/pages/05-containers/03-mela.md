# Compare desktop and touch themes

**Try this:** Compare the theme previews, open a menu and edit a field. Open dialog and floating windows to compare modality while keeping the same controls.

Choose **Mela** under Gallery Settings → Theme and **Theme default** under Colors.
Mela uses Apple-inspired neutral surfaces, system typography and blue accents.
It is a web theme, not a native macOS/iOS implementation or an Apple asset pack.

On desktop, fields use a compact 28px minimum height. On narrow screens or coarse
pointers, fields and command targets grow to 44px and editable text uses 16px.
Light and dark modes are independent of the density. Other color palettes can
still override the colors without replacing Mela's spacing.

The frame contains a toolbar, a hierarchical Document menu and bound fields.
The dialog blocks interaction with the background; the floating does not.
Both share the same draft through Data bindings. “Save draft” only updates the
local status; it does not send data to a server. Export options demonstrate a
submenu and a disabled item, not actual file export.

Resize, maximize or close the windows, change the gallery theme and return:
the document title should remain. No custom DOM construction is used.
