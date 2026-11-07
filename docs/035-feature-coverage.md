# Feature coverage and lesson quality

Document ID: **GE-035**.

<a id="ge-035-005"></a>
## 005 · What this checklist measures

This checklist describes teaching evidence, not exhaustive feature or test coverage.
The common catalogue now has **147 lessons**. The Grid review on 2026-10-30 adds
resident virtualization, floating layouts and typed search, plus optional Python
catalogues for database loading and the Asqueel-only cached-selection experiment.
The index distinguishes generic Grid behavior, experimental loading and Asqueel-only
capabilities; it does not imply that every host supports these examples.

**Historical record — 2026-10-27 baseline:** 40 of 43 declarations in six component
grammars had mapped Python/JavaScript lessons (117 common lessons then). That figure
is not current overall feature coverage. The selector quarantine entries below
still await reconciliation with the later database review; this Grid update does
not certify dbSelect/dbComboBox or the remaining new collections.

| State | Meaning |
| --- | --- |
| Exercise | A lesson tells the reader what to do or compare and what to observe. This is documentary evidence, not a fresh browser pass. |
| Used | The feature appears in an application/example, but lacks a focused teaching exercise. |
| Gap | No matching exercise was identified in the common catalogue. |
| Quarantine | Provisional implementation held out of the teaching path until a full review against legacy APIs. |
| Review | A candidate lesson exists; its teaching claim or code still needs a focused review. |

The baseline separates four questions: **is it present, is it explained, is the
behavior verified, and is the lesson easy to read?** A successful page-load test
answers none of the last two on its own. The preceding documentation work rebuilt
110 playgrounds; it did not interactively requalify all 110 lessons.

<a id="ge-035-010"></a>
## 010 · Component inventory

Every declaration appears once below. A shared lesson may teach several closely
related components. The mapped source calls were checked in both `.py` and `.js`;
use the lesson's instructions to assess how much it teaches. Whole-component
coverage does not certify all of its attributes.

### inputs

| Component | Primary lesson | Teaching evidence / remaining work |
| --- | --- | --- |
| `textbox` | [w01 · HTML and components](../src/gramlot_examples/pages/01-inputs/01-text/01-textbox.md) | Type a customer name and watch the second field follow. Open Options, turn off live editing, then type again: the shared value changes when you leave the field. |
| `checkbox` | [w02 · Checkbox: a boolean value](../src/gramlot_examples/pages/01-inputs/02-checks_and_switches/01-checkbox.md) | Toggle either newsletter checkbox. Both views and the subscription message follow one boolean; Options lets you disable editing. |
| `radioButtonText` | [w03 · Radio group: choose one value](../src/gramlot_examples/pages/01-inputs/03-selection/01-radio_button_text.md) | Choose a delivery option and compare the stored code below. The alternative group is independent; changing one group leaves the other untouched. |
| `textBoxArea` | [w04 · Multiline text fields](../src/gramlot_examples/pages/01-inputs/01-text/02-text_box_area.md) | Edit either note. Both multiline fields share the same text; Options lets you compare live editing with updates after leaving the field. |
| `passwordbox` | [w05 · Password fields](../src/gramlot_examples/pages/01-inputs/01-text/03-passwordbox.md) | Enter a made-up password in one field. The other follows while both mask the text; this is a binding example, not a sign-in form. |
| `radioButton` | [w06 · Individual radio buttons](../src/gramlot_examples/pages/01-inputs/03-selection/02-radio_button.md) | Select Standard, Express and Pick up in turn. Their booleans are exclusive within one group; the independent choice belongs to another group. |
| `colorpicker` | [w07 · Choose and bind a color](../src/gramlot_examples/pages/01-inputs/04-colorpicker.md) | Choose a color and compare both pickers with the swatch. All three read the same color value. |
| `horizontalSlider` | [w08 · Horizontal slider: range and steps](../src/gramlot_examples/pages/01-inputs/05-numbers_and_sliders/01-horizontal_slider.md) | Move a slider or use its arrow keys. The other slider follows in steps of five; Options lets you compare live and committed updates. |
| `verticalSlider` | [w09 · Vertical slider](../src/gramlot_examples/pages/01-inputs/05-numbers_and_sliders/02-vertical_slider.md) | Move the vertical slider from bottom to top. The horizontal slider and numeric readout follow the same value from 0 to 100. |
| `numberTextBox` | [w10 · Number fields](../src/gramlot_examples/pages/01-inputs/05-numbers_and_sliders/03-number_textbox.md) | Enter a decimal, then try invalid text and leave the field. Compare the editable draft with the accepted numeric value and its formatted copy. |
| `dateTextBox` | [w11 · Date fields](../src/gramlot_examples/pages/01-inputs/06-dates_and_times/01-date_textbox.md) | Type domani and leave the field. Compare the long and short Italian date formats: they represent the same civil date. |
| `timeTextBox` | [w12 · Time fields](../src/gramlot_examples/pages/01-inputs/06-dates_and_times/02-time_textbox.md) | Change hours and minutes, then leave the field. Compare the second view; the stored value is a civil time, not a timestamp. |
| `filteringSelect` | [w13 · Search a list and select a value](../src/gramlot_examples/pages/01-inputs/03-selection/03-filtering_select.md) | Search for a delivery caption and select it. The second field follows; the readout contains its code rather than the displayed caption. |
| `callbackSelect` | [w14 · Load choices with a browser callback](../src/gramlot_examples/pages/01-inputs/03-selection/04-callback_select.md) | Search for Sample 02 and choose a result. The browser callback reads a local Bag; the selected code appears in both fields without a server call. |
| `comboBox` | [w15 · Combine free text and suggestions](../src/gramlot_examples/pages/01-inputs/03-selection/05-combo_box.md) | Choose a suggested city, then enter a city outside the list. Both are accepted: suggestions assist free text rather than restricting it. |
| `dbSelect` | **Quarantine**  | Prototype only. No new gallery exercise or recommendation until a full implementation review and comparison with legacy APIs. |
| `dbComboBox` | **Quarantine**  | Prototype only. No new gallery exercise or recommendation until a full implementation review and comparison with legacy APIs. |
| `checkBoxText` | [w16 · checkBoxText](../src/gramlot_examples/pages/01-inputs/02-checks_and_switches/02-checkbox_text.md), [checkbox-tree · Hierarchical choices](../src/gramlot_examples/pages/01-inputs/02-checks_and_switches/03-checkbox_tree.md) | Select several channels, then clear them all. Compare the comma-separated codes with the null value produced by an empty selection. |
| `dateCalendar` | [w17 · Inline and popup calendars](../src/gramlot_examples/pages/01-inputs/06-dates_and_times/03-date_calendar.md) | Choose a day in the inline calendar, then open the popup calendar. Both calendars and the text field follow the same date. |

### layout

| Component | Primary lesson | Teaching evidence / remaining work |
| --- | --- | --- |
| `transformPane` | [transform-pane · Move, rotate and zoom a card](../src/gramlot_examples/pages/05-containers/09-transform_pane.md) | Drag the stage, change the angle and zoom fields, compare the bound pose, then reset it without losing the note. Two-touch gestures are described separately from mouse verification. |
| `dialog` | [dialog_window · Dialog: modal editing](../src/gramlot_examples/pages/05-containers/04-dialog.md) | Open the dialog and try the background counter: it is blocked until you close the dialog. Edit the title, close and reopen: the draft is retained. |
| `floatingPane` | [floating_window · Floating: keep the page usable](../src/gramlot_examples/pages/05-containers/05-floating.md) | Open the floating window, then use the background counter. Both remain usable. Edit the title and watch the page update; close and reopen to keep the same draft. |
| `framePane` | [menu-05 · Frame regions and commands](../src/gramlot_examples/pages/05-menus/06_frame_pane.md) | Click Top, Left and Bottom; compare sender and target, then test the nested frame. |
| `trayPane` | [tray-workspace · Tray workspace](../src/gramlot_examples/pages/05-containers/07-tray.md), [gallery-tray · Gallery tray](../src/gramlot_examples/pages/05-containers/08-gallery_tray.md) | Move, resize, select, collide, change layers, snap, lock, save and restore cards. |
| `formlet` | [w19 · Arrange fields with formlet](../src/gramlot_examples/pages/01-inputs/07-forms_and_validation/02-formlet.md) | Switch between one and two columns. The same fields move without losing their values; the note keeps its own label-position override. |
| `groupBox` | [w20 · groupBox: group fields and copy Data](../src/gramlot_examples/pages/05-containers/06-group_box.md) | Edit the customer, then use the group's copy command. Only that datapath is copied; the note in the other group is excluded. TYTX preserves types. |
| `contentPane` | [l01 · Border regions and splitters](../src/gramlot_examples/pages/05-containers/01-border/01-border.md) | Resize Filters and Details while editing the customer. The center takes the remaining space and the summary follows accepted Data. |
| `borderContainer` | [l01 · Border regions and splitters](../src/gramlot_examples/pages/05-containers/01-border/01-border.md) | Resize Filters and Details while editing the customer. The center takes the remaining space and the summary follows accepted Data. |
| `stackContainer` | [l08 · Switch pages in a single stack](../src/gramlot_examples/pages/05-containers/03-stack.md) | Use the slider above the stack to visit a demo, edit it and return later. There is one central stack; a visited page keeps its state. |
| `tabContainer` | [l07 · Tabs](../src/gramlot_examples/pages/05-containers/02-tabs.md) | Write an invalid one-character customer name, switch tabs and return. The draft remains. Close Notes and compare the retained Data; expand the reference to compare styles. |

### buttons

| Component | Primary lesson | Teaching evidence / remaining work |
| --- | --- | --- |
| `button` | [w22 · Buttons: icons, labels and commands](../src/gramlot_examples/pages/01-inputs/08-buttons/01-button.md) | Confirm the first command, then click the delayed command several times quickly. Its result reports one execution for the burst of clicks. |
| `toggleButton` | [w23 · Toggle buttons and selection state](../src/gramlot_examples/pages/01-inputs/08-buttons/02-toggle_button.md) | Toggle Enabled and compare its checkbox. Then try Read only and Disabled: the command's state and whether you can edit it are separate concerns. |
| `dropDownButton` | [w24 · Dropdown buttons and command menus](../src/gramlot_examples/pages/01-inputs/08-buttons/03-dropdown_button.md) | Open Export and choose CSV. Repeat with Shift held: the command also becomes the main action. The unavailable item cannot execute. |
| `menu` | [menu-02 · Menu presentations](../src/gramlot_examples/pages/05-menus/01_presentations.md) | Compare one hierarchy in four presentations, opening nested submenus. |
| `menuline` | [menu-02 · Menu presentations](../src/gramlot_examples/pages/05-menus/01_presentations.md) | Compare one hierarchy in four presentations, opening nested submenus. |
| `spacer` | [menu-03 · Toolbar groups and overflow](../src/gramlot_examples/pages/05-menus/02_toolbar.md) | Shrink horizontal and vertical bars; compare priority, retained groups and overflow. |

### tree

| Component | Primary lesson | Teaching evidence / remaining work |
| --- | --- | --- |
| `tree` | [w26 · Browse hierarchical Data with a tree](../src/gramlot_examples/pages/01-inputs/09-tree/01-basics.md) | Expand Catalog to request its children, then select a row. Add or rename a document and watch the tree follow changes in its Bag. |
| `rowActions` | [tree-row-actions · Act without selecting](../src/gramlot_examples/pages/01-inputs/09-tree/06-row_actions.md) | Keep Notes selected while acting on Checklist, then use Archive’s row menu. Compare selected and acted-on paths. |

### editors

| Component | Primary lesson | Teaching evidence / remaining work |
| --- | --- | --- |
| `codeMirror` | [code_mirror · Code editor](../src/gramlot_examples/pages/06-editors/01-base.md) | Edit the draft and save a snapshot. Keep typing: the live draft changes while the saved version stays unchanged until you save again. |
| `htmlEditor` | [html_editor · HTML editor](../src/gramlot_examples/pages/06-editors/03-html.md) | Edit the code, then switch to Preview and Rich text. The three views share one draft; Preview displays the HTML without running its scripts. |
| `htmlPreview` | [html_editor · HTML editor](../src/gramlot_examples/pages/06-editors/03-html.md) | Edit the code, then switch to Preview and Rich text. The three views share one draft; Preview displays the HTML without running its scripts. |
| `markdownEditor` | [markdown_editor · Markdown editor](../src/gramlot_examples/pages/06-editors/04-markdown.md) | Edit a heading and compare Code, Preview and Rich text. The views share the same Markdown; use Code for complex blocks. |
| `markdownPreview` | [markdown_editor · Markdown editor](../src/gramlot_examples/pages/06-editors/04-markdown.md) | Edit a heading and compare Code, Preview and Rich text. The views share the same Markdown; use Code for complex blocks. |

### typst

| Component | Primary lesson | Teaching evidence / remaining work |
| --- | --- | --- |
| `typstPreview` | [typst_editor · Typst and PDF](../src/gramlot_examples/pages/06-editors/05-typst.md) | Edit the sample document and inspect its preview, then generate the PDF. Compilation runs locally; this example uses bundled fonts and no external includes. |

<a id="ge-035-015"></a>
## 015 · Shared features and observable behaviors

This checklist is intentionally finer than the component inventory. Its selected
behaviors are not an exhaustive denominator for Gramlot. **Exercise** means the
explanation supplies an action/comparison; runtime, accessibility and failure-path
verification remain separate work.

| Feature | State | Example / evidence | What the reader should establish |
| --- | --- | --- | --- |
| HTML nesting and text | **Exercise** | [e01 · Hello, Gramlot!](../src/gramlot_examples/pages/00-html_svg/01-html_basics/01-hello_world.md) | One builder call creates one element; change a paragraph. |
| `transformPane` | **Exercise** | [transform-pane · Move, rotate and zoom a card](../src/gramlot_examples/pages/05-containers/09-transform_pane.md) | Move, rotate and zoom through a shared Data pose. |
| Text, links and literal escaping | **Exercise** | [e03 · Children and styles](../src/gramlot_examples/pages/00-html_svg/01-html_basics/03-lists.md) | Observe literal text and an HTML link. |
| HTML lists and nesting | **Exercise** | [e03 · Children and styles](../src/gramlot_examples/pages/00-html_svg/01-html_basics/03-lists.md) | A section contains a list built by a loop. |
| SVG shapes | **Exercise** | [e08 · HTML and SVG](../src/gramlot_examples/pages/00-html_svg/03-svg/01-svg_shapes.md) | Declare SVG shapes within Source. |
| Native HTML versus Gramlot component names | **Exercise** | [e06 · Labels and boxes](../src/gramlot_examples/pages/00-html_svg/02-native_controls/01-forms.md), [w01 · HTML and components](../src/gramlot_examples/pages/01-inputs/01-text/01-textbox.md), [w22 · Buttons: icons, labels and commands](../src/gramlot_examples/pages/01-inputs/08-buttons/01-button.md) | Compare input/html_button with textbox/button on one Data value; try shared labels, live editing, read only and both Clear actions. |
| Shared lbl/box on ordinary HTML, div and components | **Used** | [tray-workspace · Tray workspace](../src/gramlot_examples/pages/05-containers/07-tray.md), [w19 · Arrange fields with formlet](../src/gramlot_examples/pages/01-inputs/07-forms_and_validation/02-formlet.md) | Tray and formlet use labels; add a minimal standalone HTML Labelbox exercise. |
| Separate style attributes versus HTML attributes | **Exercise** | [b06 · Styles and visibility](../src/gramlot_examples/pages/02-binding/03-presentation/01-style_and_visibility.md) | Change class, width and visibility through Data. |
| Absolute, relative and symbolic Data paths | **Exercise** | [b01 · Binding paths](../src/gramlot_examples/pages/02-binding/01-paths_and_updates/01-pointers.md) | Compare subscribed ^ with non-subscribed = and anchor paths. |
| Data node attributes (?attribute) | **Exercise** | [b01 · Binding paths](../src/gramlot_examples/pages/02-binding/01-paths_and_updates/01-pointers.md) | Observe the displayed role attribute independently of the node value. |
| Relocatable datapath | **Exercise** | [b02 · Switch records](../src/gramlot_examples/pages/02-binding/01-paths_and_updates/02-variable_datapath.md), [color_maker · Reusable color maker](../src/gramlot_examples/pages/08-composition/01-color_maker.md) | Change the current record or reuse a helper with independent Data. |
| Default versus explicit dataSetter | **Exercise** | [b03 · Defaults and setters](../src/gramlot_examples/pages/02-binding/01-paths_and_updates/03-setters_and_defaults.md) | Distinguish missing Data from an existing value and an installation write. |
| Same-name initial TYTX Bag and paced Play | **Exercise** | [b12 · Load and replay Data](../src/gramlot_examples/pages/02-binding/01-paths_and_updates/foo.md) | Load/replay the sample values and compare manual edits. |
| Two-way editing and input/change timing | **Exercise** | [b04 · Edit shared Data with native fields](../src/gramlot_examples/pages/02-binding/02-editing/01-native_editing.md) | Type and blur; compare live updates and accepted values. |
| Checkbox and radio grouping | **Exercise** | [b05 · Booleans and single choices](../src/gramlot_examples/pages/02-binding/02-editing/02-checkbox_radio.md), [w06 · Individual radio buttons](../src/gramlot_examples/pages/01-inputs/03-selection/02-radio_button.md) | Observe selection and the Data values, including exclusivity. |
| Bound SVG attributes | **Exercise** | [b07 · Update SVG from Data](../src/gramlot_examples/pages/02-binding/03-presentation/02-bound_svg.md), [b10 · Bind SVG geometry and color](../src/gramlot_examples/pages/02-binding/03-presentation/03-svg_shapes.md) | Change Data and observe the same drawing update. |
| FrameGrid with Bag rows | **Exercise** | [menu-15 · FrameGrid · complete example](../src/gramlot_examples/pages/05-grid/06_frame_grid.md) | Change the external gallery theme, scroll below the headers and update or remove an order through the shared bar. |
| Freeze versus ordinary reactive updates | **Exercise** | [b08 · Defer structural updates with freeze](../src/gramlot_examples/pages/02-binding/01-paths_and_updates/04-freeze.md), [c15 · Start and dispose page behavior](../src/gramlot_examples/pages/03-controllers/03-events/02-lifecycle.md) | Freeze structural projection; observe continued Data updates and thaw. |
| Formula dependencies and non-triggering reads | **Exercise** | [c01 · Calculate a value with dataFormula](../src/gramlot_examples/pages/03-controllers/01-logic/01-formula.md) | Change a ^ argument, then a = argument; compare recomputation. |
| Controllers and named Logic | **Exercise** | [c02 · Data controllers](../src/gramlot_examples/pages/03-controllers/01-logic/02-controller.md), [c03 · Organize behavior in a Logic class](../src/gramlot_examples/pages/03-controllers/01-logic/03-named_logic.md) | Trigger named behavior from Data; distinguish server Page from browser Logic. |
| Inline expressions and pointer transforms | **Exercise** | [c04 · Use short inline expressions](../src/gramlot_examples/pages/03-controllers/01-logic/04-inline_expressions.md), [c22 · Binding expressions](../src/gramlot_examples/pages/03-controllers/01-logic/06-pointer_transforms.md) | Compare expressions with formatted presentation and unchanged Data. |
| GET, SET, PUT, FIRE and FIRE_AFTER | **Exercise** | [c05 · Call methods on a Source node](../src/gramlot_examples/pages/03-controllers/01-logic/05-node_methods.md) | Predict notification counts and delayed fire cancellation. |
| Events and attribute projection | **Exercise** | [c07 · Handle browser and component events](../src/gramlot_examples/pages/03-controllers/03-events/01-events.md), [c16 · Project attributes and preview HTML](../src/gramlot_examples/pages/03-controllers/03-events/03-attribute_projection.md) | Observe event payloads and bound DOM attributes. |
| Lifecycle and provider cleanup | **Exercise** | [c15 · Start and dispose page behavior](../src/gramlot_examples/pages/03-controllers/03-events/02-lifecycle.md) | Compare init/built/start, then remove the branch and observe its timer stop. |
| Timer-driven animation | **Exercise** | [sieve · Prime sieve](../src/gramlot_examples/pages/08-composition/02-sieve.md) | Start, pause, single-step and reset; store writes drive the drawing. |
| Publish/subscribe and iframe messages | **Exercise** | [c18 · Publish and subscribe to messages](../src/gramlot_examples/pages/03-controllers/03-events/04-publish_subscribe.md), [c19 · Exchange messages between frames](../src/gramlot_examples/pages/03-controllers/03-events/05-frame_messages.md) | Publish and compare local versus frame delivery. |
| Action confirmation, references and delay | **Exercise** | [c20 · Confirm and target actions](../src/gramlot_examples/pages/03-controllers/02-actions/02-actions_ask_references.md), [c21 · Delayed actions](../src/gramlot_examples/pages/03-controllers/02-actions/03-plain_and_delayed_buttons.md) | Confirm or cancel and compare immediate/delayed actions. |
| Endpoint calls on demand and on Data change | **Exercise** | [c09 · Define and call a server endpoint](../src/gramlot_examples/pages/04-rpc/01-server_calls/01-endpoint.md), [c10 · Call the server when a value changes](../src/gramlot_examples/pages/04-rpc/01-server_calls/02-call_on_change.md), [c11 · Call the server from a button](../src/gramlot_examples/pages/04-rpc/01-server_calls/03-call_on_click.md) | Observe the request result and trigger, not only the initial render. |
| Remote Source, caching and remote Data | **Exercise** | [c12 · Load a remote Source fragment](../src/gramlot_examples/pages/04-rpc/02-remote_data/01-remote.md), [c13 · Cache remote fragments](../src/gramlot_examples/pages/04-rpc/02-remote_data/02-cached_remote.md), [c14 · Fetch Data with dataRemote](../src/gramlot_examples/pages/04-rpc/02-remote_data/03-data_remote.md) | Distinguish structure from values; compare first read, cache and refresh. |
| Data exchange and typed values | **Exercise** | [c17 · Export and restore typed Data](../src/gramlot_examples/pages/04-rpc/03-data_exchange.md) | Serialize/reload a Data snapshot; do not mistake it for server persistence. |
| Validation: required, length and invalid drafts | **Exercise** | [w18 · Required values and length](../src/gramlot_examples/pages/01-inputs/07-forms_and_validation/01-validation.md), [w25 · Validation rules](../src/gramlot_examples/pages/01-inputs/07-forms_and_validation/04-validation_engine.md) | Keep accepted Data separate from a rejected field draft. |
| Validation: normalization, warning and blocking rule | **Exercise** | [w25 · Validation rules](../src/gramlot_examples/pages/01-inputs/07-forms_and_validation/04-validation_engine.md) | Try uppercase normalization and switch a warning to a blocking error. |
| Validation: callbacks, remote checks and lifecycle | **Exercise** | [w25 · Validation rules](../src/gramlot_examples/pages/01-inputs/07-forms_and_validation/04-validation_engine.md) | Try reserved names; observe pending, accept and reject behavior. |
| Form state | **Exercise** | [form-state · Form state](../src/gramlot_examples/pages/01-inputs/07-forms_and_validation/05-form_state.md) | Compare net changes, required errors, incomplete typed text, pending validation and local snapshot restore. |
| Formlet columns and shared label alignment | **Exercise** | [w19 · Arrange fields with formlet](../src/gramlot_examples/pages/01-inputs/07-forms_and_validation/02-formlet.md) | Change columns without losing fields or drafts. |
| GroupBox copy to TYTX/JSON | **Exercise** | [w20 · groupBox: group fields and copy Data](../src/gramlot_examples/pages/05-containers/06-group_box.md) | Copy the group Data only; compare type/attribute preservation. |
| Border regions, splitters and nested layouts | **Exercise** | [l01 · Border regions and splitters](../src/gramlot_examples/pages/05-containers/01-border/01-border.md), [l02 · Nested borders and layout designs](../src/gramlot_examples/pages/05-containers/01-border/02-nested.md), [l05 · Nested regions playground](../src/gramlot_examples/pages/05-containers/01-border/05-nested_lab.md) | Resize regions and compare remaining center space. |
| Drawers and retained Data | **Exercise** | [l04 · Drawers](../src/gramlot_examples/pages/05-containers/01-border/04-drawer_handles.md) | Close/reopen a drawer and retain the edited content. |
| Container events | **Exercise** | [l06 · Border events and controllers](../src/gramlot_examples/pages/05-containers/01-border/06-border_events.md) | Observe region notifications and their payloads. |
| Tabs: orientation, badges, closing and veto | **Exercise** | [l07 · Tabs](../src/gramlot_examples/pages/05-containers/02-tabs.md) | Switch/close tabs and compare retained content and close guards. |
| Stack selection | **Exercise** | [l08 · Switch pages in a single stack](../src/gramlot_examples/pages/05-containers/03-stack.md) | Change the selected page in one retained stack. |
| Detach/reattach without rebuilding content | **Used** |  | Gallery Code has this behavior; add a dedicated retained-state example. |
| Dialog modality versus nonmodal floating | **Exercise** | [dialog_window · Dialog: modal editing](../src/gramlot_examples/pages/05-containers/04-dialog.md), [floating_window · Floating: keep the page usable](../src/gramlot_examples/pages/05-containers/05-floating.md) | Try the background while each window is open. |
| Window move, resize, collapse, maximize and restore | **Review** | [menu-09 · Window commands](../src/gramlot_examples/pages/05-menus/09_windows.md), [menu-10 · Complete dialog editor](../src/gramlot_examples/pages/05-menus/10_dialog_editor.md), [menu-14 · Complete floating editor](../src/gramlot_examples/pages/05-menus/14_floating_editor.md) | Recheck each interaction explicitly, including collapsed modal behavior. |
| Menu hierarchy, separators, icons and keyboard | **Exercise** | [menu-02 · Menu presentations](../src/gramlot_examples/pages/05-menus/01_presentations.md), [menu-08 · Classic menu bar and hierarchy](../src/gramlot_examples/pages/05-menus/04_menu_bar.md) | Open nested submenus and navigate with arrows/Escape. |
| Context menu and exact opening modifiers | **Exercise** | [menu-02 · Menu presentations](../src/gramlot_examples/pages/05-menus/01_presentations.md) | Compare right-click, ordinary click and Shift+click. |
| Menu checked, disabled and hidden bindings | **Exercise** | [menu-04 · Reactive menu states](../src/gramlot_examples/pages/05-menus/05_live_states.md) | Change Data and compare popup and toolbar states. |
| Command registration and namespace | **Used** | [menu-01 · Complete document workspace](../src/gramlot_examples/pages/05-menus/08_workspace.md) | Collection supplies commands; add a tiny registration-to-receiver lesson. |
| Command sender, target, parameters and modifiers | **Exercise** | [menu-05 · Frame regions and commands](../src/gramlot_examples/pages/05-menus/06_frame_pane.md) | Compare outer and nested frame recipients and Shift activation. |
| Menu resolver and lazy submenus | **Exercise** | [menu-06 · Resolver menus and nested Bags](../src/gramlot_examples/pages/05-menus/07_resolver.md) | Open lazy submenus; compare loaded Bags and retry. |
| Toolbar groups, spacers, priorities, overflow and scroll | **Exercise** | [menu-03 · Toolbar groups and overflow](../src/gramlot_examples/pages/05-menus/02_toolbar.md) | Shrink the available area and preserve each indivisible group. |
| Toolbar icon modes, SVG and selected appearance | **Exercise** | [menu-07 · Vertical icon toolbar](../src/gramlot_examples/pages/05-menus/03_vertical_toolbar.md) | Compare large icons, tooltip labels and selection in a vertical bar. |
| Tree Bag, selection, lazy branches and Data changes | **Exercise** | [w26 · Browse hierarchical Data with a tree](../src/gramlot_examples/pages/01-inputs/09-tree/01-basics.md) | Expand Catalog, select, then insert or rename a document. |
| Tree caption/icon callbacks and sanitized labels | **Exercise** | [w27 · Customize tree labels and row styles](../src/gramlot_examples/pages/01-inputs/09-tree/02-labels_and_classes.md), [w28 · Tree icons and computed captions](../src/gramlot_examples/pages/01-inputs/09-tree/03-callbacks_and_icons.md) | Compare captions, classes, callback icons and Data. |
| Tree drag/drop types and target acceptance | **Exercise** | [w29 · Copy tree nodes with drag and drop](../src/gramlot_examples/pages/01-inputs/09-tree/04-internal_drag.md) | Copy a document to an accepted folder; reject the locked destination. |
| Tree checkboxes | **Exercise** | [tree-checkboxes · Tree checkboxes](../src/gramlot_examples/pages/01-inputs/09-tree/05-checkboxes.md) | Check a branch before loading its children; clear checks without changing disabled nodes. |
| Tree searchText and restoration of unloaded branches | **Used** |  | Gallery navigation uses it; add a lesson showing lazy search, clear and restoration. |
| Code editor options and retained draft | **Exercise** | [code_mirror_options · Editor options](../src/gramlot_examples/pages/06-editors/02-options.md) | Change wrapping/font; distinguish configuration from document replacement. |
| HTML editing, preview and protected content | **Exercise** | [html_editor · HTML editor](../src/gramlot_examples/pages/06-editors/03-html.md) | Compare Code, Preview and Rich text bound to one value. |
| Markdown editing, preview, undo and embedded HTML | **Exercise** | [markdown_editor · Markdown editor](../src/gramlot_examples/pages/06-editors/04-markdown.md) | Compare shared views; toggle sanitized embedded HTML. |
| Typst/PDF preview | **Exercise** | [typst_editor · Typst and PDF](../src/gramlot_examples/pages/06-editors/05-typst.md) | Edit the source and observe the compiled preview. |
| Live Source insertion, updates and removal | **Exercise** | [e13 · Live Source playground](../src/gramlot_examples/pages/07-tools/01-live_source.md) | Add/remove nodes and compare attributes, data and timer lifetime. |
| Tray movement, resize, layer collision, rotation and zoom | **Exercise** | [tray-workspace · Tray workspace](../src/gramlot_examples/pages/05-containers/07-tray.md), [gallery-tray · Gallery tray](../src/gramlot_examples/pages/05-containers/08-gallery_tray.md) | Move transformed cards; same-layer contact differs from cross-layer overlap. |
| Tray multi-selection, marquee, snapping and lock | **Exercise** | [tray-workspace · Tray workspace](../src/gramlot_examples/pages/05-containers/07-tray.md) | Move a selection together, use Shift snapping, then lock only arrangement. |
| Tray layout Bag save/restore | **Exercise** | [tray-workspace · Tray workspace](../src/gramlot_examples/pages/05-containers/07-tray.md) | Restore geometry and settings while retaining card contents; no disk persistence. |
| Reusable helpers and loops | **Exercise** | [color_maker · Reusable color maker](../src/gramlot_examples/pages/08-composition/01-color_maker.md), [sieve · Prime sieve](../src/gramlot_examples/pages/08-composition/02-sieve.md) | Trace small helpers and independent datapaths in Python and JavaScript. |
| Theme, palette, light/dark and touch density | **Exercise** | [l09 · Compare desktop and touch themes](../src/gramlot_examples/pages/05-containers/03-mela.md) | Compare fields, menus and windows without changing their Data. |
| Custom component definition and collection packaging | **Gap** |  | Core manual has the tutorial; add a runnable authoring example when a bounded scope is agreed. |
| Collection overrides and dependency/resource failures | **Gap** |  | Covered by contracts/tests, not by a common gallery exercise. |
| Per-instance state isolation across several IDEs | **Gap** |  | Host IDE is outside this catalogue; add a focused isolation exercise if teaching this contract. |
| Persist/restore layout across a page reload | **Gap** |  | Tray Save is page-local. Server persistence is an application responsibility, not silently demonstrated. |

### Grid · Generic

| Feature | Status | Lessons | Exercise |
| --- | --- | --- | --- |
| Basic grid · Bag values | **Exercise** | [grid-01 · Basic grid · Bag values](../src/gramlot_examples/pages/05-grid/01_basic.md) | Start with three columns and a Bag whose row values are Bags. |
| Rows as attributes | **Exercise** | [grid-02 · Rows as attributes](../src/gramlot_examples/pages/05-grid/02_attributes.md) | Read the same kind of records from node attributes, with typed numeric and boolean cells. |
| Column groups and row heights | **Exercise** | [grid-03 · Column groups and row heights](../src/gramlot_examples/pages/05-grid/03_colgroups.md) | Group columns, display multiline notes and resize individual rows. |
| Multicolumn sort and row drag | **Exercise** | [grid-04 · Multicolumn sort and row drag](../src/gramlot_examples/pages/05-grid/04_ordering.md) | Sort raw Bag values with multiple criteria, then set a manual row order. |
| Two grids, independent views | **Exercise** | [grid-05 · Two grids, independent views](../src/gramlot_examples/pages/05-grid/05_shared_store.md) | Sort, filter or reorder either grid independently. Both views share the same Bag records and follow data changes. |
| Grid typed search | **Exercise** | [grid-07 · Search · text, numbers and dates](../src/gramlot_examples/pages/05-grid/07_search.md) | Choose text, numeric or date columns, use typed comparisons, then clear the filter without losing sorting. This is local searchOn over the resident Bag. |
| Grid toolbar tools | **Exercise** | [grid-toolbar-tools · Toolbar tools · export, print and line numbers](../src/gramlot_examples/pages/05-grid/14_toolbar_tools.md) | Search, export the visible rows as CSV, JSON, TYTX, XML or Excel, print them and toggle the line numbers. |
| Grid selection | **Exercise** | [grid-selection · Selection · none, single and multi](../src/gramlot_examples/pages/05-grid/15_selection.md) | Switch selectionMode, select with click, Ctrl/Cmd, Shift and keys, and read the published selected paths. |
| Grid row tools | **Exercise** | [grid-row-tools · Row tools · add, duplicate and delete](../src/gramlot_examples/pages/05-grid/16_row_tools.md) | Add a row with defaults, duplicate or delete the selection and watch the editing status. |
| Grid row formulas | **Exercise** | [grid-row-formulas · Row formulas · totals, VAT and chains](../src/gramlot_examples/pages/05-grid/17_row_formulas.md) | Edit a quantity or the page VAT and watch a chain of three Decimal formulas recalculate. |
| Grid numbering and running sums | **Exercise** | [grid-numbering · Numbering and running sums](../src/gramlot_examples/pages/05-grid/18_numbering.md) | Number rows, accumulate a running sum and see the numbering restart for a sorted or filtered view. |
| Grid footer totals | **Exercise** | [grid-footer-totals · Footer totals](../src/gramlot_examples/pages/05-grid/19_footer_totals.md) | Read the footer sums and the same total in page Data; a search leaves the totals unchanged. |
| Grid resident virtualization | **Exercise** | [grid-08 · Scroll · 1,000 resident rows](../src/gramlot_examples/pages/05-grid/08_virtual_scroll.md) | Scroll 1,000 loaded records with bounded DOM rows. Resize a row and compare local search and multicolumn sorting. All records remain in browser Data; this is not server paging. |
| Grid resize in a floating pane | **Exercise** | [grid-09 · Floating grid · resize and scroll](../src/gramlot_examples/pages/05-grid/09_floating_scroll.md) | Resize the floating pane and scroll to the last row. Variable row heights and the row-number gutter belong to the same retained Grid. |

### Grid · Data loading

| Feature | Status | Lessons | Exercise |
| --- | --- | --- | --- |
| Grid with a resident database selection | **Exercise** | [base-asqueel-03 · Grid on a database query](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/base/pages/82-grid-database/02-invoice_rows.md) | The Grid consumes an ordinary Bag and does not depend on an ORM. This Python example loads invoice rows with related customers and products through dataRpc and an Asqueel service; scroll, search and sort run locally. |
| Grid typed JSONL loading | **Review** | [selection-trial-02 · Selection trial · progressive JSONL / HTTP](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/base/pages/83-selection-trials/02-jsonl.md) | Local Python/Kajenn experiment: TYTX iterators retain typed values while building an isolated Bag. Only a complete stream replaces the selection; failed, cancelled or superseded loads retain the previous Bag. JSONL is not a general dataRpc transport contract. |

### Grid · Asqueel only

| Feature | Status | Lessons | Exercise |
| --- | --- | --- | --- |
| Asqueel cachedFetch and bounded windows | **Review** | [asqueel-only-01 · Asqueel only · cached invoice rows](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/base/pages/84-cached-selection/01-invoice_rows.md) | Local Asqueel-only experiment. Up to the configurable threshold (1,000 actual rows by default) selections are resident. Above it the database materializes the selection and the browser normally retains 200 rows. Unloaded row heights are estimated. |
| Asqueel server search and sort | **Review** | [asqueel-only-01 · Asqueel only · cached invoice rows](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/base/pages/84-cached-selection/01-invoice_rows.md) | Search matches words across text columns on the server; it is not typed searchOn. Header clicks request server sorting, Shift adds criteria. Search and sort return to the beginning; obsolete responses cannot replace the current selection. |
| Asqueel selection snapshot lifecycle | **Review** | [asqueel-only-01 · Asqueel only · cached invoice rows](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/base/pages/84-cached-selection/01-invoice_rows.md) | Reload refreshes the database snapshot; closing the page releases its cache. There is no live refresh or automatic TTL after a process crash. This experiment requires a dedicated cache-writable database configuration. |


### Upload integration and shared editing

| Feature | Evidence | Examples | What to try |
| --- | --- | --- | --- |
| Grid editing | **Exercise** | [grid-10 · Editing · drafts and validation](../src/gramlot_examples/pages/05-grid/13_editing.md) | Edit rows, scroll away and back, inspect validation and restore the session. |
| Upload queue | **Exercise** | [upload_queue · Upload queue and metadata](../src/gramlot_examples/pages/01-uploader/02-upload_queue.md) | Choose files, edit metadata and start uploads. |
| Attachments | **Exercise** | [attachment_manager · Attachments](../src/gramlot_examples/pages/01-uploader/03-attachment_manager.md) | Save the record, then upload, preview and remove attachments. |
| Image editing | **Exercise** | [editable_image · Editable images](../src/gramlot_examples/pages/01-uploader/04-editable_image.md) | Frame an image and confirm its local or application upload result. |
| Visual Source editor | **Exercise** | [visual_source · Visual editor](../src/gramlot_examples/pages/07-tools/02-visual_source.md) | Insert widgets, edit parameters and copy or import Source branches. |


<a id="ge-035-020"></a>
| Customer sets | [grid-check-sets · Customer sets](../src/gramlot_examples/pages/05-grid/10_check_sets.md) | Create customer sets, intersect John and Fred, and combine their membership with grid search on a complete Bag. |
| Column filters | [grid-column-filters · Column filters](../src/gramlot_examples/pages/05-grid/11_column_filters.md) | Distinct values, self-excluding counts and multiple selections combined with search and sets. |
| Single choice | [grid-primary-supplier · Primary supplier](../src/gramlot_examples/pages/05-grid/12_primary_supplier.md) | Choose one supplier with a radio column and keep its scalar ID in the product record, including when filtered or unloaded. |
| Charts and time | [grid-charts · Charts and time](../src/gramlot_examples/pages/05-charts/05-snapshots.md) | Shared chart configuration, rendering engines and monthly playback from a Data Bag. |



### Charts

| Feature | Status | Example |
| --- | --- | --- |
| Reactive chart data | Exercise | [chart-bars · Bars and live data](../src/gramlot_examples/pages/05-charts/01-bars.md) |
| Lines and engines | Exercise | [chart-trends · Lines and areas](../src/gramlot_examples/pages/05-charts/02-trends.md) |
| Shares | Exercise | [chart-shares · Pie and donut](../src/gramlot_examples/chart_gallery/pages/01-simple/01-shares.md) |
| Scatter | Exercise | [chart-points · Scatter points](../src/gramlot_examples/chart_gallery/pages/01-simple/02-points.md) |
| Categorical 3D | Exercise | [chart-bars-3d · 3D bars](../src/gramlot_examples/chart_gallery/pages/02-3d/01-bars_3d.md) |
| Numeric 3D | Exercise | [chart-surface · Points and surfaces](../src/gramlot_examples/chart_gallery/pages/02-3d/02-surface.md) |
| GeoJSON maps | Exercise | [chart-territories · Territories](../src/gramlot_examples/chart_gallery/pages/03-maps/01-territories.md) |


## 020 · Code clarity is a separate checklist

A small line count is a useful signal, not an acceptance criterion. A single
300-character inline action is harder to read than a short named method. A tiny
wrapper can hide a large imported implementation. Repetition belongs in a helper
and a loop **only when that makes the lesson easier to understand**.

For each lesson's next review:

- [ ] State one primary learning objective and its prerequisites.
- [ ] Explain one action and the visible expected result before the demo.
- [ ] Keep `main` an understandable composition; give separate ideas named helpers.
- [ ] Prefer relative datapaths; reuse a helper without sharing accidental state.
- [ ] Keep Data examples in TYTX, UI defaults on controls, setters only when relevant.
- [ ] Keep reusable behavior in named Logic; avoid long inline bodies and hidden setup.
- [ ] Show equivalent Python/JS behavior and explain their execution locations.
- [ ] Check error/empty/disabled behavior when that is the lesson's subject.
- [ ] Check desktop/mobile layout, readable code, focus and useful scrolling.
- [ ] Show the exact behavior tested; a passing load is not a usability review.

No lesson has been awarded a blanket “perfect” status in this audit.

<a id="ge-035-025"></a>
## 025 · Concrete simplification queue

Counts below are physical source lines, including blank/comment lines. Method
sizes come from the Python AST. They are diagnostic measurements, not targets.
JavaScript includes the page and its browser Logic. These measurements describe
this baseline and must be refreshed after editing the examples.

| Lesson | Python file | Largest Python method | JS file | Recommended review |
| --- | ---: | --- | ---: | --- |
| [menu-03 · Toolbar: groups, priority and overflow](../src/gramlot_examples/pages/05-menus/02_toolbar.md) | 128 | `priority_bar`: 15 lines | 163 | Completed this tranche: main composes named exercises; priority, movable inputs, scrolling and vertical overflow remain separate helpers. |
| [b09 · Bound forms](../src/gramlot_examples/pages/02-binding/02-editing/03-forms.md) | 79 | `choice_fields`: 18 lines | 89 | Completed: main composes three field groups and the Data view. Native types, states and bindings are retained. |
| [menu-14 · Complete floating editor](../src/gramlot_examples/pages/05-menus/14_floating_editor.md) | 103 | `main`: 20 lines | 136 | Completed this tranche: frame regions, draft fields and saved summary are separated; draft_commands is reused. Background editing remains explicit. |
| [l05 · Nested regions playground](../src/gramlot_examples/pages/05-containers/01-border/05-nested_lab.md) | 95 | `workspace`: 56 lines | 249 | Separate each border design and its controls; put the combined lab after the basic lesson. |
| [l07 · Tabs](../src/gramlot_examples/pages/05-containers/02-tabs.md) | 139 | `variant_card`: 21 lines | 200 | Completed: workspace panels, options, events and reusable variant cards have separate methods. All 14 reference cards remain. |
| [menu-10 · Complete dialog editor](../src/gramlot_examples/pages/05-menus/10_dialog_editor.md) | 99 | `main`: 16 lines | 132 | Completed this tranche: frame regions, draft fields and saved summary are separated; top bar and submenu reuse draft_commands. |
| [l06 · Border events and controllers](../src/gramlot_examples/pages/05-containers/01-border/06-border_events.md) | 57 | `main`: 47 lines | 107 | Separate layout and event display; reduce repeated explanatory wiring. |
| [w25 · Validation rules, warnings and callbacks](../src/gramlot_examples/pages/01-inputs/07-forms_and_validation/04-validation_engine.md) | 60 | `main`: 43 lines | 52 | Keep a basic validation example and an advanced rules laboratory; do not duplicate both blindly. |
| [color_maker · Color Maker: one block, three contexts](../src/gramlot_examples/pages/08-composition/01-color_maker.md) | 64 | `palette`: 15 lines | 69 | Good segmentation reference, but move the long Random action to named Logic and separate decorative SVG from teaching code. |

The Color Maker explanation also shows how to extract a helper into a module,
but the running lesson keeps its helper in the Page. Treat cross-module helper
reuse as a documented recipe, not a verified import exercise.

### Consolidation candidates, not deletion decisions

- Three theme wrappers (`menu-11`, `menu-12`, `menu-13`) reuse a comparison page.
  Consider one comparison lesson with selectable density, keeping the supported
  theme choices visible. Short wrapper files do not make three distinct concepts.
- Dialog and floating basics teach a meaningful difference: modality. Their full
  editors can share composition helpers while keeping that comparison explicit.
- Basic validation and the advanced validation engine have different objectives;
  clarify that progression rather than deleting the advanced rules.
- HTML basics may be presented as one overview with optional focused references.
  Lists, tables and semantic regions are different subjects, not automatic duplicates.

Do not delete a lesson until its unique coverage rows have another clear home.

### Visible quality issue reported during this audit

The owner's Semantic page screenshot shows Code using only part of the available
height, a clipped first line and several header bands before the source. Treat
this as a gallery presentation defect, independently of the lesson's API coverage.
The height defect is corrected: the gallery assigns remaining space to the
renderer-owned Labelbox (`box_flex`) and fills it with CodeMirror (`height="100%"`).
A 3 px inset remains. Chromium and WebKit checks cover viewport changes,
detach/reattach and tab switching, with the same editor instance and no outer
panel scrollbar. This correction does not redesign the header bands.

<a id="ge-035-030"></a>
## 030 · Scope and maintenance

The 112 common lessons are the denominator for the catalogue inventory. Python
host IDE/directory tools, the separate Capacitor mobile catalogue, deployment,
transport internals, all HTML/CSS vocabulary and every parameter combination are
not included in the 43-component count. They need separate coverage inventories.
Read the [widget reference](https://gramlot.readthedocs.io/en/latest/docs/public/345-widget-reference.html)
for the full parameter vocabulary.

When reviewing a feature, link its primary lesson, describe an observable action
and result, record an actual browser check separately, and list any missing edge
cases. If a feature has no lesson, retain an explicit Gap row unless it is
quarantined; quarantine is a maturity decision, not a request to add an example. If a lesson is
merged or removed, update its mappings before changing the catalogue. Keep this
checklist paired in docs and docs_llm and verify its links in the documentation build.


<a id="ge-035-035"></a>
## 035 · The feature-first gallery index

Owner confirmed three session states on 2026-10-27: To discover, Seen when a linked
example opens, and Tried only when the reader marks it. The Features entry, last in the gallery navigation (after native modules),
opens a compact capability tree in the same gallery, independently of the
lesson chapters. Short labels identify features; selecting a leaf shows its
explanation and links in an adjacent panel (below on narrow screens). Groups
contain component and behavior entries; an example may demonstrate several entries and an entry may
link several examples. Links reuse IndexPage navigation, resolvers and existing
tabs; they do not replace running frames.

The gallery's `features.json` stores stable feature identities and references to
existing catalogue keys. Keep feature IDs stable when changing their display titles
so saved session progress remains associated with the same feature. Titles and routes
of examples still come from the normal
catalogue. Keep that mapping and this audit aligned when adding or removing an
example. Its 111 feature entries describe capabilities across 112 lessons; these are
different inventories, not interchangeable coverage counts. The common catalogue is covered; native mobile and host
extensions still need their own feature inventories.

Feature leaves turn green when Seen or Tried; Tried also carries a check mark.
Branches show seen/available counts and turn green only when all available leaves
have been seen. Quarantined or unavailable entries do not inflate these counts.
The tree and selected detail are Data-backed, using ordinary tree and stackContainer.

Progress is held in `galleryIndex.featureProgress`, a Data Bag. Session storage is
only its snapshot for reload within the browser tab's session, not a second live
state store or an account-level learning record. Opening an example marks all its
linked features Seen without downgrading Tried. The reader can change or reset
each state. Missing exercises and quarantined components have no progress control.
Storage failures are visible and keep current progress in Data.

Quarantined dbSelect/dbComboBox remain visible as review work, with no lesson or
recommendation. Neither Seen nor Tried certifies correctness, mastery or test
coverage. The Code-panel layout issue recorded above is still separate work.


<a id="ge-035-090"></a>
## 090 · FrameGrid development addition — 2026-10-28

The catalogue adds menu-15 (FrameGrid), bringing the current inventory to 112
lessons and 111 feature entries. This bounded addition demonstrates resident Bag
rows, the shared frame/menu bars and external gallery themes. Python/JavaScript
Source parity and Chromium/WebKit checks cover this lesson; it does not claim a
new full-catalogue qualification. Grid editing, configurator and persistence are
not included. The earlier grammar audit is a dated baseline, not a fresh count of
the development grid collection.


<a id="ge-035-095"></a>
## 095 · Environment-aware Grid coverage

Owner request, 2026-10-30: review the new Grid work and distinguish generic features
from Asqueel-only features in the gallery index. No release is authorized here.

Feature links use the host's actual catalogue metadata in gallery Data and the
existing lazy navigation resolvers. Optional examples are explicitly unavailable
when their catalogue is absent. They do not enter progress counts, including when
sessionStorage contains progress from a previously enabled environment. Seen/Tried
records remain in Data; sessionStorage is only a reload snapshot.

JSONL and cachedFetch remain marked Review: successful local tests do not approve
a public streaming protocol or a general remote CollectionStore. Invoice application
integration and Python-to-serverless export remain outside this consolidation.
The invoice-row dataset used by these explicitly approved Grid trials is separate
from the excluded Invoice application gallery.


### Upload integration — 2026-11-01

The feature tree links **Upload queue**, **Attachments** and **Image editing** to
the three shared upload lessons. The HTTP binary path is currently supplied by
Uvicorn; Worker uploads pass from a local file in Chromium. WebKit currently
requires serving the export over HTTP because of its opaque-origin File/Worker
read limitation (GC-385 §080). Hosts without upload capability
are not presented as supporting application uploads. Camera and screen capture
remain dependent on device/browser capabilities and permission. These examples
do not define a storage or authentication service for applications.


<a id="ge-035-selector-caption-field"></a>
### Asqueel selector captions

The Base **State and customer** example (`81-asqueel/01-state_customers`) also
shows reactive `caption_field`: choose Full name or Code and observe that the
selected state identity and customer condition do not change. The default remains
server-owned; the override is checked against the exposed selector fields.


<a id="ge-035-chart-streaming"></a>
### Shared chart streaming trial — 2026-11-05

The page `pages/10-realtime/01-streaming` (Python and JavaScript, family Real-time;
moved from `base/pages/85-chart-reports/streaming` on 2026-11-06) uses chartPane with
engine=uplot, chartType=line and two numeric signals. The `Logic` of its page module generates sine samples in Data through the existing dataController _timing
contract. The store retains 600 rows, with 2/10/30/60 requested updates per second,
pause/resume and reset. No DOM application wiring, alternate chart configurator,
WebSocket transport or business calculations inside charts are introduced.
The chart drawer can compare ECharts, Plotly, Vega and uPlot on identical data.
uPlot currently exposes lines only; X must be numeric/date, distinct and ascending.
The observed-rate counter measures timer updates, not rendering FPS. This is
local streaming qualification, not a guarantee of high-frequency throughput.
Every gallery lists it under Real-time.


Temporal snapshot trial — 2026-11-05. The Python-first chart reports page time_snapshots.py supplies prepared region/month rows to the shared ChartPane. The core configurator owns date selection, calendar periods, slider and Play/Pause; no animation logic or aggregation lives in this example. uPlot requires Lines with numeric Rank as X. Browser qualification and limitations are tracked in core GC-070 / GC-470.


<a id="ge-035-australian-temporal-qualification"></a>
### Australian temporal report — 2026-11-05

The host-provided australian_timeline page composes standard FrameGrid(searchOn=True), ChartPane, Data Bags and dataRpc. Read-only server preparation offers month or day by territory, with revenue, invoices, quantity and distinct customers per period. Revenue and invoices are selected initially on independent axes; quantity can be added from the shared measure menu. No local search, chart, filtering or playback implementation exists. Temporal step slices prepared records and does not aggregate them; daily customer counts cannot be summed into distinct monthly customers. Select Lines/Rank for the numeric-X uPlot contract.

Qualified against 410,429 source invoice lines and 60,179 invoices dated 2022–2025. All source invoice and line totals reconcile at Decimal precision; browser measures use numeric values. The browser receives 384 monthly or 11,612 daily prepared rows, not 410,429 raw lines. No customer identifiers or raw invoice rows are committed. The connected gramlot-py-server provider and local chart_reports host own database access; run that host and open /australian_timeline.

Chromium/WebKit passed all four engines with three measures, Tasmania filtering and clearing, monthly/daily replacement, temporal cursor changes and screenshots. The search is the shared frameGrid control; this does not certify unrelated legacy pages. One measured local run: initial monthly load 1.58–1.95 s, daily reload 0.81–0.97 s; daily update median 33–34 ms and p95 at most 51 ms, filter 259–433 ms. Updates include two requestAnimationFrame callbacks and do not measure animation completion or pure render CPU time. Synchronous daily Data dispatch median was 3–7 ms. Small per-frame series (up to eight territories) do not establish large-point rendering throughput. No release or publication.


<a id="ge-035-australian-geography"></a>

### Australian geographic navigation — 2026-11-05

The australian_geography page shows Australia by State and opens the clicked State's ABS SAL 2021 suburb boundaries. Australia returns to the national map; year, map measure and shared grid search persist. The shared chart selectedTerritory binding carries ECharts/Plotly map clicks. Ordinary Source controllers/dataRpc perform the application navigation; no page DOM, manual event wiring or parallel request mechanism is present.

SalesGeography prepares one row per State or locality from a read-only invoice query. Exact suburb + State matching leaves ambiguous/unmatched localities in the grid and totals, with explicit coverage counts; only the owner-approved official State suffix is removed from SAL names before comparison; no fuzzy matching or compound-qualifier removal is applied. Nonspatial ABS records are excluded from map geometry. Suburb labels appear on hover to avoid urban overlaps. Boundaries load only for the chosen State. All eight State totals reconcile with the national 2025 total; 15,329 spatial polygons validate. Ten host sales tests and Chromium/WebKit two-engine navigation/retained-filter checks passed. No publication.

Reproduce: run `python scripts/download_australian_localities.py LOCALITIES_DIR` in gramlot-py-server; then run its existing `python -m gramlot_py_server.gallery.base.chart_reports --geojson AUSTRALIA_STATES_FILE --localities LOCALITIES_DIR --port 8903` and open `/australian_geography`. The existing national file must identify States by their full English names. `scripts/verify_sales_geography.mjs PLAYWRIGHT_ENTRY HOST_URL OUTPUT_DIR` runs the browser qualification.

Source: [ABS SAL 2021 MapServer](https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/SAL/MapServer). Download uses paginated GeoJSON queries, WGS84 output, four decimal places and 0.001-degree simplification; it is a display dataset, not legal boundary evidence. Downloaded public geometry stays in the supplied local directory rather than being bundled with Gramlot. Owner approved the State-suffix rule. For 2025, 553 of 681 active locality pairs match; Tasmania matches 93 of 97. Ambiguous or other unmatched names remain visible and contribute to totals.


<a id="ge-035-geographic-values-bars"></a>


### Geographic values and 3D columns — 2026-11-05

The Australian geography page now initializes readable name/value labels and Revenue as the selected column measure. The shared configurator offers labels (none/name/value/name+value), 2D graduated colors and ECharts-only “3D bars on map”. More measures can be selected with existing measure controls; colors remain configurable. All 3D measures share a height scale. “From zero” and “Data range” choose the baseline explicitly; data range is labelled as truncated. No page renderer or custom input implementation was added. Numeric tooltips retain source values; grey areas have no matched sales. Matching and SQL totals are unchanged.

Chromium/WebKit qualification passed for the two map engines, numeric labels/zoom, grouped 3D columns, scale selection and return to 2D. The host script `verify_sales_map_values.mjs PLAYWRIGHT_ENTRY HOST_URL OUTPUT_DIR` reproduces these checks and saves screenshots. Local preview remains `/australian_geography`. No publication.
