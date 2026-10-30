<a id="ge-grid-09"></a>
# Floating grid · resize and scroll

The floating pane opens with 1,000 records already in a resident Bag. Its center
uses flex layout with 5px padding on all four sides. FrameGrid fills the remaining
space without a fixed height. Its own top region contains the search toolbar; its
center contains the Grid. The floating pane has no separate content toolbar.
The window and grid use the shared components, with no example-specific resize
or scroll handlers.

1. Drag the window's lower-right corner to make it shorter and taller. The search
   toolbar and column headers stay above the scrolling body.
2. Widen the window and inspect the multiline delivery notes. Narrow it again:
   declared column widths remain, with horizontal scrolling when needed.
3. Drag the lower edge of a row number to enlarge that row. Resize the window,
   scroll away and return: that row keeps its manual height.
4. Focus the scrolling body and press End to reach **R1000**, then Home to return.
   Only the visible rows and a margin are mounted.
5. Search **R0999**, clear the filter, then sort a column. Close and reopen the
   floating pane: the grid keeps its view and row heights.

The resize handle also accepts arrow keys (10 pixels, or 1 with Shift).
Unseen natural row heights are estimated until measured; the scrollbar extent
can adjust as rows enter the viewport. Data remains fully resident.
