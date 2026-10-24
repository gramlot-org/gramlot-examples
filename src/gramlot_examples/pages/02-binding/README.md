# Binding

Make fields, text and drawings share the same values. Edit a value once and let every bound view follow it.

**This section uses Source, Data Bags, pointers, native input binding and sample Data companions and interface defaults.** It makes no endpoint calls and loads no remote content.

Start with **Pointers**. The final three pages revisit **Native forms**, **SVG shapes** and **A complete page**: binding replaces code that would copy values into each view.

**Later follow-up:** **Freeze** also uses local button controllers and named Logic. Return after **Named logic** and **Button controller**. Its Page/Logic module layout is from 0.2.5.

<details>
<summary>More detail</summary>


The pages of this family keep their content in the Data and let the DOM follow it.

A `^` pointer in a text or an attribute reads a Data path and keeps the element up to date. A native control whose `value` is a `^` pointer also writes the Data when you edit it. The same-name `_data.tytx` Bag supplies sample values before rendering; `default` initializes interface controls. The dedicated setters lesson shows the explicit `dataSetter` mechanism.

Start with **Pointers**, then follow the order of the list: a context that changes, initial values and defaults, editing, booleans, style and SVG, freeze. The last three pages take the content of HTML / SVG examples 06, 08 and 12 and add the binding, so the same page shows the difference.

Each example has a Python page and its JavaScript equivalent. Both run on the same packaged runtime.

## Prerequisites within the release sequence

The family belongs to the 0.2.0 binding stage. Use b01's pointers to read b02–b04;
separate the first trial from the advanced symbolic-path exercises. b05/b06/b09
cover forms and layout; b07/b10 follow e08's SVG introduction. b08 uses named
Logic and nested button controllers: read c03/c06 and e10 first. Freeze suspends
structural rendering, not existing Data reactions; removed nodes stop handling
events immediately. See the [release-by-release route](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md#gc-025-015). Prerequisites support the
chronological sequence; they do not replace it. The maintained files may use
later APIs, so they are not snapshots of the earliest release.

## How to work through a lesson

Read its core release stage first, then its goal and prerequisites. Open the
existing preview, predict the guided result, and only then try the source-change
exercise in your own editable page. Each exercise includes an answer. Follow
"The same example across stages" links to compare earlier/later declarations;
keep both stages visible. A newer interactive page can contain more total code
while requiring less explicit state synchronization or request coordination.

</details>


## Gallery groups

The navigation groups these lessons by topic. Select a group label for its introduction, or expand its arrow to choose an example.

- **Data paths and updates**: Pointers, Variable datapath, Setters and defaults, Freeze.
- **Editing bound values**: Native editing, Checkbox and radio, Forms with binding.
- **Binding the presentation**: Style and visibility, Bound SVG, SVG shapes with binding.
