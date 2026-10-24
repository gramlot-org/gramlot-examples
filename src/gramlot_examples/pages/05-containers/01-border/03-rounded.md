# Rounded panels that still let you work

**Sample data:** `03-rounded_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

Rounded corners can make a workspace feel softer, but they should never get in the way of a calendar, a choice list or a helpful error message. This example lets you try those things together.

The outer layout and the layout inside it share a corner-radius setting. You will see both respond to one control.

## Try it

Move **Corner radius** slowly from zero toward 48. At zero the corners are square. As the value increases, watch the inner boundaries as well as the outside outline. The page is changing an existing layout, not loading another version of it.

Open the appointment calendar, then open the Delivery list. Try this with a generous corner radius and with a narrow editor. A popup needs to remain usable even when the field sits near a rounded edge.

Enter a one-letter name. The error message floats beside the invalid field rather than pushing the following fields down. You can keep reading the form without losing your place.

Finally, resize a region or close a drawer and reopen it. Your edits should still be there.

## Why one slider changes both layouts

Both containers read the same Data value for their rounded attribute. This is a binding: instead of assigning a radius once, you tell the container where to read it. When the slider changes that value, both containers update.

The rounded background and the popup have different jobs. The background stays within the panel's shape. The calendar and choice popup can appear above it, so the rounded edge does not cut off the choices.

## Your next experiment

Try mimi and joanna from Settings. The appearance changes, but the layout and the values you entered remain the same. Then visit **Drawers** to explore how a panel can get out of your way without throwing away your work.
