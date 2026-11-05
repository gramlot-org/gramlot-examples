# Streaming sine waves

> **What you learn** — Pause or change the rate of a rolling 600-sample signal.

This is the original 600-sample rolling sine-wave example. Choose 2, 10, 30 or 60 updates per second. Pause to inspect or zoom; resume to follow new data. Reset rebuilds the initial sample selection.

The ordinary client `dataController` timer calls the companion `Logic.tick`. It removes the oldest row and appends one new sample in the same Bag. Two phase-shifted curves share the same X positions. Changing the requested rate preserves the last 600 samples. The observed-rate counter measures timer updates, not rendered frames.

The companion `streaming.js` contains the signal-generation methods; chart rendering is the existing shared component. Compare compatible engines in Chart settings. No server sampler, WebSocket or special streaming buffer is introduced.
