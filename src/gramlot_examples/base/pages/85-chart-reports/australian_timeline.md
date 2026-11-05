# Sales over time

> **What you learn** — Play daily or monthly sales prepared by the server.

Choose daily or monthly data to run the original database aggregation. The returned rows include period, territory, revenue, invoice count, units and customers. Use the temporal controls in Chart settings to play the prepared snapshots.

Revenue and counts can use separate axes. Customer counts are distinct within each period and territory and must not be added across periods. `load_sales` delegates to the existing provider; the chart does not compute these totals. Changing the prepared grain updates the chart's time step.
