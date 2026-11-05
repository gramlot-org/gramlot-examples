# Image annotations

> **What you learn**
>
> Annotate an image with one `drawingPane`. The component provides its toolbar
> and writes the editable shapes directly into a Data Bag.

## Try it

Choose **Arrow**, **Draw** or **Circle** and drag on the plan. Choose **Text**,
click on the image, type a note and press Enter. Escape cancels text editing.
Use **Select** to move an annotation; double-click a text note to edit it.
**Color** and **Pen size** change the selected annotation and subsequent strokes.
**Delete** removes the selected annotation.

Open Inspector and inspect `drawing.annotations` in Data while drawing or moving
an annotation. The image remains unchanged: annotations are a separate overlay.
You can detach Example, Explanation and Code to compare them side by side;
closing a detached panel puts it back in its tab.

## The essential code

`datapath="drawing"` gives the example its own Data area. The relative path
`.annotations` belongs to that area. The companion `06-drawing_data.tytx`
initializes it as an empty **Bag**, loaded by the gallery before the page runs.
`drawingPane` edits that original Bag; the page needs no initialization code.

`image=IMAGE` supplies a small self-contained SVG floor plan, so this example
needs no image server. Replace that constant with your own image URL.
`annotations="^.annotations"` binds the component to the original Bag.
The component supplies its tools; the page does not implement drawing events
or duplicate the toolbar. `height="480px"` reserves a usable editing area.

## What the Bag contains

Each annotation is a child Bag with a type, coordinates, color and stroke width.
Arrows store their two endpoints; circles store a center and radius; freehand
strokes store a list of points; text annotations store their text and position.
Coordinates refer to the original image dimensions, so resizing the view does
not change the saved geometry. Editing or deleting a shape updates this Bag.

This example keeps annotations **in the current page's Data only**. It does not
upload the image, flatten annotations into it or save to a server. Reloading the
page starts with an empty Bag. Server persistence is a separate step.
