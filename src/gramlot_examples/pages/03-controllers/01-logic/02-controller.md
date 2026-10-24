# 02 · Controller

**Sample data:** `02-controller_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

A controller reacts to Data changes and writes other values. You learn when to use a controller for an action rather than a formula for a result. Its path filter distinguishes where a change occurred, not who made it.

**Uses:** Data binding and local controllers — core 0.2.0.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Choose a controller for an effect and identify its trigger.

**Before this lesson:** [c01 · Formula](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/01-formula.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c02 · Controller** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

## Read the page

A `dataController` runs code for effects. In inline code, `this` is its Source node; `this.SET` writes relative Data. The first controller writes `.invalid`, whose pointer controls the warning.

```python
check.dataController("this.SET('.invalid', !name.trim())", name="^.name", _init=True)
```

The request button fires a Data path, not an HTTP request. The search controller waits 400 ms after the last edit. The clock runs at `_onStart` and repeats every `_timing` seconds; 0 disables repetition.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Clear Name: the warning appears; type Ada: it disappears.
2. Press Send a request twice: the local counter becomes 2, without a server call.
3. Type a search quickly and pause: “Searching for …” appears after the debounce. Set Interval to 0: subsequent periodic ticks stop.

## Change it and check yourself

Change `_delay=400` to `_delay=800`, reload and type another query.

**Answer:** the last text appears after about 800 ms of quiet, once; no real search service is contacted. Timing is approximate browser scheduling, not a precision clock.

## The same example across stages

e13 uses the same `_timing` on a controller to move an SVG circle through Source attributes. For a repeated controller effect, the provider owns timer cleanup, so the page authors no timer handle and no `clearInterval`. Here the controller writes Data; e13’s controller writes Source attributes.


## Advanced: filter the changed path (0.2.0)

The optional section uses named Logic from `02_controller.js`. Two controllers watch `.filter.name`, and two watch the Bag `.filter.address`; each pair differs only in `_userChanges`. Start from a reload: all counters are zero.

1. Edit Tracked name, then leave the field: name_exact/name_all become 1/1.
2. Press SET the name: both become 2/2. Programmatic writes to the exact path qualify too.
3. Replace containing Bag: name_all becomes 3 and address_all becomes 1, while the exact counters stay 2 and 0.
4. Change address child: address_all becomes 2; address_exact stays 0 because `.filter.address.city` lies below the watched `.filter.address`.

Exercise: change `_userChanges=True` to False on an exact watcher, reload and repeat. **Answer:** that watcher now accepts container/child events as its paired unfiltered watcher does. The flag is not a human-versus-code detector. The Data Bag copy used for replacement is still ordinary Data, not a parallel state store.

## Limits and next step

`requests` in this page counts fired local events. The advanced `_userChanges` counters are separate from `requests`: they filter exact-path changes, including programmatic writes, not human versus code identity.

Continue with [c03 · Named logic](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/03_named_logic.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-055) explains the full contract.

</details>
