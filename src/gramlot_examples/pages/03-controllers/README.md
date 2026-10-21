# Controllers

Add calculations and actions to bound pages, then calls to their host. Each stage uses the earlier building blocks plus only the features listed here.

- **0.2.0:** local formulas, controllers, Logic, events and lifecycle. Begin with **Formula**; the first part of **End-to-end story** combines them without a host call.
- **0.2.3:** the later part of **Attribute projection** adds a sandboxed HTML preview.
- **0.2.5:** revisit **Named logic** for the shared module layout; **Data exchange** adds local file save/restore, using the utility name introduced in 0.2.10.
- **0.2.14:** **Endpoint**, **Call on change** and **Call on click** add `dataRpc`. Then revisit the quote section of **End-to-end story** with the same inputs.
- **0.2.15:** the later part of **Call on click** adds Source authorization.
- **0.2.16:** **Remote**, **Cached remote** and **Data remote** add Source fragments and values loaded on demand.

- **0.2.18:** revisit **Button controller** in **Publish and subscribe**, then use **Parent and child messages** for direct iframe exchange. These pages require core 0.2.18 or later.

The host is Python, Node/Bun or a standalone browser Worker. Local Logic runs in the browser. Stable example numbers identify pages; the menu follows release order.

<details>
<summary>More detail</summary>


The pages of this family run code when the Data changes.

`dataFormula` computes a value and writes it to its result path. `dataController` runs code for its effects. `dataRpc` calls an endpoint of the page on the server and writes the answer to its result path. `remote` makes the content of an element a fragment built by the page on the server; `dataRemote` makes a Data path a value computed by an endpoint when it is read. A button runs a nested controller at every click; `connect_on<event>` attributes connect other DOM events. The code is inline in the page, or a method of the `Logic` class that the page module `NN_name.js` exports; the Python page takes it from there.

Inline code needs a Content Security Policy that allows it. Named logic in the `Logic` class also runs under a strict policy.

Start with **Formula** and **Controller**, then move the code to the `Logic` class with **Named logic**. **End-to-end story** preserves its local binding/lifecycle stage and adds a separately labelled endpoint trial to revisit later. Seven pages call the server. **End-to-end story** (later section), **Endpoint**, **Call on change** and **Call on click** use `dataRpc`; **Remote** and **Cached remote** mount a fragment of the page with `remote`; **Data remote** computes a Data value with `dataRemote`.

Each example has a Python page and its JavaScript equivalent. Both use the `Logic` class of the JavaScript module. An endpoint is a method of the page in each language: Python `@endpoint`, JavaScript `Page.registerEndpoint`. A fragment method is declared with Python `@source`, JavaScript `Page.registerSource`.

## Prerequisites within the release sequence

The 0.2.0 stage starts with c01/c02's calculation/effect distinction, then c03 for the
recommended named-Logic form. c06/c09/c11 teach click, server value and errors;
c12 teaches Source replacement in the later 0.2.16 stage.
The Page/Logic module arrangement is a 0.2.5 addition to the named-logic lesson. c08's first pass combines local binding/lifecycle. Return after c09/c11 for its
0.2.14 quote/result/error section; it does not run automatically or add remote/lazy Data. After b02 and c12, use c13
for a first cache trial; c14 needs the endpoint concepts of c09/c10. Advanced
cache/lifecycle exercises are separate in c13/c14. See the [release-by-release route](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md#gc-025-015). Prerequisites support the
chronological sequence; they do not replace it. The maintained files may use
later APIs, so they are not snapshots of the earliest release.

_userChanges filters exact-path changes, not user versus programmatic input.
Named connect_on handlers require dotted resource groups, unlike a root func
method in c03; the common FileServer gallery has no such resource host.

## How to work through a lesson

Read its core release stage first, then its goal and prerequisites. Open the
existing preview, predict the guided result, and only then try the source-change
exercise in your own editable page. Each exercise includes an answer. Follow
"The same example across stages" links to compare earlier/later declarations;
keep both stages visible. A newer interactive page can contain more total code
while requiring less explicit state synchronization or request coordination.


## Added depth in release order

After the local c08 stage, use c15 for lifecycle (0.2.0), c16 for attribute
projection (0.2.0) and its separately labelled sandbox step (0.2.3), then c17 for
Data exchange (0.2.5, utility path since 0.2.10). Continue with c09–c11 (0.2.14),
return to c08's 0.2.14 quote extension, then c11's later Source-auth section (0.2.15), and c12–c14 (0.2.16). Stable keys are
identifiers, not release numbers: their order in this menu follows these stages.
The date initialization issue in c17 and named-resource-host prerequisites remain
explicit gaps; the local file lesson does not imply HTTP service or mail delivery.

</details>


After the messaging lessons, **c20 · Actions, confirmations and references**
completes the 0.2.18 button examples. **c21 · Plain and delayed buttons** then
shows the 0.2.19 additions, comparing the same action before
and after adding `_delay`. It needs core 0.2.19 or later.

**c22 · Pointer templates and expressions** follows c21 in core 0.2.20: repeat the CSS-width exercise with a shorter pointer, invert a boolean
and reuse the page formatter for text and attributes. It does not use Web Components.


**c23 · Plan your stay** combines room choice, guests and nights with seven chained formulas, validation and a click summary. Follow nightly price, subtotal, long-stay discount, total and deposit; then edit one rule and observe the downstream results. The full Python Page is 42 nonblank lines.


## Gallery groups

The navigation groups these lessons by topic. Select a group label for its introduction, or expand its arrow to choose an example.

- **Formulas and page logic**: Formula, Controller, Named logic, Inline expressions, Node methods, Pointer templates and expressions.
- **Actions and commands**: Button controller, Actions, confirmations and references, Plain and delayed buttons.
- **Events and lifecycle**: Events, Lifecycle, Attribute projection, Publish and subscribe, Parent and child messages.
- **Calling the server**: Endpoint, Call on change, Call on click.
- **Remote content and Data**: Remote, Cached remote, Data remote.
- **Putting page logic together**: End-to-end story, Plan your stay.
