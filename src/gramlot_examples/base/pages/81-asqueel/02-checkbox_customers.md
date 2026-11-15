# Multiple customers

Choose a state, then open **Customers** and tick several entries. The popup stays
open, and the paragraph shows their comma-separated keys. Escape closes the popup.

`dbSelect` chooses one state. `checkBoxText` requests **all** customers matching
`condition`, passing the current state through `condition_state`. This is an
Asqueel example: SQL conditions are an Asqueel capability. The service's table
registration and access rules still apply; the browser does not grant access.

The complete list is appropriate for bounded sets of choices, not browsing a
large unrestricted table. There is no remote search or pagination in this control.

Changing state reloads the choices. Existing selected codes are preserved; those
absent from the new options appear as codes in the summary. Clear the selection
explicitly if the application requires clearing on a state change.

`value` contains keys, while its `_dv_displayedValue` attribute holds the captions
currently available. This is the same value contract as the local checkbox group.
For an application endpoint instead of the configured database service, use
`method`: return `{rows, identifier, caption}` for the complete allowed list.
