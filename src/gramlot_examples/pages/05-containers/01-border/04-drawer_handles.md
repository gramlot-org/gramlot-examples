# Drawers: handles, content and retained Data

**Try this:** Close and reopen the four drawers. The workspace gains space while the fields and their Data remain available when you return.

Imagine editing a customer while keeping filters, customer details and a short output summary nearby. You need those tools, but you do not need them all on screen all the time. A **drawer** is a panel you can tuck away and bring back with a small handle.

This example has one on each side. Search is above the workspace, Filters is on the left, Details is on the right, and Output is below. Details starts closed.

## Let the page show you

In the gallery, open the lower **Guide** handle and press **Start / Resume**. We will change a delivery option, hide its panel, and bring it back. Then we will change a customer name and a note, showing where those values appear elsewhere.

You can pause whenever you want to try something. **Next** performs one step at a time. **Back** lets you reread an explanation; it does not undo changes. **Stop** leaves the example as it is. Starting again begins the demonstration again, including its changes to the customer, delivery and note.

If you prefer listening, enable **Voice**. It reads the same English explanation using a voice available in your browser. You can follow the lesson with text alone. The guide is part of the gallery, so you will not see it if you open this example on its own.

## Try it

Choose **Express** in Filters and read the delivery line in the center. Now close Filters with its handle. The delivery line still says Express. Open Filters again: Express is still selected.

That is the key idea. Closing a drawer hides a view; it does not erase the values behind it. Gramlot calls those shared values **Data**. The radio group and the delivery line read the same value, so they stay in agreement.

Open Details and enter a different customer name. Leave the field and look at the center. You did not have to copy the name from one widget to another: their bindings connect them to the same Data.

For one more experiment, close Output, change the note in the center and leave its field, then reopen Output. It shows the new note even though it was hidden when you made the edit.

## Small handles, deliberate choices

A click opens or closes a drawer. When a splitter is enabled, you can also drag the handle to resize its panel, even starting from closed. The icon belongs to the caption. By default both stay hidden in a thin grip until you interact; on touch it remains readable without starting zoomed. An author can explicitly request an always-visible caption with drawer_minimize=False.

## Find the idea in Python

In **Code**, look for the contentPane declarations. The region chooses a side; drawer enables opening and closing; drawer_label gives the handle a name. The values beginning with a caret connect those choices to Data. The small controllers below keep that Data up to date when you operate a handle yourself.

You do not need to understand every line to use a drawer. Start with a panel that opens and closes, then add resizing and bindings when your application needs them.

**Sample data:** `04-drawer_handles_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.
