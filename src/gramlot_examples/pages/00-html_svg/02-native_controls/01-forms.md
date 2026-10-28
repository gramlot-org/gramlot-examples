# Native form controls

**Try this:** Fill a few native controls, then reset the form. These are browser controls; this lesson deliberately has no Data bindings.

A form with text fields, choices and a Reset button. Change the values and reset them to see what native HTML controls already do on their own. Later, **Forms with binding** revisits this form and connects its fields to shared Data.

**Uses:** Source and native HTML controls. No Data binding or controllers.

<details>
<summary>More detail</summary>

**Goal:** Understand native editing and Reset before adding Data binding.

**Before this lesson:** [e04 · Semantic page](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/04-semantic_page.md). 

## Read the page

The `field` helper declares a label and input. `html_label` selects the HTML element without confusing it with the Source node’s label. Initial values belong to HTML attributes/content in this stage.

```python
self.field(identity, "Name", "name", "text", value="Ada Lovelace", required=True)
options.input(type="checkbox", id="updates", name="updates", checked=True)
```

The select marks its initial option with `selected`; the textarea has literal content.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Change Name and uncheck Receive updates. The controls change natively; there is no Data record display.
2. Click Reset values: Name returns to Ada Lovelace and Receive updates is checked. Submit stays disabled.

## Change it and check yourself

Change the Name default to `"Grace Hopper"`, reload, type another name, then Reset.

**Answer:** Reset now restores Grace Hopper, because that is the new native default. It does not call an endpoint or restore a Gramlot Data Bag.

## The same example across stages

Continue with [b09 · Forms with binding](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/03-forms.md). The same fieldsets move their defaults into one Data record and replace literal values/checked/selected flags with pointers. The control and the record display share that state; no separate display-update handler is authored. The bound version adds a capability, so the whole file is not claimed to be shorter. Keep this native Reset example as the earlier stage.

For a direct comparison with Gramlot widgets, open [HTML and components](../../01-inputs/01-text/01-textbox.md). Both support bindings and labelbox styling; the component interface adds dedicated behavior.

## Limits and next step

File selection remains native. No persistence, upload, save endpoint or record/form framework is provided. Reset is safe here because there are no Data bindings.

Continue with [e07 · Native disclosure](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/02-native_controls/02-native_disclosure.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
