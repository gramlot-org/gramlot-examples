<a id="ge-grid-10"></a>
# Editing · drafts and validation

A FrameGrid displays 1,000 resident rows whose values are Bags. It shares a form
session with the batch-name input. The gallery theme controls apply normally.

1. Double-click Quantity and type `-` without completing the number. Scroll away
   and back, then reopen the cell: the draft survives editor disposal.
2. Enter `-3` and confirm with Enter. The invalid typed value stays in working Data
   and the session blocks acceptance. Scrolling does not clear the error. Use `3`
   to correct it.
3. Enter `taken` in Reference and confirm. The read-only validation endpoint waits
   1.5 seconds before rejecting the reference. Scroll during the wait: pending
   becomes error even without an editor. Reopening does not repeat the request.
   Enter `available` and wait for the check to finish.
4. Accept locally establishes a new local snapshot. Restore returns all fields
   and rows to that snapshot. No database save is performed.

The session status is displayed above the grid. Incomplete drafts, pending checks
and errors block local acceptance. Description and the batch name are required.
Notes have variable natural heights up to a 96px content limit and use the ordinary multiline editor.
Data, Source inputs, validation rules and editing state use the shared core;
there is no application-specific scroll, input or validation-state machinery.


The Errors and Changes buttons read this same session. Changes lists outstanding
original → current values, including the batch name; it is not a chronological
history. Select an entry to reveal its cell or focus its form input. Filtered-out
rows are not silently revealed by changing the filter. Reports update when
asynchronous checks finish even while their editors are unmounted.

In a single-line editor, Up/Down moves to the same column in the previous/next
visible row, keeping drafts and errors in the session. Left/Right moves the caret within text; with no selection, Left at the beginning
opens the previous editable cell and Right at the end opens the next, including
filled fields. Shift/Ctrl/Alt/Meta arrows retain the editor behavior.
Tab/Shift+Tab changes editable cells. Notes and choice/date/time controls retain
their own arrow behavior. Try leaving an invalid quantity with Down, scrolling
away and returning through the Errors list.


The first row has a twelve-line delivery note. Its column declares
`white_space='pre-wrap', max_height='96px', edit=dict(tag='textBoxArea')`.
Scroll inside Notes before opening it, then double-click and scroll inside the
textarea: both use the same 96px maximum, while preserving the full text. Make the
row taller with its row-header resize handle: the bounded note/editor remains
96px high. Other rows stay at their natural height. This is core column behavior,
not page-specific CSS or input/scroll event wiring.


Complete check: **Test unopened cell** puts a negative quantity in row 801 without
opening it. Click **Accept locally**: validation covers all 1,000 rows, reports
that cell, and refuses acceptance. Select the error to open and correct the cell,
then confirm again. The normal grid filter does not narrow validation coverage.

The named Logic handler awaits `formState.validate()` before `accept()`. Checks
use the shared session and declared input policies; no editor is constructed for
unopened cells. The demo endpoint delays the reserved value `taken` by 1.5 seconds;
other values return immediately so a complete scan remains practical. All applicable
rows are checked remotely; this is not a result cache or a DB save.
