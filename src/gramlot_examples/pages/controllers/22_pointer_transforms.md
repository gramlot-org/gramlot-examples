# 22 · Pointer templates and expressions

Resize a bar, enable a field and display an amount. The same typed Data drives all three: you learn when to produce text and when to keep a boolean or number.

**Uses:** Source, Data, attribute pointers and the page formatter — core 0.2.20. No Web Components or endpoint calls. Earlier lessons retain their release scope.

**Try it:** enter 80 in Width, then clear it. Turn Draft on to edit Name. Change Amount and compare the displayed text with the title shown on hover.

<details>
<summary>More detail</summary>

## One value, one template

Earlier lessons needed a supporting attribute to turn a number into CSS text:

```python
pane.div(width="${pixels}px", pixels="^.width")
```

The suffix expresses that same operation directly:

```python
pane.div(width="^.width:{}px")
```

Read `.width`, then replace `{}` in the text after `:`. A Data number 38 becomes the CSS string `38px`; Data still contains 38. The old multi-attribute template remains supported.

## An expression keeps its result type

```python
pane.input(value="^.name", readonly="^.draft:=!{}")
```

After `:=` comes a JavaScript expression. If Draft is false, `!{}` is true: Name is read-only. With Draft true it becomes editable. `:!{}` would create text instead, which is not the intended boolean result.

Keep `value` as a plain pointer: suffix transformations are not allowed on the widget value. They do not define how to convert edited text back into Data.

## Format first, mask second

For the content of a paragraph, ordinary attributes are the clearest choice:

```python
pane.p("^.amount", format="0.00", mask="Total: {} €")
```

`format` produces the number text using the page locale; `mask` wraps that text. This page declares `locale = "it-IT"`, so 1234.5 displays as `Total: 1234,50 €`.

For an attribute such as a tooltip, use the same formatter inside an expression:

```python
pane.p("Hover here", title="^.amount:=_F({}, {pattern: '0.00', mask: '{} €'})")
```

The first `{}` passes the typed amount. The quoted `'{} €'` is the mask passed to `_F`; it is not another pointer placeholder. `_F` calls this page's `gramlot.format` and does not create a global function.

## Empty values

An ordinary template slot requires a nonempty value. Null or an empty string makes the whole template null; the destination applies its usual null behavior. `0` and `False` are valid values. Use `{?}` to allow an empty string explicitly, for example `title="^.name:Customer: {?}"`. It still does not admit null.

Expressions receive typed values, including null. The standalone `mask` wraps formatted text; `gramlot.format(None)` returns empty text without applying the mask.

**Exercise:** change only `readonly="^.draft:=!{}"` to `readonly="^.draft"`. **Result:** the checkbox now has the opposite effect; the name binding does not change.

</details>
