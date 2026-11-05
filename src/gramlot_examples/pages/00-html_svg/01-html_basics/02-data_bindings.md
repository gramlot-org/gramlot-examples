# Data and bindings

## Try it

Type in the text input: the paragraph changes immediately. Hover over the paragraph
to see the same text as a tooltip. Move the slider: the paragraph fades without
changing its text. The message uses 48 px text so the opacity change is easy to see.

## Why these lines

`default` initializes the bound entry in the page's **Data store**, a Bag,
when it has no value yet; an existing value is preserved:
`message` contains text and `opacity` contains a number. Data is the current state
of the page; it is separate from the declarations that describe its interface.

`^message` connects a declaration to the `message` entry. On the HTML input,
`value` reads that entry and user edits write back to it. `live=True` in Python
(`live: true` in JavaScript) writes while typing or dragging, rather than waiting
for the control's change event.

The second input is also ordinary HTML: `type="range"` makes it a slider.
`min`, `max` and `step` are fixed attributes defining its range. Its `value`
is connected to `opacity`, so moving the slider updates that Data entry.
`lbl` supplies each visible label and automatically associates it with its input.
There is no need to repeat the label in an ARIA attribute.

`root.p("^message", ...)` connects the paragraph's **content** to Data.
Its `title="^message"` connects an **HTML attribute** to the same entry.
Its `opacity="^opacity"` connects a **style attribute** to the slider's entry.
One binding mechanism works for values, content and attributes; no event handler
or manual redraw is needed. The slider stops at 0.2 so the text stays visible.

## Look inside with Inspector

With this example open, choose **Inspector** in the gallery rail.
In **Data**, find `message` and `opacity`, then type and drag again: their values
change with the controls. In **Source**, find the two `input` nodes and the `p`
node. Inspect the paragraph's value and attributes: they contain the `^`
connections declared in the code.

Source describes what the page contains and how it is connected. Data contains
what those connections currently read. This distinction also applies to the
Gramlot components introduced after Fundamentals.
