# 14 · Data remote

A menu loads when its Data path is read. You learn how `dataRemote` supplies values on demand. The read button copies the value the read returns. After the five-second cache expires, the next read calls again; expiry alone makes no call.

**Uses:** Data binding and an endpoint-backed resolver — core 0.2.16. An in-memory example, not a database service.

<details>
<summary>More detail</summary>


**Release stage:** Remote Source and lazy Data (core 0.2.16), after the 0.2.14 endpoint lessons.

**Goal:** Distinguish resolver installation, first read, response and later refresh.

**Before this lesson:** [c09 · Endpoint](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/06-server_calls/01-endpoint.md), [c10 · Call on change](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/06-server_calls/02-call_on_change.md), [c13 · Cached remote](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/07-remote_data/02-cached_remote.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c14 · Data remote** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

`dataRemote` installs a resolver at `.menu`. Installation alone sends no call: the call happens when the path is read, and the paragraph’s `^.menu` reads it at the start.

```python
pane.dataRemote(".menu", "load_menu", cacheTime=5, table="^.table")
```

`sync` is true by default, as in the legacy. On HTTP the read then waits: a synchronous request returns the answer, and the value is stored at the path without announcing it to the consumers, because the reader already has it. The page is blocked until the answer arrives, and browsers deprecate the synchronous request on the main thread. In a serverless Worker, or with `sync=False`, a read never waits: it returns the stored value (null before the first call), starts the call, and the answer is written at the path and announced to the `^` consumers. The Read current value button calls named Logic: `node.GET('.menu')` reads the path and `node.SET('.read_value', ...)` displays that snapshot. A later answer updates Menu; it does not retroactively change an already copied snapshot. Read `readMenu` in the gallery’s **logic.js** tab (the Logic class from `14_data_remote.js`) beside the Python source.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Endpoint/fragment methods execute there too; bindings and any Logic execute in the browser. A Worker is not a private server.

## Try it and predict the result

1. On opening, the paragraph reads and then shows “Soup, Risotto, Fish”. The read snapshot is empty until you press the button.
2. Press Read current value within five seconds of loading: the snapshot shows the stored menu; no additional call is needed.
3. Choose Drinks: since the old resolver had already called, its replacement calls at once, asynchronously, and Menu becomes “Water, Lemonade, Coffee”. The earlier snapshot stays unchanged until another explicit read.

## Change it and check yourself

To isolate **installation from first read**, temporarily remove the `result.p("^.menu", id="menu")` declaration in your editable copy. Keep the button and `.read_value` display.

**Answer:** opening installs the resolver but does not call `load_menu`. On HTTP the first button press calls synchronously and displays the loaded menu at once. In a Worker, or with `sync=False`, it returns the current empty value and starts a call, and a second press after the response displays the menu. No explicit fetch or await was added to the page.

## The same example across stages

0.2.14’s `dataRpc` explicitly triggers a Page computation and places its result in Data. In 0.2.16, a read of a declared Data path can own that loading through a resolver: you no longer author “if absent or expired, call and store” coordination. The endpoint method remains the same kind of Page method.

This is a variation of server-backed Data, not an automatic replacement for every RPC. Choose dataRpc for a commanded action/error callback, remote for Source content, and dataRemote for read-driven values. The advanced exercises modify this same menu page rather than introducing a parallel request/state system.

## Advanced practice

Start each trial from a reload and inspect only `load_menu` calls in Network on HTTP. In a Worker environment the equivalent calls are messages.

- **Expiry then read (5).** Wait for the first response, then wait more than five seconds without changing anything. Expect no timer-driven call. Press Read current value: on HTTP it calls synchronously and displays the new value; with `sync=False`, or in a Worker, it immediately displays the old value and starts a refresh. Read again within the cache window: no extra call is needed. With `sync=False`, read twice while a deliberately delayed response is pending: only one call is in flight.
- **Zero (0).** In the no-automatic-consumer variant from the exercise above, change `cacheTime=5` to 0. On HTTP every click calls synchronously and displays the fresh result. With `sync=False`, the first click starts a call and returns empty; after it finishes, the next click displays the previous result **and starts another call**. Zero-cache writes do not emit a Data event, so a permanently bound Menu paragraph would not announce the completed response; do not mistake that for failed transport.
- **Once (`None`, JS `null`, or negative).** Repeat reads: one call per installed resolver. Change Table after it has called: the reactive argument replaces the resolver, which calls at once; “once” is not forever across all parameter combinations.
- **Failure.** Change the Drinks option’s authored value to a missing key, reload, first load Dishes, then choose it. Expect a console error while the last successful menu remains. Restore the option. No custom error callback is invented.
- **Condition and lifetime.** In an editable copy, add an enabled checkbox/setter and `enabled="^.enabled", _if="enabled"`. Disabling it removes the resolver and retains the last value; a call already in flight is not cancelled and still writes its own value. Re-enabling after it previously called makes the replacement resolver call at once. Removing the declaration’s owning Source branch or disposing the page aborts the call in flight; an aborted call writes nothing. These conditional declarations use inline code and require the permitted CSP profile.

These are separate advanced trials, not prerequisites for the first menu read. The release sequence continues with future agreed features; the complete-page extension and environment-wide qualification are separate planned work.

## Limits and next step

On HTTP a read with an expired cache waits for the fresh answer; with `sync=False`, or in a Worker, a read is not a promise for it. `cacheTime` uses **seconds**, unlike controller delays in milliseconds. `None` (JS null) or a negative value means once per resolver instance; 0 means every explicit read (with `sync=False`, a read during a call starts no other call). Failures retain the stored value and name the declaration: a synchronous read raises the error to the reader, an asynchronous call reaches the console.

`dataRemote` accepts `_onCalling` (a result `false` makes no call, and a later read tries again), but do not copy dataRpc’s `_onResult` or `_onError` onto it, or use `_init`, `_onBuilt`, `_onStart` there. An auth-aware environment is still needed for protected methods. This in-memory menu is not a database service.

Continue with [setup and release sequence](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md). The [remote content guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/099-remote-content.md#gc-095-105) explains the full contract.

</details>
