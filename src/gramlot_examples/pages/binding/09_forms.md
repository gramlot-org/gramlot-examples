# 09 · Forms with binding

The form from **Native forms** returns with its fields connected to one Data record. Edit a value and watch other views follow. You learn how binding replaces code that would otherwise copy values between controls and displays.

**Uses:** Source, Data, pointers and native binding — core 0.2.0. No endpoint calls.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Revisit the native form with one authoritative Data record.

**Before this lesson:** [e06 · Forms](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/html_svg/06_forms.md), [b03 · Setters and defaults](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/03_setters_and_defaults.md), [b04 · Native editing](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/04_native_editing.md), [b05 · Checkbox and radio](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/05_checkbox_radio.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **b09 · Forms with binding** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

The fieldsets are inherited conceptually from e06. Most initial values now live in `RECORD`; `dataSetter("form", RECORD)` populates it. The multiple select needs a list: `dataSetter(".topics", ["html"])` sets it directly. Putting that list inside `RECORD` would convert it recursively into a Bag. Each control and each summary entry bind to the same relative path. Intensity is live; ordinary text fields update on change.

```python
parent.input(type=kind, id=key, name=key, value=f"^.{key}", **attrs)
record.h2("The Data record")
```

Password is bound but deliberately absent from the summary, and so is the `frequency.daily` path: the summary lists only `frequency.weekly`. The file input, the read-only code and the disabled field are not bound. Boolean radio paths use the `frequency` group.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Compare initial Name, Quantity, Region and Topics with e06. They still describe Ada, 3, South and HTML.
2. Change Name and leave the field: the Data record shows the edit. Drag Intensity: its summary follows live.
3. Choose daily: weekly becomes false in Data.

## Change it and check yourself

Change `RECORD["quantity"]` from 3 to 5 and reload.

**Answer:** both Quantity and its summary begin at 5. You edit the initial record once; neither the input declaration nor its summary contains another copied numeric default.

## The same example across stages

**Earlier, e06:** the field call supplies `value="Ada Lovelace"`; checkbox/option declarations carry `checked`/`selected` flags.

**Later, 0.2.0:** the shared field helper supplies `value=f"^.{key}"`; defaults move to `RECORD`. A select supplies `value="^.region"` and its options no longer choose the selection individually.

The same initial information is declared centrally and reflected in multiple places. This removes duplicated state/update responsibility; it does not claim fewer total lines after adding the summary and interaction.

## Limits and next step

No native Reset is offered: native reset does not emit the input/change events needed to synchronize Data. Submit remains disabled. File selection has no bound Data value or upload; this is not a record/form persistence framework.

Continue with [b10 · SVG shapes with binding](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/10_svg_shapes.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-070) explains the full contract.

</details>
