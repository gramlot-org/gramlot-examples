# Give each part of your page its own space

Imagine a customer screen: filters on the left, a form in the middle, and a summary on the right. You want people to give the form more room without having to close their work. This is what a **borderContainer** helps you build.

A *region* is simply one of its areas: top, bottom, left, right or center. The center takes the space that remains. You do not have to calculate its width yourself.

## Try it

Start by dragging the thin line beside the filters. This line is a **splitter**. As the filters get wider, the form gets narrower. Release it where you are comfortable: you have changed the layout, not the form.

Now enter a customer name of at least two characters and leave the field. Look at the summary. It shows your new name because both places use the same stored value. In Gramlot, those shared values are called **Data**.

For a useful contrast, enter just one letter. The field reports that the name is too short, while the summary keeps the last accepted name. Resize the pane again: even the unfinished, invalid edit stays in the field. Moving a separator does not rebuild the editor.

## How you would build this

First create a borderContainer. Add a contentPane for each region you need. For a left-hand pane, set region to left, choose a starting width and enable splitter. Add another pane with region set to center for the main form. That is the layout: no resize formula for the center is needed.

Minimum and maximum sizes keep a pane useful when someone drags too far. A keyboard user can focus a splitter and use its arrow keys.

## Take one idea with you

A container organizes space; the fields continue to own their editing state. Use **Code** when you want to find the region declarations, then return to the example and try a different width. Next, **Nested borders** shows how one area can contain a layout of its own.
