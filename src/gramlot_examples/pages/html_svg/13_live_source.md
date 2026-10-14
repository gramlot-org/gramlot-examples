# 13 · Live Source playground

A playground for adding, removing and changing parts of a running page, including a small SVG animation. You learn how Source changes affect the screen and why a timer must stop when its page is removed. Try this after **Events** and **Lifecycle**.

**Uses:** Live Source and browser actions (0.2.0), with the `src` name from 0.2.10. No Data binding.

<details>
<summary>More detail</summary>


**Release stage:** Source foundation (core 0.1.x); maintained syntax is used here. The interactive controls are a later 0.2.0 layer; return to them after c07. The src proxy spelling is from 0.2.10.

**Goal:** Separate live Source changes from Data reactivity and release an owned timer.

**Before this lesson:** [e10 · Cards with icons](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/10_cards_with_icons.md), [c07 · Events](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/07_events.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **e13 · Live Source playground** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

## Read the page

Buttons declare browser actions on Source: `wrapSource(...).li(...)` adds an item; `popNode`/`clear` remove children; `setValue` changes text; `setAttr` changes the circle. They never build application DOM directly.

The authored script schedules a 50 ms interval updating the Source `cx`. `renderer.onDispose(motion, ...)` clears it when its section is removed. The script is browser JavaScript, including when declared by Python; the Logic class in the module is empty.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Begin with two list items. Add one: expect three. Remove last: expect two. Clear list: expect none.
2. Change heading: it becomes “Source is alive!”. Change ball color while it moves.
3. Remove animation: the entire motion section disappears and its disposal callback clears the interval. Reload restores the original list and animation.

## Change it and check yourself

Change the interval delay from 50 to 100 ms in the authored script. Keep the same `onDispose` cleanup.

**Answer:** updates occur about half as often; the position still depends on elapsed time, so the motion becomes less smooth, not half-speed. Removing the section must still release the interval.

## The same example across stages

In **0.2.0**, [b07 · Bound SVG](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/07_bound_svg.md) makes geometry follow Data (`r="^.radius"`), while c02 supplies declarative timing for a controller. A repeated task can then use `_timing` with lifecycle managed by its provider. That reduces timer/setup/cleanup code for that task; it does not mean the existing Source animation has secretly become a binding.

## Limits and next step

This advanced bridge uses a Source script and inline actions, so it is not a pure 0.1.x executable snapshot. No Data persistence or server synchronization is present. Do not copy the timer without its cleanup.

Continue with [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/01_pointers.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
