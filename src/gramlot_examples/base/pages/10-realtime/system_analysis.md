# System monitor

> **What you learn**
>
> A small server interval emits a pulse in Data. A normal dataController visits
> one handler in a fixed circular list. The handler returns a Bag; the controller
> writes the result into Data and WebSocket bindings update the views.

## Try it

CPU cores, memory, processes and network activity start open. Move, resize or
maximize their windows. **Add panel** opens the other views. **Stop** disables
readings; **Play** enables them again. Close a window to stop its readings unless
another open window needs the same handler.

**Tick every** is the interval between positions in the list, not a whole scan.
The list is built once and never shortened when panels close. Every tick advances
one position, including skipped positions; after the last, it returns to the first.
An inactive panel does not cause the next handler to run in the same tick.

## Read the three classes

`Page`, `PageStore` and `PsutilHandler` appear consecutively in this module. There
is no separate collector hidden from the Code pane.

- `Page` composes shared floating panes, charts, grids and the toolbar. Its
  `readings` mapping states which measurement families each panel needs.
- `PageStore.main()` constructs the unique handler list and declares the controller
  observing `clock.tick`. `clock.index` records the next position in Data.
- `PsutilHandler` provides the `psutil_*` methods. Each method collects one family
  and returns a new Bag. It does not write into the page's Data.

## Follow one tick

```text
example's asyncio interval → clock.tick → dataController
  → next position in the circular list
  → running and a related panel open?
  → handler returns Bag → controller updates metrics
  → WebSocket deltas → chartView / frameGrid
```

The interval belongs only to this example. `start()` creates its asyncio task;
`close()` cancels it. `asyncio.sleep()` gives the event loop time between ticks.
The ordinary controller runs synchronously when `clock.tick` changes. There is
no new `_timing` support or timer service in the core or server integration, and
no browser polling or sample acknowledgement.

The Python host can deliver binder operations from a worker. The example's
`on_loop()` sends those operations to the same loop as the interval, so page Data
is never modified concurrently by the timer and a binder. This small adapter is
local to this example; it adds no framework API.

`control` holds running, interval, history window, process limit and panel state.
`metrics` holds the resulting rows and status. `clock` holds the pulse and cursor.
A failed reader writes `error` and sets running to false. Play resumes the ring.
A skipped rate reader discards its baseline so reopening it does not reuse an
obsolete interval.

## Bags and bindings

The browser uses `datapath='monitor'` and relative bindings. Empty chart/grid Bags
exist before the first asynchronous server snapshot because grids need their
store when they attach. Subsequent Data changes arrive through `dataBinder`.

The controller applies only the returned family. History points are appended and
pruned, rather than replacing all metrics. Disk capacity reads one mount per usage
tick, retaining the other mounts; a partition-list tick removes disappeared mounts.
Shared readers occur once in the ring even if two panels use them.

## Understand the measurements

A family may involve several OS calls: `process_iter` scans all processes and is
more expensive than a memory reading. The loop yields between ticks, but cannot
interrupt a synchronous psutil read. CPU and I/O rates use each family's monotonic
elapsed time; first readings and reset counters are unknown, not false zeros.
Process CPU baselines use PID plus creation time. Process CPU 100% means one core.

Histories retain 1, 5 or 15 minutes, capped at 1,801 points per series. RAM and swap
are read separately, so their chart combines the latest available values. RAM is
`total - available`; process RSS can count shared pages repeatedly. Network totals
include loopback. Mount capacities are not summed. Global connections are not read.

## Run locally

Install `gramlot-examples[system-monitor]` and use the local Python monitor launcher
with WebSocket enabled. This example requires an asyncio host, as used by the
Uvicorn preview. It measures the server machine, not the browser. Collection time
excludes transport and rendering. Close the page to cancel its interval.
