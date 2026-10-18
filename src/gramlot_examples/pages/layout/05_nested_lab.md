# Explore a layout by moving one thing at a time

This is a small customer workspace with several layouts inside it. It is deliberately busier than the first examples: navigation, details, an editor and output all need space. The sliders let you see which container owns which area.

If the page looks complicated at first, start with just one slider. You do not need to understand the whole arrangement at once.

## Try it

Move one region-size slider a little, then back again. Follow the boundary that moves. Does it belong to the outer workspace, or to a layout inside it? Repeat with a slider for a different level.

Now enter a customer name and a note. Change a date or delivery option too. Look for the places where those values are repeated. They are views of shared Data, not separate copies of the customer.

Move the sliders again. The regions become wider, narrower, taller or shorter while your edits remain. Close one drawer, rearrange another area, and reopen it. Hiding a panel has not discarded its contents.

Finally, try the design and corner-radius controls. These change presentation while the same customer workspace stays alive.

## How a number becomes a size

A slider produces a number. A region width needs a size such as 180px. The example connects them with a pointer template: it reads the slider's Data value and adds the unit. You can find these declarations by looking for the region-size paths in **Code**.

The nested containers still have a simple responsibility: each lays out its own immediate children. The outer container does not calculate the positions of every field inside the editor.

## What to take into your own page

Build the outer layout first, then give a region its own container only when it needs independent areas. Connect sizes to Data if users or application logic need to control them. Ordinary splitters are enough when you only want people to resize by dragging.
