# Move, rotate and zoom a card

A gesture surface and four numeric fields share the same pose in Data. A separate style binding moves the card inside the stage.

## Try it

1. Drag the stage with a mouse, pen or one finger. **X** and **Y** follow the drag, and the card moves with them.
2. On a touch screen, move two fingers apart or together to zoom. Turn them to rotate, or move them together to translate. Lift one finger and continue dragging with the other. The completion counter updates after the last finger lifts, provided the final pose differs from the starting pose.
3. Change **Angle** or **Zoom** with the numeric fields. Use your locale’s decimal separator for fractional values, such as `1.5` in English or `1,5` in Italian. The card moves through the same bindings, while the completion counter and last gesture report keep their previous values.
4. Edit **Card note**, move the card, then press **Reset pose**. The pose returns to its original values and the note keeps your text. Reset also brings the card back into view if you move it beyond the clipped stage.

## How it works

`transformPane` tracks the gesture and writes `x`, `y`, `rotate` and `zoom` through plain reactive pointers. Here those pointers target the `pose` Bag initialized by the companion TYTX data file. X and Y are pixel offsets, rotation is in degrees, and zoom is a scale factor. The pane constrains zoom to 0.5–3 in steps of 0.01.

A `dataFormula` reads the same four paths and produces a CSS transform declaration. The child card reads that declaration through its `style` binding, so the stage stays fixed while the card moves. Numeric fields and the reset command write to the same pose paths. The fields require values because the gesture surface needs finite numbers.

The named `onEnd` Logic method receives the final four values and records them in Data. A stationary gesture or a cancellation does not run it. The Logic module is shared by the Python and JavaScript versions.
