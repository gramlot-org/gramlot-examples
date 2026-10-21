# 20 · Actions, confirmations and references

The same greeting runs immediately, after a question, or after collecting a name. Switch **Ask before running** off and on to see when the question appears. Then pass a paragraph to a controller as a Source reference or as a DOM reference.

**Uses:** Source, Data, buttons, inline actions, named controllers, native ask and local references — core 0.2.18. No endpoints or cross-frame references. This revisits the earlier button lesson with the 0.2.18 additions.

**Try it:** choose **Ask for a name**, enter Grace and confirm. The result becomes Hello Grace; Cancel keeps the old result. Turn the checkbox off: both conditional buttons run immediately. Turn it on: they wait for confirmation. **Conditional fields** applies the same choice to a dialog with a field.

<details>
<summary>More detail</summary>

`action` is a small JavaScript expression on the button. `ask` belongs to that action; `_ask` belongs to its nested controller. The string forms use `_ask_if`. The dictionary form uses `_if` to skip the dialog when false. These inline conditions/actions require the gallery's permissive CSP; named controller methods remain the usual choice for reusable behavior.

Legacy `askIf` is not the skip condition: `askIf="false"` alone still asks. The dedicated button demonstrates this difference. Modifier-based `askOn`/`skipOn` are not supported. Use `_ask_if`, or dictionary `_if`, when a false condition must run without asking.

Python passes `target=target` to obtain the live Source node. Its controller changes the paragraph through Source. `target.builder.reference(target, kind="dom")` explicitly requests the rendered element; the second controller reads its tag name. JavaScript spells this `reference(target, 'dom')`. Neither requires an application ID lookup. These references remain local to the page and cannot be sent as RPC or interframe payloads.

**Exercise:** change the initial name to Linus and turn the checkbox off. **Result:** the conditional controls use Linus without opening a dialog; no field collection has taken place.

</details>
