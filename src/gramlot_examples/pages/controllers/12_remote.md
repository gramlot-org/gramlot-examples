# 12 · Remote

A choice loads a page fragment built by the host. You learn when to request structure with `remote` rather than a value with `dataRpc`. The fragment method stays fixed; its parameters can change.

**Uses:** Data binding and declarative remote Source — core 0.2.16.

<details>
<summary>More detail</summary>


**Release stage:** Remote Source and lazy Data (core 0.2.16), after the 0.2.14 endpoint lessons.

**Goal:** Choose Source replacement when the server owns the content structure.

**Before this lesson:** [c09 · Endpoint](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/09_endpoint.md), [c11 · Call on click](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/11_call_on_click.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c12 · Remote** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

The select writes `.record_id`. `remote` belongs to the details element, and its prefixed parameter follows that value. Python `@source` / JS `Page.registerSource('details')` declares a fragment method that populates a root.

```python
details = pane.section("Waiting for the server", class_="card stack", id="details")
details.remote("details", record_id="^.record_id")
```

The fragment contains a heading and stock paragraph. It replaces the element’s **content**, not the containing section. Earlier content remains while a replacement is pending.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Endpoint/fragment methods execute there too; bindings and any Logic execute in the browser. A Worker is not a private server.

## Try it and predict the result

1. After the first response expect Lamp and “3 in stock”.
2. Choose Chair: expect Chair and “12 in stock”. Choose Desk: expect “0 in stock”.
3. On HTTP inspect `contentType: "source"`, `name: "details"`; no application fetch or DOM insertion code is present.

## Change it and check yourself

Change Chair’s stock in `RECORDS` from 12 to 7 and reload, then select Chair.

**Answer:** the returned fragment says “7 in stock”. Altering the source constant requires host reload; it is not an editable shared database.

## The same example across stages

In 0.2.14, `dataRpc` brought a value into a predeclared display. In 0.2.16, `remote` can ask the Page to construct that display’s content. It removes explicit fragment-request/mount coordination from page code. It is not automatically shorter for every problem: keep `dataRpc` for a value when the client already owns the structure.

## Advanced practice

After the basic trial, select an invalid record by editing an option’s value in your **source file** and reloading. First mount a valid record, then choose the invalid one. Expect the prior content to remain and a console failure. Restore the option afterwards. Do not invent an error callback on remote or reinterpret an empty method name: that lifecycle question remains undecided.

For nested fragments, the owning method can declare another `.remote(...)` in the returned Source. Each fragment has its own lifetime; this page does not claim to be a complete nested-fragment exercise.

## Limits and next step

A fragment is typed Source, not an endpoint returning HTML text. New requests supersede previous ones; removing the owning element cancels its request. A failure retains already mounted content and is reported to the console; remote has no dataRpc-style `_onError` callback.

Continue with [c13 · Cached remote](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/13_cached_remote.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
