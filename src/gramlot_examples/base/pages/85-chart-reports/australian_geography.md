# States and suburbs

> **What you learn** — Click an Australian state to inspect its suburbs without losing year, measure or search.

Click a state on the map to load its ABS suburb boundaries and sales rows. Use Australia to return. Change year or measure and search the grid: these choices remain in place across drilldown.

`selectedTerritory` drives the existing RPC. The provider joins customer localities to ABS SAL 2021 boundaries. Unmatched places remain visible in the table and totals; they are not assigned to a different suburb. Grey areas have no matched sales. Counters show boundaries, matched sales areas and unmatched localities.

The returned geometry updates the configuration Bag. Both the grid and chart continue observing the result rows. Chart settings includes 2D maps and ECharts 3D bars on a map with configurable baseline. Boundaries are statistical approximations, not legal boundaries.
