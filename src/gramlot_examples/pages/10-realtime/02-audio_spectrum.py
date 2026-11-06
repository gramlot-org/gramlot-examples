"""Local microphone analysis feeding shared chart stores."""

from urllib.parse import quote

from genro_bag import Bag
from gramlot import Page as BasePage

# SVG images use the shared toolbar's iconSrc contract.
PLAY_ICON = "data:image/svg+xml," + quote(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'
    '<path fill="#7c899c" d="M7 4v16l14-8z"/></svg>',
    safe="",
)
STOP_ICON = "data:image/svg+xml," + quote(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'
    '<path fill="#7c899c" d="M5 5h14v14H5z"/></svg>',
    safe="",
)


class Page(BasePage):
    title = "Microphone · waveform and spectrum"

    def main(self, root):
        main_content = root.main(datapath="audio", max_width="1400px", margin="16px auto", padding="16px")
        main_content.h1(self.title)
        main_content.p(
            "Local Web Audio analysis. Press Play to request microphone access. No recording, speaker playback, server upload or WebSocket audio transmission."
        )
        main_content.dataSetter(".running", False)
        main_content.dataSetter(".minimumDb", -100)
        bar = main_content.menu(presentation="bar", aria_label="Audio controls",
                        labelPosition="tooltip", iconSize=20, padding="4px 8px")
        bar.menuline(caption="Play", tooltip="Start microphone", iconSrc=PLAY_ICON,
                     disabled="^.running", action="this.SET('.running', true)")
        bar.menuline(caption="Stop", tooltip="Stop microphone", iconSrc=STOP_ICON,
                     disabled="^.running:={} === false", action="this.SET('.running', false)")
        controls = bar.menuline(group=True, gap="8px")
        self.number_choice(controls.div(datapath=".fftSize"), "FFT size", 1024,
                           [256, 512, 1024, 2048, 4096, 8192])
        self.number_choice(controls.div(datapath=".frameRate"), "Updates / second", 20,
                           [5, 10, 20, 30])
        bar.spacer(flex=1)
        status = bar.menuline(group=True, gap="8px")
        status.span("^.status", id="audio-status")
        status.span("^.sampleRate", mask="Sample rate: {} Hz")
        main_content.div("^.error", role="alert")
        main_content.dataFormula(".waveform.step", "rate ? 1000 / rate : 1",
                         rate="^.sampleRate", _init=True)
        main_content.dataFormula(".spectrum.step", "rate ? rate / size : 1",
                         rate="^.sampleRate", size="^.fftSize.value", _init=True)
        self.signal_chart(main_content.section(datapath=".waveform"), "Waveform", "milliseconds", "amplitude", -1, 1)
        self.signal_chart(main_content.section(datapath=".spectrum"), "Spectrum", "frequency", "decibels", -100, 0)
        main_content.audioAnalyser(running="^.running", fftSize="^.fftSize.value", frameRate="^.frameRate.value",
                           minimumDb="^.minimumDb", spectrum="^.spectrum.samples", waveform="^.waveform.samples",
                           sampleRate="^.sampleRate", status="^.status", error="^.error")
        main_content.p(
            "The spectrum floor is −100 dB. These are digital levels, not calibrated sound pressure (dB SPL). Browser microphone processing may affect the signal. FFT size controls frequency resolution; update rate controls display refresh. Stop or close the page to release the microphone."
        )

    def number_choice(self, pane, label, default, values):
        pane.dataFormula(".value", "Number(choice)", choice="^.choice", _init=True)
        select = pane.select(value="^.choice", default=str(default), lbl=label, width="100px")
        for value in values:
            select.option(str(value), value=str(value))

    def signal_chart(self, pane, title, coordinate, measure, minimum, maximum):
        pane.h3(title)
        pane.dataSetter(".options", Bag({measure: Bag(dict(color="#5470c6", axis="left"))}))
        pane.chartView(storepath=".samples", rowMode="samples", engine="uplot",
                       chartType="line", captionField=coordinate, valueFields=measure,
                       sampleStep="^.step", sampleMin=minimum, sampleMax=maximum,
                       seriesOptions="^.options", height="300px")
