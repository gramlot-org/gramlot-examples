"""A bounded sine stream through the ordinary Bag store and the shared chartPane."""
from math import sin, pi
from genro_bag import Bag
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Streaming sine waves'

    def main(self, root):
        main_content = root.main(datapath='stream', max_width='1400px', margin='20px auto', padding='16px')
        main_content.h1('Sine waves in streaming')
        main_content.p('600 samples per curve. Change the update rate, pause, or compare engines using the chart settings.')
        for key, value in dict(running=True, sample=0, time=0, measuredRate=0, measuredTicks=0, measuredAt=0).items():
            main_content.dataSetter('.' + key, value)
        bar = main_content.div(display='flex', align_items='center', gap='12px', flex_wrap='wrap', white_space='nowrap', margin_bottom='12px')
        rate = bar.select(value='^.rate', default='30', lbl='Updates / second', lbl_position='L', id='stream-rate', width='80px')
        for hz in (2, 10, 30, 60):
            rate.option(str(hz), value=str(hz))
        bar.button('Pause / resume', id='stream-toggle', action="this.SET('.running',!this.GET('.running'))")
        bar.button('Reset', id='stream-reset').dataController(func='reset')
        bar.span('^.measuredRate', mask='Observed updates/s: {}', id='stream-observed')
        bar.span('^.sample', mask='New samples: {}', id='stream-samples')
        rows = Bag()
        for sample in range(-599, 1):
            t = sample / 60
            rows.set_item(f'r{sample}', None, seconds=t, signal=sin(2 * pi * 0.2 * t), reference=0.6 * sin(2 * pi * 0.2 * t + 0.8))
        config = Bag(dict(engine='uplot', chartType='line', captionField='seconds', drawer='close'))
        for name, color in [('signal', '#5470c6'), ('reference', '#ee6666')]:
            config.set_item(f'seriesOptions.{name}', Bag(dict(caption=name.title(), color=color, axis='left', selected=True)))
        config.set_item('seriesOptions.seconds', Bag(dict(caption='Seconds', color='#3ba272', axis='left', selected=False)))
        main_content.dataSetter('.rows', rows)
        main_content.dataSetter('.config', config)
        main_content.chartPane(storepath='.rows', configpath='.config', rowMode='attributes', id='stream-pane', height='600px')
        main_content.dataFormula('.interval', 'running ? 1 / Number(rate) : 0', running='^.running', rate='^.rate', _init=True)
        main_content.dataController(func='restartMeasurement', rate='^.rate', running='^.running')
        main_content.dataController(func='tick', _timing='^.interval')
        main_content.p('Samples are simulated in the browser and delivered through the normal CollectionStore. The observed rate measures timer updates, not rendered frames. No WebSocket or special streaming buffer is used.')
        main_content.p('Pause to inspect and zoom. Resuming follows the newest data; changing the rate keeps the last 600 samples.')
