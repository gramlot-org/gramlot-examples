# 08 · Freeze

`renderer.freeze(node)` suspends the DOM work of a branch; `renderer.unfreeze(node)` resumes it and builds the current Source of the branch once.

The four buttons call methods of the companion `08_freeze_aux.js`, through a `dataController` nested in each button.

- While the board is frozen, **Add one** still changes the counter: the elements already built keep following the Data.
- **Remove last item** removes a Source node at once, but its `<li>` stays on screen until the thaw.
- **Thaw** builds the branch once, with every removal applied.

**Try it:** Freeze, remove two items, add one, then thaw.
