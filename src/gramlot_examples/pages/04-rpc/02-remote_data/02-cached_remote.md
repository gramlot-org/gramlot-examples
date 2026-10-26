# Cache remote fragments

**Try this:** Switch from Lamp to Spotlight, then to Chair. The first two share a category, so the mounted-fragment counter stays unchanged until Chair.

Revisit **Remote** with caching. Request the same content again and watch the mounted-fragment counter: you learn how unchanged inputs can reuse the current fragment. The counter measures mounts, not network calls.

**Uses:** Data binding and cached remote Source. The request rule and the readiness condition `_if` are those of the current core.

<details>
<summary>More detail</summary>

**Goal:** Reuse the last mounted fragment when the relevant inputs stay the same.

**Before this lesson:** [b02 · Variable datapath](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/02-variable_datapath.md), [c12 · Remote](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/02-remote_data/01-remote.md).

## Read the page

The product card uses b02’s variable datapath. The fragment depends on **category**, not product name: Lamp and Spotlight are both lighting. `_onRemote` runs after a successful mount.

```python
rules.remote("rules", category="^.category", _cachedRemote=True, _onRemote=ON_REMOTE)
```

**Mounted fragments** counts successful mounts, not requests sent. A failed request sends traffic without incrementing it, and a request skipped by `_cachedRemote` sends none. To verify a skipped HTTP call, inspect Network envelopes with `contentType: "source"` and `name: "rules"`; do not count bootstrap/main. Standalone uses Worker messages instead.

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

`_cachedRemote` compares the method name and the **TYTX snapshot of the parameters, taken when the request is made**, with the request in flight; when none is in flight, with the fragment mounted last. A failure does not replace that record; a fragment mounted from code with `gramlot.src.remoteSource` does. Mutating a Bag/object in place can change the next snapshot even though its object identity stays the same. Reordering object keys may produce a different snapshot and an extra call; no order-insensitive normalization is promised.

## Advanced practice

Run these separately after the basic trial. Reload between source edits so each trial has a known starting state.

1. **Delayed A → B → A.** Let Lamp/lighting (A) finish mounting. Slow responses in the HTTP environment, choose Chair/seating (B), then Lamp before B finishes. Expected: the request in flight is never cancelled, so B’s answer mounts the seating rules (mounts 2) although Lamp is selected. The change back to Lamp waits while B is in flight and is sent when B answers; `_cachedRemote` does not skip it, because when it was made it differed from B, the request in flight. Its answer mounts the lighting rules (mounts 3), and the content ends matching the Data. Until then the page shows B’s rules next to Lamp. Observe the three `rules` requests in Network: the counter alone does not show their order.
2. **Mutable parameters.** Add an input with `value="^context.revision", default=1`, and `context="=context"` to the remote declaration. After Lamp mounts, change revision to 2 and leave the field, then choose Spotlight. Expected: the `=` parameter alone is not a trigger, but the subsequent context switch reads the modified Bag and sends a new rules call. The fragment method already ignores unused keyword/object fields; the visible text stays the same and mounts become 2. This is a snapshot comparison, not a same-object comparison.

For `_if`, add a boolean Data checkbox and `enabled="^enabled", _if="enabled"` to the declaration in a separate copy. `_if` is a readiness condition: after one mount, disabling it makes no request, cancels nothing and leaves the content as it is; enable it to resume. `_else` would run as inline code while the condition is false. Test request lifetime through observation, not by adding networking or cache state to the application.

## Limits and next step

`_onRemote` and conditional code require the inline CSP profile. A false `_if` makes no request, cancels nothing and can run `_else`. This lesson keeps the method name fixed: `remote("rules", category="^.category", ...)` varies the category while always calling `rules`. The name can also be a pointer such as `remote("^method", ...)`: the method is then read from Data and a reader of the Source no longer sees which method runs. An empty or null name rejects the request with an error, so write `_if` to make no request while no method is chosen. Live Source-attribute-mutation semantics remain outside this lesson.

Continue with [c14 · Data remote](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/02-remote_data/03-data_remote.md). The [remote content guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/099-remote-content.md#gc-095-105) explains the full contract.

**Sample data:** `02-cached_remote_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
