# Floating: keep the page usable

**Try this:** Open the floating window, then use the background counter. Both remain usable. Edit the title and watch the page update; close and reopen to keep the same draft.

1. Open the floating and edit **Title**. The page and window bind to the same `workspace.title`.
2. Try **Uppercase title** in the top toolbar. It writes Data; bindings update both views.
3. Move, resize, collapse or maximize the window, then restore it. The floating is nonmodal: the background counter remains usable, even while you edit or collapse the window.
4. Close with **Done** or × and reopen. Closing changes `workspace.open`; it keeps the Source and draft.

The sample data comes from `05-floating_data.tytx`. The companion Bag also initializes the demonstration counter to zero. The counter display uses `"^.clicks"` with `mask="Background clicks: {}"`; pointer expressions belong to attributes, not node text. Clicking the button writes only local Data. There is no save operation or server persistence in this teaching example.

The window exposes `window.frame.top`, `.center` and `.bottom`: a toolbar above, a formlet in the center and a right-aligned Done command below. All remain the same components throughout window operations.

Movement, resize and collapse are enabled by default for floatingPane; maximize is explicitly enabled here.


**Three toolbar regions:** the window owns one `framePane`. Its left region holds a vertical icon toolbar, its top region holds the main toolbar and its bottom region holds the closing or Save/Cancel actions. The center keeps the editable fields. Try a left-hand command and watch the same Data update in the center; toolbar direction changes presentation, not command ownership.
