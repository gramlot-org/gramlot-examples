# 17 · Data exchange

Edit a record, save it as TYTX, change it again and restore the file. You learn how to save a whole Data Bag with its supported types. JSON/XML exports are for interchange, not Restore TYTX.

The record contains text, numbers, a boolean, a null value and a nested address. The email button previews text only.

**Uses:** Data binding, named Logic and local InOut utilities (0.2.5), with the utility name from 0.2.10. No HTTP service or email delivery.

<details>
<summary>More detail</summary>


**Release stage:** core 0.2.5; the public `gramlot.utl.inout` spelling is from 0.2.10.

**Goal:** Save and restore a typed Data Bag, and distinguish round-trip files from interchange exports.

**Before this lesson:** [b09 · Forms with binding](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/03-forms.md), [c03 · Named logic](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/03-named_logic.md), [c06 · Button controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/02-actions/01-button_controller.md).

**Open and edit:** open this page in your environment's gallery. Read Python first; Python builds Source on the host and named JavaScript Logic runs in the browser. The JavaScript Page is the equivalent host/Worker declaration. The gallery shows source; to change it, copy the page into your editable project following the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md). Read the **logic.js** tab (the Logic class from `17_data_exchange.js`) when using Python. Reload after source edits.

## Read the page

Python initializes one record with strings, a number, a boolean, a null note and a nested address. Three fields are editable.

Each Python button declares one named method, for example:

```python
actions.button("Save TYTX", type="button").dataController(func="save")
```

Its Logic calls `this.page.utl.inout.save('exchange.record', 'registration.tytx.json')`. Restore opens the framework's file picker and waits for `restore(...)`; after it resolves, the fields follow the replaced Bag. Errors are written to the status. The application authors no file input, Blob, request envelope or DOM listener.

## Try it and predict the result

1. Press Inspect types: expect string, number, boolean, null, and city Rome.
2. Edit Name to Grace and leave the field; set Seats to 3. Press Save TYTX and retain the downloaded file.
3. Change Name again, then Restore TYTX and select that saved file: Name returns to Grace, Seats to 3, and Inspect still reports number, boolean and null for their respective fields.
4. Export JSON and Export XML: inspect these files as interchange data, not as a Gramlot restore file. JSON is Bag’s list of `label`/`value`/`attr` nodes, not the plain-object JSON used by `sendHttp`; XML has a `record` root. Try restoring exported JSON; expect an error and the existing record to remain intact.
5. Preview email text: inspect the leaf values, including the nested `address.city` line. This button only renders `mailText`; it does not open a mail program.

## Change it and check yourself

Add `"department": "Research"` to the initial Python record and a bound paragraph `form.p("^.department")` (the JS equivalent belongs in its object and Source).

**Answer:** Save/Restore includes the new field without another serialization handler, because the utility operates on the whole Bag. Reloading resets the authored defaults; restoring reintroduces the saved values.

Advanced transport study: `sendMail(path, email)` opens the user's mail program and has a 2000-character limit; it does not itself submit an email. `sendHttp(path, url)` posts JSON and rejects non-2xx responses; it is not a page endpoint call. Exercise these only with an explicitly chosen mail action or an environment-owned local receiving fixture. The common gallery supplies no HTTP receiver. The core's `inout.test.js` and `scripts/verify_inout_browser.mjs` show intercepted mail links and local HTTP checks; they are verification fixtures, not application networking code to copy. No real messages or external service requests are part of this trial.

## The same example across stages

b09 made a form share one Data record with its display. This later release lets the same record cross the file boundary: two utility calls replace bespoke serialization, file-choice and restore coordination. Earlier form examples remain valid without file operations. The next release stage introduces endpoints; a download is not server persistence.

## Limits and next step

**Scope of this lesson:** this example uses strings, numbers, booleans, null and nested Bags. Dates and decimals are deferred while [Bag issue #69](https://github.com/genro-org/genro-bag/issues/69) addresses typed object initialization in JavaScript and Python/JS API consistency. The owner accepted this reduced scope for now. The verified defect affects object initialization; it does not establish a failure of TYTX Save/Restore. No alternate initialization path is needed for this lesson.

TYTX Save/Restore preserves supported types. JSON/XML exports are for other programs; the `.json` suffix alone does not make a file restorable. File dialogs require a user gesture. If you cancel a picker, the existing Data remains; start a new Restore action when ready. Browser download settings may prompt or save automatically. Named Logic handles these actions without an inline-code CSP requirement. The catalogue entry is a local file lesson; mail and HTTP environment checks are separately classified.

Continue with [c09 · Endpoint](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/09_endpoint.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md#gc-095-095) provides the full contract.

</details>
