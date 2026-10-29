# Gallery teaching and visual review — 2026-10-25

<!-- Document ID: GE-015 -->
<a id="ge-015-005"></a>
## 005 · Scope and acceptance criteria

Owner: “si devono essere tutti 'bellissimi' e facilissimi da capire.”
The reviewed inventory is the 93 common catalogue lessons. Host-only IDE/directory
pages and the separate menu prototype collection are not counted as these lessons.
This is local review work, not publication, release acceptance, or a claim of
pixel-perfect rendering on every browser/device.

A lesson should state what to try and what to observe; put the important result
next to its controls when possible; keep secondary configuration out of the first
view; use readable theme colors and compact spacing; and express its intent in
small Python/JavaScript methods, loops and normal Source/Data bindings.
Native HTML reference lessons deliberately keep native controls. Complete
composition examples demonstrate applications; the first HTML lesson stays tiny.

<a id="ge-015-010"></a>
## 010 · Evidence and limits

- Every catalogue entry and its companion lesson now has a concrete trial.
- All 93 initial desktop presentations were inspected in the local Python gallery.
  Changed layouts were revisited; screenshots are local review evidence.
- All 93 pages were captured at 390 × 844 and checked for document-level horizontal
  overflow. Representative mobile screenshots were inspected; these geometry
  checks do not certify every hidden panel or every real touch device.
- Desktop comparison uses 1100 × 800; one gallery check uses 1280 × 900 in light
  mode. Dark previews, light gallery presentation, Typst compilation and selected
  interaction checks complement the automated runtime/parity suites.
- Multi-region border laboratories retain a useful canvas width and scroll only
  that canvas on narrow screens. They do not automatically rearrange their regions.
- Reference catalogues (native forms, validation, advanced controller cases) remain
  longer lessons. They are not claimed to be single-screen demonstrations.
- The code/Source parity suite covers all catalogue lessons; the overview suite
  covers the branch introductions separately. Redundant full-catalogue comparisons
  were removed. Python runtime checks and strict documentation/export checks are
  recorded in GC-070-2035 after completion.
- Owner visual acceptance remains pending. No framework implementation or
  dependency source was modified; no package or site was published.

<a id="ge-015-015"></a>
## 015 · Catalogue ledger

Every row received the initial desktop review, narrow-screen capture and a concrete
learning trial. The notes identify particular presentation work; “Retained” means
the existing teaching structure was inspected, not mechanically restyled.

| Key | Lesson | Presentation note |
| --- | --- | --- |
| e01 | Your first page: headings and text | Retained; trial text clarified. |
| e02 | Text and links | Retained; trial text clarified. |
| e03 | Ordered, nested and definition lists | Retained; trial text clarified. |
| e04 | Semantic page | Retained; trial text clarified. |
| e05 | Tables with headings and totals | Retained; trial text clarified. |
| e06 | Native form controls | Native controls grouped into small authoring methods. |
| e07 | Expandable sections and progress indicators | Retained; trial text clarified. |
| e08 | Draw basic SVG shapes | Theme-colored ellipse has a visible outline. |
| e09 | Compose an SVG scene | Repeated SVG helpers; unnecessary tree collection removed. |
| e10 | Cards with icons | Retained; trial text clarified. |
| e11 | Static report | Chart and exact table compared side by side. |
| e12 | Build a complete event page | Compact hero and section spacing. |
| w01 | Text fields: live updates and labels | Secondary settings collapsed; field spacing simplified. |
| w02 | Checkbox: a boolean value | Secondary settings collapsed; field spacing simplified. |
| w03 | Radio group: choose one value | Secondary settings collapsed; field spacing simplified. |
| w04 | Multiline text fields | Secondary settings collapsed; field spacing simplified. |
| w05 | Password fields | Secondary settings collapsed; field spacing simplified. |
| w06 | Individual radio buttons | Removed duplicate option labels. |
| w07 | Choose and bind a color | Secondary settings collapsed; field spacing simplified. |
| w08 | Horizontal slider: range and steps | Secondary settings collapsed; field spacing simplified. |
| w09 | Vertical slider: orientation and values | Secondary settings collapsed; field spacing simplified. |
| w10 | Numeric fields: format and constraints | Secondary settings collapsed; field spacing simplified. |
| w11 | Date fields: entry and display formats | Secondary settings collapsed; field spacing simplified. |
| w12 | Time fields: entry and display formats | Secondary settings collapsed; field spacing simplified. |
| w13 | Search a list and select a value | Secondary settings collapsed; field spacing simplified. |
| w14 | Load choices with a browser callback | Secondary settings collapsed; field spacing simplified. |
| w15 | Combine free text and suggestions | Secondary settings collapsed; field spacing simplified. |
| w16 | Checkbox group: select several values | Secondary settings collapsed; field spacing simplified. |
| w17 | Inline and popup calendars | Calendar label follows the theme accent. |
| w18 | Validate required values and text length | Secondary settings collapsed; field spacing simplified. |
| w19 | Arrange fields with formlet | Secondary settings collapsed; field spacing simplified. |
| w20 | Group fields and copy typed Data | Retained; trial text clarified. |
| w21 | Show a boolean as a switch | Retained; trial text clarified. |
| w22 | Buttons: icons, labels and commands | Native command sizes to its content. |
| w23 | Toggle buttons and selection state | Retained; trial text clarified. |
| w24 | Dropdown buttons and command menus | Retained; trial text clarified. |
| w25 | Validation rules, warnings and callbacks | Retained; trial text clarified. |
| w26 | Browse hierarchical Data with a tree | Retained; trial text clarified. |
| w27 | Customize tree labels and row styles | Retained; trial text clarified. |
| w28 | Tree icons and computed captions | Retained; trial text clarified. |
| w29 | Copy tree nodes with drag and drop | Title describes copying, not reordering. |
| b12 | Load example data and replay field edits | Retained; trial text clarified. |
| b01 | Bind values with absolute and relative paths | Retained; trial text clarified. |
| b02 | Change the current record with datapath | Retained; trial text clarified. |
| b03 | Initialize values: defaults and dataSetter | Defaults/setters and resulting Data compared side by side. |
| b04 | Edit shared Data with native fields | Retained; trial text clarified. |
| b05 | Bind boolean and single-choice values | Choices and their boolean readout grouped. |
| b06 | Control styles and visibility from Data | Controls and styled result compared side by side. |
| b07 | Update SVG from Data | Geometry controls beside the SVG. |
| b08 | Defer structural updates with freeze | Corrected freeze explanation: Data bindings remain live; structural changes wait. |
| b09 | Build a form with shared Data | Retained; trial text clarified. |
| b10 | Bind SVG geometry and color | Geometry controls beside the SVG; outlined ellipse. |
| b11 | A complete page driven by Data | Compact hero, separated checkbox labels. |
| c01 | Calculate a value with dataFormula | Retained; trial text clarified. |
| c02 | React to Data changes with dataController | Small methods for independent triggers; responsive comparison grid. |
| c03 | Organize behavior in a Logic class | Retained; trial text clarified. |
| c04 | Use short inline expressions | Retained; trial text clarified. |
| c05 | Call methods on a Source node | Retained; trial text clarified. |
| c06 | Run a controller from a button | Retained; trial text clarified. |
| c07 | Handle browser and component events | Clickable event chips have a visible shape and theme colors. |
| c08 | Combine inputs, calculations and server calls | Named stages; local form and SVG result compared together. |
| c15 | Start and dispose page behavior | Retained; trial text clarified. |
| c16 | Project attributes and preview HTML | Retained; trial text clarified. |
| c18 | Publish and subscribe to messages | Retained; trial text clarified. |
| c19 | Exchange messages between frames | Reply is shown in the child frame only. |
| c20 | Confirm actions and target references | Retained; trial text clarified. |
| c21 | Run immediate and delayed button actions | Retained; trial text clarified. |
| c22 | Transform bound values with pointer expressions | Retained; trial text clarified. |
| c23 | Calculate a room estimate | Semantic theme colors replace the forced light surface. |
| c17 | Export and restore typed Data | Retained; trial text clarified. |
| c09 | Define and call a server endpoint | Retained; trial text clarified. |
| c10 | Call the server when a value changes | Retained; trial text clarified. |
| c11 | Call the server from a button | Retained; trial text clarified. |
| c12 | Load a remote Source fragment | Retained; trial text clarified. |
| c13 | Cache remote fragments | Retained; trial text clarified. |
| c14 | Fetch Data with dataRemote | Retained; trial text clarified. |
| l01 | Border regions and splitters | Retained; trial text clarified. Readable canvas on narrow screens. |
| l02 | Nested borders and layout designs | Retained; trial text clarified. Readable canvas on narrow screens. |
| l03 | Rounded borders and popups | Retained; trial text clarified. Readable canvas on narrow screens. |
| l04 | Drawers: handles, content and retained Data | Retained; trial text clarified. Readable canvas on narrow screens. |
| l05 | Nested regions playground | Size controls are collapsible; named controls/workspace methods. Readable canvas on narrow screens. |
| l06 | Border events and controllers | Retained; trial text clarified. Readable canvas on narrow screens. |
| l07 | Tabs: select, close and retain content | Primary exercise first; options, events and tab-style catalogue collapsible. |
| l08 | Switch pages in a single stack | Retained; trial text clarified. |
| l09 | Compare desktop and touch themes | Retained; trial text clarified. |
| code_mirror | Edit source code with CodeMirror | Secondary language/state options collapsible. |
| code_mirror_options | Configure language, wrapping and editor options | Secondary language/state options collapsible. |
| html_editor | Edit HTML: source, preview and rich text | Formatted the initial HTML source for reading. |
| markdown_editor | Edit Markdown: source, preview and rich text | Retained; trial text clarified. |
| typst_editor | Edit Typst and generate a PDF | Responsive Source-authored grid stacks code and preview on narrow screens. |
| e13 | Live Source playground | Retained; trial text clarified. |
| color_maker | Color Maker: one block, three contexts | Existing reusable RGB helper and selected-block floating palette retained. |
| sieve | Sieve of Eratosthenes: animate reactive Data | Existing timer/Data/binding example retained; no direct DOM animation. |


<a id="ge-015-080"></a>
## 080 · Tray workspace release candidate (2026-10-26)

Owner requested a trayPane lesson with a menu toolbar, mixed cards and explanations
of selection, movement, layers, grid and Data Bag layout snapshots, followed by
checks and a coordinated release including the servers. Added Tray workspace to
Containers and layout: Python-first helpers, equivalent JavaScript, initial TYTX
layout, visible short instructions and an Explanation guide. The wide workspace
scrolls on narrow screens; it does not compress or hide the card contents.

Chromium and WebKit checks confirm real title dragging, restoration of position,
size, layer, rotation, scale and selection, retained widget identity and field
editing while locked. Core fixtures separately qualify snapping, contact,
rectangle/group selection and complex nested layout. DOMPurify matches the core's
patched version. Documentation stages 110 runnable lessons and validates links.
Publication remains pending until the coordinated release checks complete.

Final rebuilt candidate: all 296 JavaScript tests pass after integrating the shared
Toolbox parser through core. The tray browser checks retain widget identity,
restore all geometry and keep field editing available when the layout is locked.


Release-gate follow-up: all 110 catalogue lessons pass their interactive browser
checks through both Python and JavaScript hosts, including the new window, menu,
Color Maker, sieve and tray lessons. Checks now follow the shared Labelbox copy
action and the visible lesson captions. The mobile-artifact regression uses the
stdlib unittest runner required by CI. File-export theme messages compare against
the opaque `null` event origin while retaining parent/registered-frame ownership
checks; HTTPS checks remain exact-origin. The serverless file gallery passes all
111 exported examples with no HTTP(S) requests. No package has been published yet.


Publication (2026-10-27): v0.3.17 is consolidated on main and available on npm and
PyPI. The release workflow passed all eight verification jobs, built both
packages and published the GitHub release. All 297 JavaScript tests and all 31
stdlib Python tests pass; each of the 110 lessons passes interactive checks
through both language hosts. The public mobile profile is preserved as recorded
in GE-020 and the deployment operations guide.


<a id="ge-015-085"></a>
## 085 · FrameGrid gallery preview — 2026-10-28

Owner requests the grid in the gallery with theme selection outside the example,
then supplies the Studio orders PoC as the visual reference. The Python-first
menu-15 lesson composes frameGrid, twelve Bag attribute rows, three column groups
and shared top/bottom menu bars. Its adjacent JavaScript is Source-equivalent.
Example commands update the first price and remove the last row; the count uses
a Data formula. Line numbers and amounts are ordinary sample fields.

The isolated development preview uses the matching core worktree frame-grid,
including its prepared grid collection. Existing gallery theme controls own theme,
palette and light/dark selection; there are no example-specific theme controls.
Column headers use the light surface/ink pair and centered group captions.

Verified: gallery build; 11 Python build/command tests plus 14 subtests; 18 JS
catalogue/feature tests; lesson Source parity; Chromium and
WebKit each exercise five themes in both modes, retained grid/row identity,
header/body separation and both Data commands, without page errors. Preview:
http://127.0.0.1:64551/, Menus and toolbars → FrameGrid.

Owner visual acceptance remains pending. Colored groups, multiline struct styles
and the proposed floating configurator require the next bounded contract; no
configurator or grid editing is claimed here. No publication or deployment.


<a id="ge-015-090"></a>
## 090 · Legacy grid appearance and column gestures — 2026-10-28

Owner requests SVG and a richer appearance, then draggable/resizable columns
writing the struct. The split-band screenshot and instruction to copy the legacy
mechanism settle independent column order and group membership. The lesson now
uses SVG commands/title, theme-variable background/color on groups and legacy
white_space on notes. Header captions share a baseline; multiline rows determine
their own height. Drag and resize are core behavior, not application event wiring.

The Data struct follows legacy view_0.rows_0 and info.columnsets. The Python
colgroup/column syntax remains. Changes can be inspected through the existing
Inspector; reload restores initial sample Data. Chromium/WebKit validate themes,
retained rows, SVG, multiline heights and ordinary commands; core qualifies the
actual drag/resize and group split/join. Source parity passes. Visual acceptance
is pending. The earlier open style questions are resolved by legacy properties;
configurator and direct cell editing remain outside this increment.


<a id="ge-015-095"></a>
## 095 · Borderless icon toolbar — 2026-10-28

Owner requests lower, more rounded group bands and a borderless SVG toolbar with
subtle hover. The lesson now uses menu labelPosition=tooltip and iconSize=20,
removes explicit command borders/surfaces and reduces top-bar padding. Existing
accessible names, tooltips, hover/focus and overflow are retained. Core fixes the
group-spacer height and supplies shorter theme bands with radius-lg upper corners.
Build, Source parity and Chromium/WebKit theme/command checks pass. Final Mimi
inspection confirms 20px bands, 5px corners, transparent idle buttons and subtle
hover. The page remains available at the local gallery; visual acceptance pending.


<a id="ge-015-100"></a>
## 100 · Neutral grid column headers — 2026-10-28

The owner requests conventional gray headers distinct from the surrounding theme
surface. The matching core supplies neutral light/dark header tokens, separators
and subtle relief. The example's group colors and toolbar remain theme-driven.
Both browsers pass all ten theme/mode combinations with retained rows and working
commands; Mimi light/dark screenshots confirm header/frame distinction. The line
number remains a data field; explicit row-header semantics are not implemented.


<a id="ge-015-105"></a>
## 105 · FrameGrid row headers — 2026-10-28

menu-15 enables the core rowHeaders parameter and removes the ordinary line
column. Generated ordinals use the gray header theme and follow row removal.
Chromium/WebKit verify matching header colors and numbering across the existing
five-theme/two-mode checks. Python/JS Source parity passes. Individual manual row
height dragging is requested but not yet implemented: ownership across grids is
awaiting the owner's answer. No example-level event or geometry state is added.


<a id="ge-015-110"></a>
## 110 · Independent row height — 2026-10-28

The owner clarifies that separate grid rows can display the same data; their
heights are independent presentation. This resolves §105's pending question.
menu-15 enables rowResize alongside rowHeaders. The core handles bottom-edge
resizing, keyboard adjustment, cancel and double-click/Home reset; examples add
no event wiring or geometry state. Python/JS Source parity and Chromium/WebKit
multiline resize/reset, neighbor-row stability and five-theme/two-mode checks pass.
Preview remains http://127.0.0.1:64551/. Reload FrameGrid to load the new component.


<a id="ge-015-115"></a>
## 115 · selfDragRows opt-in withheld — 2026-10-28

The requested opt-in row-reorder increment is drafted in core but not enabled in
menu-15: Bag.move's del/ins sequence recreates the moved row and loses its manual
height. Core GC-375 §060 and PORT-0026 record the reproducer and pending Bag JS
scope authorization. Browser drag assertions are prepared but the feature is not
qualified or accepted; §110's existing resize behavior remains the live example.


<a id="ge-015-120"></a>
## 120 · Logical ordering investigation — 2026-10-28

Owner proposes a precomputed order attribute and asks to examine header sorting.
Core GC-375 §065 separates rowidx, counterField, sortedBy and filtered indexes.
The earlier claim that Bag JS must be corrected before any drag was too broad:
view-only order can preserve the Bag unchanged. selfDragRows stays inactive until
rank ownership and drag/sort interaction are agreed. No new gallery behavior or
browser qualification is claimed by this investigation.


<a id="ge-015-125"></a>
## 125 · FrameGrid indexed sort and self row drag — 2026-10-28

Core GC-375 §090 implements the authorized Bag collection store. FrameGrid now
enables selfDragRows in Python and the mirrored JS authoring. Header click sorts;
Shift-click adds criteria and shows their priority. Manual drag changes node
indices and clears sort criteria without physically moving Bag nodes. Existing
row headers, independent heights, themed bars and multiline content remain.
menu-15 source parity passes. The live gallery passes Chromium/WebKit checks for
five themes × light/dark, commands, identity, row resize, indexed drag and typed
multicolumn sort. Core records the independent WebKit native-drag/pointer-cycle
limitation; no application workaround is introduced. Owner acceptance is separate.


<a id="ge-015-130"></a>
## 130 · Separate Grid section and progressive lessons — 2026-10-28

Owner requests a separate Grid entry in the gallery index with examples from
simple to complex. Implemented `05-grid`: basic Bag-value rows; attribute rows
with typed cells and zero/false examples; column groups/multiline notes/row heights;
multicolumn sort and manual indexed drag; two grids sharing order but independent
heights; complete FrameGrid. The first five are new lessons (`grid-01`–`grid-05`).
FrameGrid is relocated, not duplicated; its stable `menu-15` key remains. Source,
Data, Markdown, mirrored documentation, catalogue, feature links and inventory
expectations are aligned. The common catalogue has 117 lessons and 145 routes.
No core behavior, dependency source or authoring API was changed.

Verified: six Python/JS Source parity checks; 23 index/build/feature JS checks;
26 Python tests and 26 subtests for gallery, navigation, build, modules and menus.
The progressive-family browser check exercises all six entries in Chromium and
WebKit, including typed values, grouped headers, numeric multicolumn sort, indexed
drag without physical Bag movement, shared ordering and independent row heights.
The relocated FrameGrid is also checked through its existing theme/command test.
The initial broader gallery JS run was stopped after its unrelated interaction
checks became slow; its catalogue expectation failures were corrected and the
23 affected index/build/feature checks rerun successfully. No complete gallery JS
suite pass is claimed for this increment. Implementation and bounded verification
are separate from owner's acceptance of the live result.

Final browser receipts confirm both engines and the relocated FrameGrid across
five themes in light/dark mode, including commands, resize, indexed drag and sort.
Receipts and the final index screenshot are retained under core PORT-0026
verification/grid-family-*. No deployment or framework change is implied.


<a id="ge-015-135"></a>
## 135 · Grid examples inherit browser locale — 2026-10-29

Owner: “allora togli il locale da tutti gli esempi grid e lascia quello del browser”.
Removed the explicit en-GB locale from all six Grid lessons in both Python and
JavaScript. They inherit the existing browser locale/time-zone defaults; no core
behavior changed. Six source-parity checks pass. Chromium and WebKit both verify
all six pages with it-IT, including price display 89,90 and no page errors. The
local gallery was rebuilt and restarted on port 64551.


<a id="ge-015-140"></a>
## 140 · FrameGrid collection search — 2026-10-29

The owner approved filtered in the core collection store and FrameGrid searchOn,
with the legacy all/column menu and typed comparisons (core GC-375 §115). The
sixth Grid lesson enables searchOn in both Python and JS and explains regex text,
numeric/date comparisons, clear, sort and hidden-row-preserving drag. It still
inherits browser locale; no app-local filter or DOM handler is introduced.

The gallery bundle was rebuilt against the frame-grid core worktree. The live
Python lesson passed an all-column search in the in-app browser. Core verification
covers both row modes, typed search, invalid drafts and clear retaining sort in
Chromium/WebKit. Preview: http://127.0.0.1:64552/ → Grid → FrameGrid. The existing
64551 server belongs to a separate release worktree and was left untouched.
No publication or deployment; owner visual acceptance remains separate.


<a id="ge-015-145"></a>
## 145 · Two independent grid views — 2026-10-29

Owner explicitly approved separate per-grid ordering and filtered over shared
data and requested the gallery demonstration. The fifth Grid lesson now has two
FrameGrids/search bars using the same Bag nodes, with different initial mixed
sorts and filters. A shared quantity update changes each result according to its
own criteria. Instructions explain click, Shift-click, ascending/descending and
priority badges. Both authoring languages match; browser locale is inherited.
The catalogue and ordering/FrameGrid explanations reflect core GC-375 §120,
superseding the earlier shared index/filter wording. No application-local sorting,
filtering or DOM handlers were added. The adjacent Logic only updates sample Data.

Verification: gallery bundle built; all six Grid Source/page-option parity checks
pass. Live gallery shows distinct initial results, shared update and independent
search. Core verification: 1,331 JS tests, 19 Python tests, Chromium/WebKit.
Preview http://127.0.0.1:64552/ → Grid → Two grids, independent views.
Implementation and verification complete; owner visual acceptance separate.


<a id="ge-015-150"></a>
## 150 · Dedicated search lesson — 2026-10-29

Owner requested a more polished search tool and a standalone explanatory example.
The seventh Grid lesson, Search · text, numbers and dates, now uses one FrameGrid,
eight typed rows and three guide cards. The Explanation tab lists exact expected
results and explains column scope, comparisons, invalid drafts, clearing and sort
preservation. Python-first authoring and equivalent JS use the shared searchBox;
there is no page-local search logic or component CSS override. Browser locale and
gallery themes are inherited. Core GC-375 §125 records the rounded search capsule,
internal lens and conditional internal clear button.

Verified: gallery/core builds; seven Grid Source/page-option parity checks; eight
navigation/sample-data tests; core focused 52 tests; Chromium/WebKit; live gallery
lamp (two rows), date >= 2026-10-15 (five rows) and clear. Static sample data uses
the canonical TYTX serializer and passes Data Bag decoding checks. Preview:
http://127.0.0.1:64552/ → Grid → Search · text, numbers and dates.
Implementation and checks complete; visual acceptance separate. No publication.


<a id="ge-015-155"></a>
## 155 · Contextual search instructions — 2026-10-29

Owner rejected the halo and syntax examples inside the field. Core GC-375 §130
now provides neutral focus, a distinct column-label background and a circled
information button opening instructions for the selected type. The dedicated
lesson remains; its explanation reflects the new instructions interaction.
Core tests and Chromium/WebKit pass; live gallery appearance and info click
verified. Owner visual acceptance remains separate.
