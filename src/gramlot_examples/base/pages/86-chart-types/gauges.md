# Gauges

Show one value on a needle dial, a progress ring or a half-circle arc.

## Try it

Move **Value**. The three gauges at the top follow it. Set **Value** above **Max** or below **Min**: the dial stops at its end, the text still shows the real value. Change **Min** and **Max** to rescale the dial.

Edit **Thresholds**. Each pair `value:color` starts a color at that value and applies upward. Below the first value the gauge uses the theme accent. A color is a name or a hex code, because commas separate the pairs. Write `0:#67c23a,65:#e6a23c,85:#c23531` for a green start.

Edit **Mask**. `{}` stands for the value: `{} %`, `{} of 100`, `CPU {}`.

Choose **Presentation**. It sets the presentation of the lower gauge. The three gauges at the top fix theirs: `needle`, `ring` and `arc`.

The lower gauge reads `^.cpu?percent`: the value is the attribute `percent` of the Data node `.cpu`, and its slider writes that attribute.

## Read the declarations

- `gauge('^.value', ...)` takes the node value as its first argument, like `span`. The gauge never writes Data.
- `min`, `max`, `mask`, `thresholds`, `presentation` and `caption` accept `^` bindings. A change redraws the gauge.
- `^.cpu?percent` points at an attribute of a Data node. `dataSetter('.cpu', None, percent=38)` creates it.
- Empty Data shows an empty dial with no needle or progress, never a zero.
- Colors, background and text follow the light or dark theme.

## What this teaches

One value needs no rows and no store. The element reads the same pointer syntax as any other node and keeps its settings in Data, so a controller or a form can change them.
