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
