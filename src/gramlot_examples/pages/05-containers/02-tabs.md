# Choose the presentation by looking at it

**Sample data:** `02-tabs_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

The first eight cards compare two presentations on all four sides. **Shaped tabs** give each label a visible outline; **Underline** leaves a lighter row or list of text, with a line marking the selected panel. You can click every card: these are real containers, not pictures.

**Top** and **Bottom** place the labels in a horizontal row. **Left** and **Right** place them in a vertical list. The text itself stays horizontal: a vertical tab list does not require rotated words. Each card prints the mode, position and alignment options that create it.

Type a name in one **Profile** panel. The other cards update because their editors share the same Data path. Open **Messages**, edit its text, and return to Profile. Changing panels keeps the controls and their values. Each card has independent selection, so you can compare different panels at the same time.

The next six cards separate **position** from **alignment**. Position chooses a side; `tabAlign` chooses where the labels sit along that side. With a horizontal bar, `start`, `center`, `end` mean left, middle, right. With a vertical bar they mean top, middle, bottom. The default is `start`. If the labels no longer fit, the strip keeps its beginning reachable and lets you scroll through the entries.

The controls below the comparison let you change the presentation of one larger editor, adjust icons and unread badges, and explore closing. The unread-message slider also updates the badges in the cards above.

## Keep several tasks within reach

Tabs let someone move between parts of a task without opening a new page. Here you can edit a customer, write notes, and visit a nested layout. Only one panel is visible at a time, but changing tabs keeps the others ready for your return.

There is an important distinction to learn: **switching away from a panel is not the same as closing it**.

## Try it

Write a note in **Notes**, select **Customer**, then return. Your note is still there. In Customer, try a one-letter name: it is too short, so it stays as an unfinished edit while the accepted name below remains unchanged. Switch away and return again. Even that unfinished edit survives.

Now use **Presentation** and **Tab position**. Underline gives you a lighter row of labels; Tabs gives you shaped tabs. Move the row to the bottom or to either side. These are different presentations of the same panels.

While Notes is hidden, move **Unread messages**. The number beside Notes changes without opening the panel. That little number is a **badge**: a way to show that something deserves attention elsewhere. Try its color and icon controls as well.

## Closing deserves a separate experiment

Turn on **Prevent closing Notes** and try its close button. The panel stays. Turn the lock off and try again: this time the tab and its panel are removed. The **Saved notes** line still contains the note, because removing an editor does not automatically erase the Data it was editing.

After closing Notes, it is no longer a selectable tab. Reload this example when you want to repeat that part of the lesson.

## How selection connects to your page

Each panel has a pageName, a stable name such as customer or notes. The container's selectedPage can bind to Data, which is why **Selected page** and clicking a tab can control the same selection. The numeric selected value is its position in the list, starting at zero.

The event report lets you see which panel is being hidden, shown or closed. It is useful when another part of your application needs to react, but you do not need a controller just to switch ordinary tabs: the container already does that.
