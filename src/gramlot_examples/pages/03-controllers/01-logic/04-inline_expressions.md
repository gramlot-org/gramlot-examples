# Use short inline expressions

**Sample data:** `04-inline_expressions_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

Small expressions calculate what an element displays directly from its inputs. You learn how to format a local result without adding another calculated Data field.

**Uses:** Data binding and inline expressions — core 0.2.0.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Compute a local display value without storing another derived Data field.

**Before this lesson:** [c01 · Formula](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/01-formula.md), [c03 · Named logic](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/03-named_logic.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c04 · Inline expressions** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

## Read the page

`==` starts a browser expression. Its names come from other attributes on that same Source node: `first="^.first"`, `last="^.last"`, or `score="^.score"`.

```python
result.h2("==first + ' ' + last", first="^.first", last="^.last", id="full-name")
```

The verdict uses score for text, class and title; the SVG bar uses score × 3 for width. The button’s `action` sets `.started` after `disabled` becomes false.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Expect Ada Lovelace, score 40, “Not yet”, bar width 120 and Start disabled.
2. Move score to 60: verdict becomes Passed and width becomes 180.
3. Accept the rules, then Start: the Started text appears.

## Change it and check yourself

Predict the result at exactly score 50, then try it.

**Answer:** Passed and width 150, because the condition uses `>= 50`. Changing it to `> 50` changes that boundary, not the binding mechanism.

## The same example across stages

For a value used only by one display, compare a `.full_name` dataFormula plus a `^.full_name` heading with the `==` heading above: it removes the extra destination and provider. Both are 0.2.0 choices. Keep a named/shared formula when the result is needed elsewhere; fewer lines is not the only criterion.

## Limits and next step

Inline expressions/scripts require the permitted CSP profile and are not code loaded from Data. Do not teach deprecated SET macros. An expression cannot use another `==` attribute as a computed dependency; use a Data formula when several nodes need one result.

For attribute templates, compare [c16 · Attribute projection](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/16_attribute_projection.md): the slot `{name}` after the `:` of a pointer reads a declared sibling attribute, and ordinary `${name}` text stays literal. Neither permits chains of `==` attributes.

Continue with [c05 · Node methods](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/05_node_methods.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-065) explains the full contract.

</details>
