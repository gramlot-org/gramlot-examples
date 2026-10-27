# FramePane, dialog and floating

`dialog` and `floatingPane` come from the layout collection. `html_dialog` always
means native HTML and remains available for low-level framework uses.

```python
window = root.dialog(title="Editor", open="^editor.open",
                     movable=True, resizable=True, collapsible=True,
                     maximizable=True, maximized="^editor.maximized",
                     beforeClose="beforeClose", width="440px", height="360px")
frame = window.frame
frame.top.menu(presentation="bar").menuline("documenti:save")
frame.center.contentPane(frameTarget=True, selfsubscribe_save="save")
frame.bottom.menu(presentation="bar").menuline(caption="Close", action="closeWindow")
```

The frame is a Source child, with the same five region helpers as a standalone
framePane. Window title controls are separate chrome. Open/collapsed and geometry
can bind to Data; a completed drag/resize writes geometry once. Plain `^` bindings
write back; literal and read-only bindings retain the standard component rules.

Dialog blocks document interaction, even collapsed. Floating is nonmodal. Dialog
movement/resize/collapse default off; floating defaults on. Both start closed and
allow closing. Collapse retains the frame and restores its expanded dimensions.
Close retains the mounted content and drafts; deleting Source disposes the window.

`beforeClose` is a named Logic method called with the window Source and `{reason}`.
It returns bool or Promise<bool>; false vetoes. X, Escape and Source
`requestClose(reason)` use this guard. Setting bound open to false explicitly
bypasses it. Source deletion is teardown. Invalid results/errors keep the window
open with a diagnostic. Duplicate pending close requests are coalesced and stale
completion after close/disposal is ignored. Escape and X respect closable.

Try keyboard movement/resizing using the title/handle and arrows, focus restoration,
Save routing to each frame, close veto, multiple windows and background editing.
A native modal is local to its document; it does not block a containing iframe.
Maximize is opt-in on both components (`maximizable=True`); `maximized` defaults
false and supports two-way binding. □ fills the document viewport, ❐ restores
normal geometry (clamped if the viewport has shrunk). Maximizing suspends move and
resize without changing their authored settings. Collapse is independent: a
collapsed maximized window expands back to viewport size. The dialog stays in the
same modal session through these transitions; floating stays nonmodal. Close/reopen
retains state and content. Geometry bindings continue to describe the normal
rectangle, not the maximized viewport. Disabling maximizable restores normal size.
Persistent geometry across reloads and stable maturity remain outside this trial.

## Read the composition

Both windows call `contents` to build their frame. Open each and try the background controls: modality is the deliberate difference. Then move, resize, collapse and maximize; closing and reopening must retain the page Data.
