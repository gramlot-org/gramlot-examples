# 3. Reactive checked, disabled and hidden

The same Python method populates the popup and the toolbar. Both bind to the same
Data paths, so the checkboxes above them update both presentations immediately.

```python
menu.menuline("documenti:save", disabled="^document.locked")
menu.menuline("documenti:toggleDetails", checked="^document.details")
menu.menuline("documenti:export", hidden="^document.hidden")
```

Try **Disable Save**, open Document and verify that Save is unavailable there too.
Try **Hide Export**: the entry disappears from both presentations. Hidden and
disabled entries are skipped by menu keyboard navigation.

Click Details in either presentation, or change Show details directly. The check
mark follows Data. A checked command never toggles Data by itself: its registered
message reaches the central handler, which writes the new value using `node.SET`.
The visible details paragraph uses the existing boolean expression suffix:
`hidden="^document.details:=!{}"`.

Use the Python tab for the bindings and the logic.js tab for the state change.
No resolver reload is needed to update these states.
