# Bind values with absolute and relative paths

**Try this:** Compare the same value through an absolute path, a relative path and an anchor. Edit a field and watch only the views bound to that path change.

Fields and text share the same values. Edit a field and see which text follows it. You learn the difference between `^` (keep following) and `=` (read without subscribing), and how a Data path locates a value.

**Uses:** Source, Data, pointers and native binding. No endpoint calls.

<details>
<summary>More detail</summary>

**Goal:** Resolve Data paths and predict which texts follow an edit.

**Before this lesson:** [e01 · Hello World](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/01-html_basics/01-hello_world.md), [e06 · Forms](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/00-html_svg/02-native_controls/01-forms.md).

## Read the page

`^` reads and subscribes; `=` reads without subscribing. `datapath="settings"` makes `.caption` relative to `settings`. The same-name `_data.tytx` companion initializes the sample Data before the first display.

```python
settings.input(value="^.caption", id="caption-field")
settings.p("=.caption", id="first-caption")
```

The heading uses absolute `^settings.caption`. `#settings.caption` uses the context of the Source node with `nodeId="settings"`; `#FORM.name` uses the nearest form context. `.name?role` reads a Data **attribute**, not a DOM attribute.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Initially expect “Pointers”, Ada Lovelace and Mathematician.
2. Type “My caption” and **leave the field**: the heading and symbolic reference change, but the `=` paragraph still says “Pointers”.
3. Change Role to Writer and leave the field: the role display changes; the person’s name does not.

## Change it and check yourself

Change only the paragraph from `"=.caption"` to `"^.caption"` and reload; edit the caption again.

**Answer:** now it follows too. The one-character change adds a subscription, not another event handler. A `=` argument of a controller is different: it is read at each controller run, without triggering that run.

## The same example across stages

Earlier e01 rendered a literal heading. Here the declaration is `pane.h1("^settings.caption")` plus initialized Data. On an edit, no authored Source lookup/`setValue` is needed: the pointer provides that connection. Initial state and runtime behavior are now separate.

## Advanced: the same name from different origins (0.2.0)

The added section has an `_anchor` at Data context `contexts`, then a child with `.child`. Read the three paragraphs: the local `.name` reads Inner; `#ANCHOR.name` reads Outer. `^.#parent.name` starts from the resolved local Data context `contexts.child`, cancels its last segment and reads Outer. `#parent` is a Data-path segment, not a Source-node lookup. A bare leading `^#parent.name` is not the declaration used here.

Change `contexts.name` to Outside in `01-pointers_data.tytx` and reload. **Answer:** the anchor and parent-path paragraphs change; the local read stays Inner. Now change `contexts.child.name`: only the local paragraph changes. The `nodeId`, HTML `id`, and Data context are distinct identities.

## Limits and next step

Inputs here use `change`, not live keystrokes. Do not prefix Data paths with the Source `main` path. The advanced section distinguishes `#ANCHOR` from the Data-path segment `.#parent`; do not treat `#parent` as a Source-node identifier.

Continue with [b02 · Variable datapath](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/02-variable_datapath.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-040) explains the full contract.

**Sample data:** `01-pointers_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
