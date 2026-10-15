# 13 · Cached remote

Revisit **Remote** with caching. Request the same content again and watch the mounted-fragment counter: you learn how unchanged inputs can reuse the current fragment. The counter measures mounts, not network calls.

**Uses:** Data binding and cached remote Source — core 0.2.16. Advanced cache/lifetime trials need a qualified runtime.

<details>
<summary>More detail</summary>


**Release stage:** Remote Source and lazy Data (core 0.2.16), after the 0.2.14 endpoint lessons.

**Goal:** Reuse the last mounted fragment when the relevant inputs stay the same.

**Before this lesson:** [b02 · Variable datapath](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/02_variable_datapath.md), [c12 · Remote](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/12_remote.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c13 · Cached remote** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

## Read the page

The product card uses b02’s variable datapath. The fragment depends on **category**, not product name: Lamp and Spotlight are both lighting. `_onRemote` runs after a successful mount.

```python
rules.remote("rules", category="^.category", _cachedRemote=True, _onRemote=ON_REMOTE)
```

**Mounted fragments** counts successful mounts, not requests sent. A pending, failed or cancelled call may send traffic without incrementing it. To verify a skipped HTTP call, inspect Network envelopes with `contentType: "source"` and `name: "rules"`; do not count bootstrap/main. Standalone uses Worker messages instead.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Endpoint/fragment methods execute there too; bindings and any Logic execute in the browser. A Worker is not a private server.

## Try it and predict the result

1. Wait for Lamp’s lighting rules: Mounted fragments = 1.
2. Choose Spotlight: the product name changes, rules stay the same, mounts remain 1, and no additional rules call should be sent.
3. Choose Chair and wait: mounts become 2 and seating rules appear. Return to Lamp and wait: mounts become 3. This is one last-result cache, not a dictionary retaining all categories.

## Change it and check yourself

Remove only `_cachedRemote=True` from the declaration, reload, wait for Lamp, then choose Spotlight.

**Answer:** the same visible rules are requested/mounted again and the count becomes 2. Restore the attribute afterwards. Compare transport observations separately from the mount count.

## The same example across stages

c12 declared reactive Source replacement. Here one `_cachedRemote=True` declaration removes the need for page code to remember which inputs produced the currently displayed fragment and decide whether to call again. Product context may change while the fragment’s relevant inputs remain equal.

The corrected identity is the method name plus the **TYTX snapshot of parameters at dispatch of the last successfully mounted response**. Failure does not replace that identity. Mutating a Bag/object in place can change the next snapshot even though its object identity stays the same. Reordering object keys may produce a different snapshot and an extra call; no order-insensitive normalization is promised.

## Advanced practice

**Release history:** core 0.2.17 includes the corrected cache identity and cancellation behavior. Update an older runtime before trying these advanced cases.

Run these separately after the basic trial, using that core cache correction. Reload between source edits so each trial has a known starting state.

1. **Delayed A → B → A.** Let Lamp/lighting (A) finish mounting. Slow responses in the HTTP environment, choose Chair/seating (B), then Lamp before B finishes. Expected: B’s pending call is cancelled/superseded; the already mounted lighting fragment remains; mounts stay 1. A cache hit must not allow a late B response to overwrite A. Observe the B request independently: the mount counter alone cannot establish cancellation.
2. **Mutable parameters.** Add `pane.dataSetter("context", {"revision": 1})`, an input bound to `^context.revision`, and `context="=context"` to the remote declaration. After Lamp mounts, change revision to 2 and leave the field, then choose Spotlight. Expected: the `=` parameter alone is not a trigger, but the subsequent context switch reads the modified Bag and sends a new rules call. The fragment method already ignores unused keyword/object fields; the visible text stays the same and mounts become 2. This is a snapshot comparison, not a same-object comparison.

For `_if`, add a boolean Data checkbox and `enabled="^enabled", _if="enabled"` to the declaration in a separate copy. After one mount, disabling it retains the content and suppresses new calls; enable it to resume. Test request lifetime through observation, not by adding networking or cache state to the application.

## Limits and next step

`_onRemote` and conditional code require the inline CSP profile. A false `_if` suppresses the call and can run `_else`; it also cancels a pending request. The method name is fixed: `remote("rules", category="^.category", ...)` varies the category while always calling `rules`. A Data pointer such as `remote("^method", ...)` is outside the contract and is correctly rejected during Source construction. A variable method would require a future explicit owner decision; it is not a missing exercise or capability to enable. Live Source-attribute-mutation semantics remain outside this lesson.


Continue with [c14 · Data remote](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/14_data_remote.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
