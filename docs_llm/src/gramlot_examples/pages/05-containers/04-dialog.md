# Dialog: modal editing

**Try this:** Open the dialog and try the background counter: it is blocked until you close the dialog. Edit the title, close and reopen: the draft is retained.

1. Open the dialog and edit **Title**. The page and window bind to the same `workspace.title`.
2. Try **Uppercase title** in the top toolbar. It writes Data; bindings update both views.
3. Move, resize, collapse or maximize the window, then restore it. The dialog stays modal even when collapsed. The background counter cannot be used until you close it.
4. Close with **Done** or × and reopen. Closing changes `workspace.open`; it keeps the Source and draft.

The sample data comes from `04-dialog_data.tytx`. The companion Bag also initializes the demonstration counter to zero. The counter display uses `"^.clicks"` with `mask="Background clicks: {}"`; pointer expressions belong to attributes, not node text. Clicking the button writes only local Data. There is no save operation or server persistence in this teaching example.

The window exposes `window.frame.top`, `.center` and `.bottom`: a toolbar above, a formlet in the center and a right-aligned Done command below. All remain the same components throughout window operations.

Movement, resize, collapse and maximize are explicitly enabled here; dialog defaults remain off.


**Three toolbar regions:** the window owns one `framePane`. Its left region holds a vertical icon toolbar, its top region holds the main toolbar and its bottom region holds the closing or Save/Cancel actions. The center keeps the editable fields. Try a left-hand command and watch the same Data update in the center; toolbar direction changes presentation, not command ownership.
