# Column filters

Open the funnel beside **City**. Initially Milan has 2 customers, Turin 2, Rome 1 and Empty 1. All values are allowed until you change the selection.

## Try the composition

1. Press **None**, then check **Milan** and **Turin**: values within a column combine with OR.
2. Open **Category**, select only **Retailer**: different columns combine with AND.
3. Reopen City: counts are now Milan 1, Turin 1, Rome 0, Empty 1. They respect Category but deliberately ignore City's own selection. You can add another city without clearing the current filter.
4. Choose **John e Fred** to intersect the two ID sets as well. Search for a customer name to narrow the same view further.
5. Choose **Tutti**: only the set restriction disappears; search and column selections remain.

**Reset** clears only the open column. **None** is an active filter matching no rows, not a request to clear it. **All** explicitly selects the listed values. Selected values remain in the menu even at count zero or if no matching record remains in the Bag. The funnel and header edge mark an active filter. Escape closes the popup and returns focus to its button.

## Read the code

`columnFilters=True` enables the shared grid header menus; the example does not build menus, count rows or wire browser events. `frameGrid` supplies the normal search control. `setFilter` uses the external John/Fred checkbox columns introduced in Customer sets. Their abbreviated captions retain full `title` labels.

The adjacent `_data.tytx` supplies six invented customers and the initial membership strings. All six rows are already in the resident Bag. A grid with `windowInfo` rejects `columnFilters=True`: a loaded window cannot supply complete distinct values and counts.

## What a count means

Every count applies base filter AND search AND sets AND all other column filters. It excludes only the current column's filter. Editing a row or a set recomputes counts and visible rows, including changes to currently hidden records. Filters never rewrite records or erase memberships.

Selections compare typed values rather than formatted labels. Empty text and null values share the **Empty** option; zero and false are ordinary values. Numbers, booleans and dates retain their types. Aggregated cells, remote facets and bulk record changes are outside this example.

### Search inside the popup

The popup uses frameGrid with the same searchBox and theme CSS as the outer grid. Its shared Gramlot grid shows: checkbox, value and row count. The shared searchBox (Value and magnifier) narrows only that inner grid, with literal case-insensitive text. Hidden selections remain selected; clearing this search restores the list, without changing the main grid search or its criteria. All and None act on all values of the column, including values hidden by the popup search; Reset removes only this column criterion. Click Value or Rows to sort the choices. The popup reuses its grid instance when reopened.

## Dates and periods

Open **Joined**. Enter **March 2026** in **From** (**marzo 2026** with Italian locale): the shared date editor fills From with March 1 and To with March 31. Three customers remain. You can also use the calendar, a localized date, or a relative period such as **last month** (relative to today). This needs only `dtype="D"` on the column: range controls are provided by the grid.

Both endpoints are inclusive; leaving one empty means an open end. Empty dates do not match a range. Changing a valid range selects all dates in that range; individual checkboxes then refine it. Rechecking every date returns to the pure range, so new dates inside it will also match. Counts still exclude the whole Joined criterion and respect all other filters.

Clearing From also clears To and keeps the checked dates as an explicit selection. **Reset** instead removes both the range and date selection. Invalid or incomplete text and reversed endpoints leave the last accepted filter in effect and show an error. For datetime columns the whole endpoint day is included, using the same timezone convention as their display.

The popup reuses `dateTextBox(value="^.from", period_to=".to")`: `period_to` is the relative Data destination for the end of an accepted period. Without it, a dateTextBox accepts a single date. The page itself has no date parsing or filter handlers.

The search caption sits outside the input capsule. Its small chevron opens the shared Labelbox menu (`lbl_value`/`lbl_values`), also used by group headings; the grid popup uses the same searchBox and CSS.
