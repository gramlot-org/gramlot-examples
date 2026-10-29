# Grid

Follow this sequence from the smallest Bag grid to a complete framed component:

1. [Basic grid · Bag values](01_basic.md): three columns and rows stored as Bags.
2. [Rows as attributes](02_attributes.md): node attributes and typed cell display.
3. [Column groups and row heights](03_colgroups.md): grouped headers, multiline cells and resizing.
4. [Multicolumn sort and row drag](04_ordering.md): view-owned indices and manual order.
5. [Two grids, independent views](05_shared_store.md): shared data, independent ordering and filtering.
6. [FrameGrid · complete example](06_frame_grid.md): themed groups, shared command bars, collection search and live Data updates.
7. [Search · text, numbers and dates](07_search.md): a focused search tutorial, column scope, comparisons and clearing.

Every lesson uses Python Source, a Data Bag and the shared grid component, with an
equivalent JavaScript page. Choose themes in the gallery Settings. Cells remain
read-only; remote providers, editing and a configurator are future work.

The pages inherit the browser locale and time zone. No Grid lesson overrides
them; numeric display follows the user’s browser settings.
