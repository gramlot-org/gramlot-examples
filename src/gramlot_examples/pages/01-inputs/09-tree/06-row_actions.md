# Tree row actions

Select **Notes**, then move the pointer to **Checklist** without clicking its
caption. The tree moves its shared action bar to Checklist. Press its checkmark
button. The acted-on path becomes `checklist`, while the selected path remains
`notes`. The bar also follows the focused row when navigating with the keyboard.

Move to **Archive**. Its `actionMode` attribute hides the inspect button, while **More**
remains available. Open the dropdown and choose **Record row path**. The report
now shows `archive` and still shows `notes` as the selection.

With the keyboard, Tab into the tree and use Up or Down to focus a row.
Press Tab to reach its available actions, then Enter to activate one.

The tree accepts one `rowActions` child. Here it contains a button and a
dropdown. The named `actionState` method receives `{item, path, action, state}`
for each control with a `rowAction` code and returns `{hidden, icon, title}`
synchronously. The action and menu controller receive the row's `item` and
`path` from the bar. Their only effect is updating the page report.
