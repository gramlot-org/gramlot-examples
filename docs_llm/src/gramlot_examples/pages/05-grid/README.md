# Grid

The lessons start from the complete framed grid and finish with the grid as a base
component. Every lesson uses Python Source, a Data Bag and the shared grid
component, with an equivalent JavaScript page. Choose themes in the gallery Settings.

## Part 1 · frameGrid

`frameGrid` composes a grid with toolbars, search and tools. Follow it in this order:

1. [FrameGrid · complete example](06_frame_grid.md): themed groups, shared command bars, collection search, live Data updates, and how `frameGrid` routes its keywords with the `grid_` and `frame_` prefixes.
2. [Search · text, numbers and dates](07_search.md): column scope, comparisons and clearing.
3. [Toolbar tools · export, print and line numbers](14_toolbar_tools.md): the five export formats, `printRows` and `advancedTools`.
4. [Selection · none, single and multi](15_selection.md): `selectionMode`, row keys and the published selection paths.
5. [Editing · drafts and validation](13_editing.md): edit 1,000 rows with persistent drafts, errors and asynchronous validation.
6. [Row tools · add, duplicate and delete](16_row_tools.md): `addrow` with defaults, `duprow`, `delrow` and `gridsemaphore`.
7. [Row formulas · totals, VAT and chains](17_row_formulas.md): computed columns, a VAT read from page Data and a formula chain over Decimal values.
8. [Numbering and running sums](18_numbering.md): `#`, `+=` and `%=`, and the numbering of filtered rows.
9. [Footer totals](19_footer_totals.md): `footer`, `totalize`, `footer_format` and a page element reading the total.
10. [Customer sets](10_check_sets.md): external checkbox sets, their intersection and search.
11. [Column filters](11_column_filters.md): distinct values, counts and multiple selections.
12. [Primary supplier](12_primary_supplier.md): a radio column that stores one scalar ID.
13. [Two grids, independent views](05_shared_store.md): shared data with independent ordering and filtering.
14. [Scroll · 1,000 resident rows](08_virtual_scroll.md): a small viewport, variable row heights and full-collection search.
15. [Floating grid · resize and scroll](09_floating_scroll.md): resize a floating window around the same resident dataset.

Lessons 6 to 9 share one set of order lines (code, description, quantity and price)
and each adds one concept.

## Part 2 · the grid as a base component

The `grid` element without a frame, from the smallest Bag grid:

16. [Basic grid · Bag values](01_basic.md): three columns and rows stored as Bags.
17. [Rows as attributes](02_attributes.md): node attributes and typed cell display.
18. [Column groups and row heights](03_colgroups.md): grouped headers, multiline cells and resizing.
19. [Multicolumn sort and row drag](04_ordering.md): view-owned indices and manual order.

Most lessons are read-only. The editing and row tools lessons introduce local shared
editing; database saves and a configurator remain outside these lessons.

The pages inherit the browser locale and time zone. No Grid lesson overrides
them; numeric display follows the user’s browser settings.
