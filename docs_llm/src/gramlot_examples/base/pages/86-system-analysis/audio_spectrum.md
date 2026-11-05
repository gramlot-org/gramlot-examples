# Microphone analysis

> **What you learn**
>
> Connect a live browser data source to shared charts: the audio analyser writes
> waveform and spectrum as numeric arrays in Data, and the charts observe those values.

## Try it

Press **Play** and grant microphone access. Speak or make a sound: the waveform
shows amplitude over time, while the spectrum shows energy by frequency.
Press **Stop** to release the microphone. HTTPS or localhost is required.

## Follow the code

`main()` declares the controls and chart panels. `audioAnalyser` owns microphone
capture and publishes its outputs through bindings. The charts read the same
Data paths; the example does not draw samples with application DOM code.

FFT size controls the analysis window and frequency resolution. Refresh rate
controls how often samples reach the charts. The dB scale is relative to the
digital signal, not calibrated sound pressure. Browser microphone processing
can affect the measurements.

## Privacy and lifecycle

Capture starts only after Play. Audio stays in the browser: this example neither
records nor uploads it. Stop releases capture. Microphone permission and available
devices depend on the browser and operating system.

## Read beside the live example

Use the detach icon in Example, Explanation or Code to arrange floating panels
side by side. Close a floating window to return its panel to the tab.

## One node per snapshot

Each output is one Data node containing an array. With FFT size 1024, waveform
contains 1024 numbers and spectrum contains 512; these are not 1536 Bag nodes.
Every frame replaces the arrays, activating the existing bindings. Charts keep
their component and renderer instances. An empty array means no samples yet.

`signal_chart()` reuses the same declaration for both charts. `rowMode="samples"`
selects the shared array input. X is the sample index multiplied by `sampleStep`:
1000 / sample rate gives milliseconds; sample rate / FFT size gives hertz.
The formulas run before rendering (`_init=True`), providing a step of 1 until
capture supplies a sample rate. No sample initializer is needed: before the
first frame, the charts show “No data to display” without creating Data nodes. Spectrum values below the configured floor, including silence, become
−100 dB. Series options remain a small configuration Bag, separate from samples.
The example uses `chartView` directly: the row-based ChartPane configurator is
not applicable to these signal snapshots.

## Stable axes

Waveform amplitude stays between -1 and +1; spectrum stays between minimumDb
and 0 dB. Quiet and loud snapshots therefore remain visually comparable.
`sampleMin` and `sampleMax` set these ranges in the shared chart component.
The horizontal extent changes only with FFT size or sample rate, never with
the signal amplitude.


## Context makes the block reusable

The main container has `datapath="audio"`. Its controls and analyser use relative
bindings, such as `^.running` and `^.waveform.samples`. Each chart receives a
container with its own relative datapath: `.waveform` or `.spectrum`. Inside
`signal_chart`, the names never change: `.samples`, `^.step` and `^.options`.
Moving the container moves its Data context; the helper does not construct paths
or know the name of its instance. The sample arrays therefore live in
`audio.waveform.samples` and `audio.spectrum.samples`.

The two numeric selectors use the same pattern: `.fftSize` and `.frameRate` are
instance contexts; `number_choice` reads `.choice` and computes `.value`.
