# HTML / SVG

Build pages from text, lists, tables, forms and drawings, then combine those pieces into a complete page.

**This section uses only Source to declare native HTML and SVG: the core 0.1.x foundation, before Data binding and controllers.** Forms already allow typing and Reset because those are browser features.

Start with **Hello World**. The Binding section later revisits the same forms, drawings and complete page to show what binding adds.

**Later follow-ups:** the × buttons in **Cards with icons** and the **Live Source playground** use browser actions from 0.2.0 and the `src` name from 0.2.10. Return to these parts after **Events** and **Lifecycle**.

<details>
<summary>More detail</summary>


Learn to build a page with Gramlot: each instruction adds an element, and nested instructions describe its structure.

Start with **Hello World**, then explore text, lists, tables and form controls. Continue with SVG shapes and combine them with HTML. The final examples use methods and loops to compose larger pages from simple parts.

Compare each preview with its code, then try the small change suggested in the example's notes. Python and JavaScript express the same ideas.

Finish with **Live Source playground**: change the page while it is running and
watch a small SVG animation driven by Source attributes. The live examples also run in the static gallery of `gramlot-serverless gallery <folder>`, opened from disk, offline.

## Prerequisites within the release sequence

Start with e01/e03 for structure. HTML details (e02/e04/e05/e06/e07) and
SVG (e08/e09/e11) are optional branches. e10/e13 are advanced live Source lessons:
read c07's event explanation first and learn removal/cleanup before adapting the
animation. A loop in main builds Source once; it is not reactive Data. See the
[release-by-release route](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md#gc-025-015). Prerequisites support the
chronological sequence; they do not replace it. The maintained files may use
later APIs, so they are not snapshots of the earliest release.

## How to work through a lesson

Read its core release stage first, then its goal and prerequisites. Open the
existing preview, predict the guided result, and only then try the source-change
exercise in your own editable page. Each exercise includes an answer. Follow
"The same example across stages" links to compare earlier/later declarations;
keep both stages visible. A newer interactive page can contain more total code
while requiring less explicit state synchronization or request coordination.

e10/e13 contain inline actions/scripts; their empty Logic class is not the source
of those actions. They are advanced bridges to the 0.2.0 behavior lessons.

</details>
