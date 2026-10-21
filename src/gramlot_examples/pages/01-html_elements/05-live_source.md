# 13 · Live Source playground

A playground for adding, removing and changing parts of a running page, including a small SVG animation. You learn how Source changes affect the screen and how a controller with `_timing` drives an animation that stops with its section. Try this after **Events** and **Lifecycle**.

**Uses:** Live Source, browser actions and a `_timing` controller with named Logic (0.2.0), with the `src` name from 0.2.10. No Data binding.

<details>
<summary>More detail</summary>


**Release stage:** Source foundation (core 0.1.x); maintained syntax is used here. The interactive controls are a later 0.2.0 layer; return to them after c07. The src proxy spelling is from 0.2.10.

**Goal:** Separate live Source changes from Data reactivity and let a controller own a timer.

**Before this lesson:** [e10 · Cards with icons](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/01-html_elements/04-page_composition/01-cards_with_icons.md), [c07 · Events](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/03-events/01-events.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **e13 · Live Source playground** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

## Read the page

Buttons declare browser actions on Source: `wrapSource(...).li(...)` adds an item; `popNode`/`clear` remove children; `setValue` changes text; `setAttr` changes the circle. They never build application DOM directly. The `this` of an action is its button node, and `this.builder.source` is the Source.

The `animate` controller is a child of the motion section. Its `_timing` of 0.05 seconds runs it every 50 ms, and it updates the Source `cx` of the circle. Removing the section removes the controller and stops its timer, so the page has no timer to clear. `animate` is a method of the page `Logic`, which the Python and JavaScript pages share. The actions are browser JavaScript, including when declared by Python.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Begin with two list items. Add one: expect three. Remove last: expect two. Clear list: expect none.
2. Change heading: it becomes “Source is alive!”. Change ball color while it moves.
3. Remove animation: the entire motion section disappears and its controller stops with it. Reload restores the original list and animation.

## Change it and check yourself

Change `_timing` of the `animate` controller from 0.05 to 0.1 seconds.

**Answer:** updates occur about half as often; the position still depends on elapsed time, so the motion becomes less smooth, not half-speed. Removing the section still stops the timer, with no cleanup code.

## The same example across stages

In **0.2.0**, [b07 · Bound SVG](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/07_bound_svg.md) makes geometry follow Data (`r="^.radius"`), while c02 supplies declarative timing for a controller. This lesson already uses `_timing` for the repeated task: the provider owns the timer and its cleanup, so the page has no timer, setup or cleanup code. The animation still writes Source attributes; it is not a binding.

## Limits and next step

This advanced bridge uses a `_timing` controller and inline actions, so it is not a pure 0.1.x executable snapshot, and the inline actions need the permissive CSP profile. No Data persistence or server synchronization is present.

Continue with [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/01_pointers.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-055) explains the full contract.

</details>
