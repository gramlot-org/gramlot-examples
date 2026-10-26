# Nested regions playground

**Try this:** Move one size control, then drag its corresponding splitter. Both update the same dimension; nested levels keep their own sizes.

This is a small customer workspace with several layouts inside it. It is deliberately busier than the first examples: navigation, details, an editor and output all need space. The sliders let you see which container owns which area.

If the page looks complicated at first, start with just one slider. You do not need to understand the whole arrangement at once.

## Try it

Move one region-size slider a little, then back again. Follow the boundary that moves. Does it belong to the outer workspace, or to a layout inside it? Repeat with a slider for a different level.

Next, drag the same separator. Its slider moves immediately: both controls update the same number. Open the Inspector on Data to follow `regions.outer.left` while moving either the Navigation width slider or its separator. Try a nested region too.

Now enter a customer name and a note. Change a date or delivery option too. Look for the places where those values are repeated. They are views of shared Data, not separate copies of the customer.

Move the sliders again. The regions become wider, narrower, taller or shorter while your edits remain. Close one drawer, rearrange another area, and reopen it. Hiding a panel has not discarded its contents.

Finally, try the design and corner-radius controls. These change presentation while the same customer workspace stays alive.

## How a number becomes a size

The slider and the region both use a plain pointer to the same number. Numeric region widths and heights are pixels; the borderContainer converts them to CSS internally. Dragging the splitter writes back the constrained number through the binding, so the slider follows immediately.

```python
sliders.horizontalSlider(value="^regions.outer.left", min=90, max=240, step=1, live=True)
nav = outer.borderContainer(region="left", width="^regions.outer.left",
                            splitter=True, minSize=90, maxSize=240)
```

Each size slider uses `step=1`. It also corrects numbers received through the binding:
a fractional splitter measurement such as `176.73` becomes `177` in Data, then the
panel and label follow that same value. In Inspector, set `regions.outer.left`
to `176.73` and observe it settle at `177`. The slider writes only when correction
is needed; a number already on the step grid is not written again.

There is no formatting suffix or synchronization controller. `regions` is just the Data branch chosen by this example; it is not a special container parameter. You can find all seven shared size bindings in **Code**.

The nested containers still have a simple responsibility: each lays out its own immediate children. The outer container does not calculate the positions of every field inside the editor.

## What to take into your own page

Build the outer layout first, then give a region its own container only when it needs independent areas. Connect sizes to Data if users or application logic need to control them. Ordinary splitters are enough when you only want people to resize by dragging.

**Sample data:** `05-nested_lab_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.
