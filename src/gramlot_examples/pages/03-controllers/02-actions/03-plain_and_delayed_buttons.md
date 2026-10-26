# Run immediate and delayed button actions

**Try this:** Click a delayed button several times quickly, then wait. Compare its single grouped execution with the immediate action and native form reset.

Reset an ordinary HTML form, then compare the same Gramlot action with and without a delay. Several quick clicks become one execution, with the size of the group displayed below.

**Uses:** Source, Data and button actions/controllers; core 0.2.19 additions: `html_button` and button `_delay`. No Web Components or endpoint calls. Earlier lessons keep their original release scope.

**Try it:** edit Native value and press Native reset. Click Immediate action twice: Executions increases twice. Click Delayed action three times quickly: after 600 ms from the last click, Executions increases once and Clicks shows 3. A new group starts again from 1. Delayed controller does the same with a named method. Delayed confirmation opens one question after the group; Cancel does not run the action.

<details>
<summary>More detail</summary>

`html_button` renders a native `<button>` with no implicit type or Gramlot click mechanism. Here `type="reset"` lets the browser reset an unbound field. Use `type="button"` for a plain button that must not submit a form; explicit events use `connect_onclick`. `action`, `ask`, `fire` and `_delay` belong to `button`, not `html_button`.

Both immediate and delayed buttons render as `<button>`. The delayed example adds only `_delay=600`; the action stays the same. Every click restarts the timer. The last event supplies modifiers, and the delayed action reads its arguments when it runs. `_counter` is the group count; a nested controller receives it as `button_counter`. Without delay, the existing counter counts the button's whole lifetime.

A container can supply inherited `_delay`; an explicit zero on a button makes it immediate. Button delay precedes action, ask, fire and the nested provider. A controller's own `_delay` separately delays its Data/subscription triggers. Explicit native event listeners still run on each click. Removing the button or closing its page cancels pending work. The old legacy 200 ms disabled guard for immediate clicks is not introduced.

**Exercise:** change only `_delay` from 600 to 1200. **Result:** the last click postpones the same action for 1.2 seconds; the action and its count logic do not change.

**Sample data:** `03-plain_and_delayed_buttons_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
