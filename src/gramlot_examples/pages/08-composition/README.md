# Composition and reuse

Python pages are ordinary Python code. Methods, functions, imports and loops let you
build a useful interface from small, readable blocks. JavaScript pages use the same
composition model with functions and module imports.

Start with **Color Maker: one block, three contexts**. It builds one RGB editor three
times, for background, text and shadow. Each instance receives a different
`datapath`; the block itself knows only relative paths such as `^.red` and `.rgb`.

## What makes a block reusable?

- Pass the parent Source node to the function: it determines where the block lives.
- Bind local values with relative paths: the parent determines which Data it uses.
- Pass visible differences as arguments, such as a title and starting values.
- Avoid fixed DOM IDs and absolute Data paths inside the block.

Different datapaths give independent values. The same datapath deliberately shares
values. Neither creates a new widget type or requires registering a collection.
A collection is needed when you contribute new runtime components, not simply to
reuse a function that authors existing Source nodes.

## Move a method into a module

Extract `color_rgb(self, pane, title, rgb)` from the Color Maker into
`mywidgets.py`, remove `self`, and keep its body unchanged. Then use ordinary Python:

```python
from gramlot import Page as BasePage
from gramlot.collections.inputs import mygramlot as inputs
from mywidgets import color_rgb

class Page(BasePage):
    gramlots = [inputs]

    def main(self, root):
        for name in ("first", "second", "third"):
            color_rgb(root.section(datapath=name), name, (128, 128, 128))
```

`mywidgets` must be importable in the Python server environment, like any other
Python module. This is project code, not a module shipped by Gramlot. The page still
declares the `inputs` collection used by its helper. If you reuse the Color Maker's
appearance too, include its CSS in your page resources.

In JavaScript, export the equivalent `colorRgb(pane, title, rgb)` function from a
module and import it in the Page module. Keep its collection and CSS dependencies
explicit as well. No custom browser Logic class is necessary: existing sliders, bindings, a
dataFormula and the short Random button action provide its behavior.

In Color Maker, the floating palette owns selection and its single Random action.
The extracted RGB helper needs neither: it still receives only its parent, title
and initial channels. The complete page also loads `layout` for `floatingPane`.

## Animate the same reactive model

**Sieve of Eratosthenes** adds time to the model: a controller timer calls one
algorithm step, that step updates Data, and bindings change the grid. Manual Step
and timed playback call the same method. Start, Pause and Reset make that separation
visible; the lesson explains the timer interval and its lifecycle.
