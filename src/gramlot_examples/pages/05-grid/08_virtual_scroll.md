# Scroll · 1,000 resident rows

The whole Bag is loaded before you start. The grid draws the visible rows and a
small margin around them; scrolling does not fetch more records from a server.

1. Drag the scrollbar down to **R1000**, then return to the top.
2. Some delivery notes span multiple lines. Drag the lower edge of a row number
   to enlarge that row; scroll away and back. Its height stays with that record.
3. Click **Category**, then Shift-click **Quantity**. The arrows show direction
   and the numbers show priority. All 1,000 rows participate in the ordering.
4. Search **Code → R0999**, then clear with the internal ×. The filter searches
   every loaded row and clearing retains the current sort.
5. Resize a column or choose another theme in Gallery Settings. Wrapped row
   heights are measured again; explicit row heights remain local to this grid.

Unseen natural heights are estimated until measured. The scrollbar extent can
therefore adjust as new multiline rows enter the window. Row numbers describe
the current filtered view, not database keys. Self-drag changes this view's order;
the original Bag membership and order are preserved.

The example starts with 1,000 rows. It demonstrates resident viewport rendering,
not partial database loading or database editing.
