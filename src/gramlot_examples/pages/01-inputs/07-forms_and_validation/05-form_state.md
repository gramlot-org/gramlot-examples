# Form state

A formlet arranges fields. `form=True` gives their Source scope a local form lifecycle.
The nearest form owns the baseline and the registers; relative bindings keep the block reusable.

1. Change **Mario** to **Luigi** and leave the field: **changed**, yellow.
2. Type **Mario** again: **ok**, green. There is no net change to save.
3. Clear Name, or enter amount **-3**: **error**, red. Current Data contains that
   typed value even though it fails validation.
4. Enter **-** as Amount or **not a date** as Date. Source retains the unfinished
   text; Data retains the last typed number/date. Save stays unavailable.
5. Enter code **taken** and leave the field: Save stays blocked during the remote
   check, then the field shows the rejection. An available code clears it.
6. **Save locally** accepts the current valid snapshot. **Restore** restores it
   without recreating controls. Reloading discards this local snapshot.

`this.formState.registers` contains baseline, changes, errors, pending and drafts
Bags on the form Source. A change retains its baseline value, not just the last
keystroke. `formStatus` is a self-topic carrying a derived summary. This example
projects that summary into `ui`, outside `record`, so UI changes are not form edits.

This is a GUI lifecycle example, not database persistence. Undo/redo, nested form
stores and server save acknowledgement belong to later increments.
