# Call the server from a button

**Try this:** Reserve the unavailable item, then try the protected action. The error messages distinguish an application error from missing authentication.

Buttons call endpoints and display errors. You learn how application failure differs from a refused request; both preserve the previous result. The later **0.2.15** section compares protected Source with merely hidden content. This gallery demonstrates anonymous refusal; the Kajenn guide covers authenticated access.

**Uses:** Button-triggered `dataRpc` and endpoint authorization (0.2.14); Source authorization in the later part (0.2.15).

<details>
<summary>More detail</summary>

**Goal:** Compare application failure and default-deny authorization on the same button pattern.

**Before this lesson:** [c06 · Button controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/02-actions/01-button_controller.md), [c09 · Endpoint](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/01-server_calls/01-endpoint.md), [c10 · Call on change](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/01-server_calls/02-call_on_change.md).

## Read the page

A nested `dataRpc` is the button’s click mechanism. Reserve deliberately raises; Cancel is protected by `auth="admin"`. `_onError` writes error code/message to Data. A failed call does not overwrite `.reserved`.

```python
reserve.dataRpc("reserve", result_path=".reserved", item="=.item", _onError=SHOW_ERROR)
```

`error.remoteName` is the class name of the exception the server raised: `OutOfStock` in both twins. The page shows `error.code` and `error.message`.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Endpoint/fragment methods execute there too; bindings and any Logic execute in the browser. A Worker is not a private server.

## Try it and predict the result

1. Reserve Lamp: expect `application_error: Lamp is out of stock`; Reserved stays empty.
2. Cancel in the ordinary anonymous gallery: expect `not_authenticated`; Reserved remains empty and the protected method does not run.

## Change it and check yourself

Add `stock.reserved` with value `"unchanged"` to `03-call_on_click_data.tytx` and repeat both failures.

**Answer:** the existing value remains unchanged; a failed call is not a successful null/false result. The error display changes instead.

## The same example across stages

c06 nested a local controller in a button. This 0.2.14 stage nests `dataRpc` instead: dispatch and result/error plumbing belong to the provider. You do not write a local controller solely to construct an HTTP request.

At the end of the 0.2.14 endpoint stage, return to [c08 · End-to-end story](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/04-complete_examples/01-end_to_end.md) for its separately labelled quote/result/error extension before continuing below.

## Later stage: Source authorization (0.2.15)

Keep the 0.2.14 endpoint trial above. The added section demonstrates a later capability on the same page: `auth="admin"` removes a protected paragraph from the returned Source when the environment has no authorized identity. The hidden paragraph remains in Source and DOM with `hidden=True`.

On the common FileServer, inspect the main Source response and the DOM. Expect no `protected-source` node and no “Source-auth marker”; expect `hidden-source` to exist despite being invisible. Exercise: in your editable copy remove only the protected paragraph's `auth` attribute. **Answer:** it is now delivered and visible. Restore the rule after the trial. Hiding a node does not protect its content.

Authenticated allow/deny and a subsequent anonymous request belong to the [Kajenn authentication walkthrough](https://github.com/gramlot-org/gramlot-py-server/blob/main/docs/505-kajenn.md#gp-505-030), using its existing site identity integration. The walkthrough checks anonymous, refused, allowed and anonymous-again requests; the common gallery does not implement a login system.

## Limits and next step

An identity-aware adapter can produce different auth outcomes according to the user’s tags. This page demonstrates default refusal, not login or an authenticated allow/deny matrix. The separately labelled 0.2.15 section demonstrates Source omission; the endpoint buttons remain the earlier 0.2.14 step. Without `_onError`, failures reach the console.

Continue with [c12 · Remote](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/02-remote_data/01-remote.md). The [server calls guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/098-server-calls.md#gc-095-100) explains the full contract.

**Sample data:** `03-call_on_click_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
