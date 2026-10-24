# Organize behavior in a Logic class

**Sample data:** `03-named_logic_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

A price calculation and a change counter call methods in a `Logic` class. You learn how to reuse named browser behavior instead of repeating inline code. In a Python gallery, open **logic.js** to see those methods.

**Uses:** Local formulas, controllers and named Logic (0.2.0); shared Page/Logic module layout from 0.2.5.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0). The maintained Page/Logic module arrangement is from 0.2.5; it does not move the original behavior into a later release.

**Goal:** Reuse browser behavior by naming a Logic method.

**Before this lesson:** [c01 · Formula](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/01-formula.md), [c02 · Controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/02-controller.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c03 · Named logic** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

The Python Page declares `func="finalPrice"`; `03_named_logic.js` exports the browser `Logic` used by both languages. A formula method takes resolved parameters and returns a value. A controller method receives `(node, kwargs)` and writes Data with `node.SET`.

```python
pane.dataFormula(".final", func="finalPrice", price="^.price", threshold=100, _init=True)
```

`finalPrice` applies 10% off at/above the threshold. In Logic, `this` is the logic group, `this.page` is the browser Gramlot instance, and `this.changes` is local browser state. It is not a server Page field.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python. Read the gallery’s **logic.js** tab (the Logic class from `03_named_logic.js`) beside the Python source.

## Try it and predict the result

1. Initial price 80 produces final 80; the change controller has not yet counted an edit.
2. Replace Price with 120: final becomes 108. The change count advances for each emitted input edit; `_reason` explains the trigger.

## Change it and check yourself

Add a second formula using `func="finalPrice"`, another result path `.other_final`, and `threshold=200`; add a paragraph bound to `.other_final`.

**Answer:** at price 120, the original formula gives 108 and the second gives 120. The same method is reused; only the declarations and threshold differ.

## The same example across stages

**0.2.0 behavior:** move reusable calculations/effects from inline strings to named methods; this removes repeated formula bodies when multiple declarations share one method.

**0.2.5 arrangement:** the same exported `Logic` can live beside `Page` in the page module; Python takes it from its same-name `.js` file. A separate `*_aux.js` is then unnecessary for this page. Do not claim the method body disappeared or that named Logic itself first arrived in 0.2.5.

## Resource exercise: keep styling and Logic with the page

The server already links the shared theme. In your editable project, create
`03_named_logic.css` beside the two page modules and put `h1 { color: teal; }` in it.
Reload the page and inspect its stylesheet requests. **Answer:** the matching
stylesheet is served as a companion and the heading changes without adding a
resource group or browser style-writing code. The Python page already obtains
its root Logic from `03_named_logic.js`. Remove the temporary style afterwards.

This common path covers Page.css, the same-name stylesheet and root Logic.
`css_requires`/`js_requires` and dotted named native-event handlers need the
separate genro-kajenn resource host; FileServer and current adapters do not supply
that host. Do not simulate it by loading scripts in the example.

## Limits and next step

Named Logic works without runtime inline compilation. A root `func` method does not become a named `connect_on` group: dotted event names need a resource group unavailable in the common FileServer gallery. Server-only imports cannot be placed in a module that the browser imports for Logic.

Continue with [c04 · Inline expressions](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/04_inline_expressions.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-060) explains the full contract.

</details>
