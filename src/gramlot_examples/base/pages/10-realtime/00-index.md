# Real-time

These pages show Data that changes many times per second and the charts that
follow it through ordinary bindings.

- **Streaming sine waves:** a browser timer replaces the oldest of 600 samples
  in a Bag; the shared chart redraws from Data.
- **Microphone analysis:** the browser captures microphone samples on demand
  and updates waveform and spectrum charts. Audio stays in the browser.
- **System monitor** (Python galleries with the `system-monitor` extra): the
  server reads CPU, memory, process, disk and network data with psutil and
  delivers it to movable dashboard panels.
