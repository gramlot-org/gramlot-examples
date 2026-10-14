# 10 · Cards with icons and live Source

Three cards, each with an SVG icon. You learn how to combine text and drawings. The × buttons add a later step: removing a card from Source also removes it from the screen. Return to the buttons after **Events**.

**Uses:** Source, HTML and SVG (0.1.x); removal uses browser actions (0.2.0) and the `src` name from 0.2.10.

<details>
<summary>More detail</summary>


**Release stage:** Source foundation (core 0.1.x); maintained syntax is used here. The interactive controls are a later 0.2.0 layer; return to them after c07. The src proxy spelling is from 0.2.10.

**Goal:** Remove a Source branch and let Gramlot remove the corresponding DOM.

**Before this lesson:** [e09 · SVG composition](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/09_svg_composition.md), [c07 · Events](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/07_events.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **e10 · Cards with icons** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

## Read the page

Three cards use Source `node_label` values `structure`, `drawing` and `reading`. The inline click declaration finds the Source container `main.page.cards` and calls `popNode` with the selected card label. Its SVG disappears with the card.

`node_label` is a Bag path segment, `node_id` is a Source lookup identity, and HTML `id` identifies a DOM element; they are not interchangeable. `main` here is a **Source** path, not a Data prefix.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Click × on Drawing. Exactly that card disappears and the two others remain.
2. Remove the others, then reload: all three return because the host builds the initial Source again.

## Change it and check yourself

Add a fourth tuple to `CARDS` and a matching branch in `icon`. Give the tuple a new Source label, then reload and remove it.

**Answer:** four cards appear and removal still targets one label. Reusing another card’s label would not give it an independent stable identity.

## The same example across stages

At the later binding stage, b08 and c08 wrap related Source operations in named Logic and combine them with Data. For values that merely change geometry/text, b07 replaces repeated Source writes with pointers; removing structure still uses Source operations.

## Limits and next step

Changes are local, not persisted or synchronized to a server. The cards are Source-only; the button declaration is a later inline-behavior layer. The installed companion Logic is empty here.

Continue with [e11 · Static report](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/11_static_report.md). The [authoring reference](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md) explains the full contract.

</details>
