# System and microphone analysis

This is a development lesson. It requires connected development checkouts of
Gramlot, gramlot-examples and gramlot-py-server with the chart/audio collections.
From the Python server checkout:

```sh
python -m pip install -e '.[system-monitor]'
python -m gramlot_py_server.gallery.base.system_monitor --gallery --port 8905
```

In the gallery, open **Live examples → System monitor**. The tabs
show the working dashboard, a guided explanation and its Python source.
The same section also contains **Microphone analysis**, with its own explanation
and Python source. This optional host binds only to localhost.
Read [the lesson](system_analysis.md), then `Page.main()` for the composition.
The same page module includes `PageStore`, which owns the control/metrics
boundary, and `PsutilHandler`, which returns a Bag for the controller to apply to Data. A fixed circular list
visits one handler per tick, reading only when running and a related panel is open.

For the standalone dashboard and microphone page:

```sh
python -m gramlot_py_server.gallery.base.system_monitor --port 8904
```

- `/`: movable panels with per-core bars, RAM/Swap donuts, process grid,
  history, disk activity/capacity and interfaces. **Add panel → Process memory**
  shows horizontal RSS bars (10, 20, 50 or all processes). The process grid stays
  complete; grids offer shared search and column filters.
- `/audio`: local waveform/spectrum analysis. **Play** explicitly requests
  microphone permission; **Stop** releases capture. No recording or upload.

Both pages use standard menu toolbars with SVG Play/Stop icons. The example owns a small asyncio interval; a Data pulse activates an ordinary
PageStore controller. No timer API is added to the core or server.
Every page owns its history and CPU baselines. Unknown first rates remain missing.
Network sums include loopback. Connection enumeration is intentionally removed.

RAM uses total minus available. Process RSS can count shared pages more than once.
Volumes are shown separately, not summed. Collection time excludes transport and
painting. This is a teaching dashboard, not a production monitoring agent.

The microphone requires HTTPS or localhost; FFT size 256–8192 and refresh 5–30/s
are selectable. The spectrum floor is −100 digital dB, not calibrated dB SPL.
Browser microphone processing may affect the signal. Audio stays in the browser.
