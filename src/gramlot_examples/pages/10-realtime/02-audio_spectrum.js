import {Bag, Page as BasePage} from '@gramlot/gramlot/page';

// SVG images use the shared toolbar's iconSrc contract.
const PLAY_ICON = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#7c899c" d="M7 4v16l14-8z"/></svg>');
const STOP_ICON = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#7c899c" d="M5 5h14v14H5z"/></svg>');

export class Page extends BasePage {
    static title = 'Microphone · waveform and spectrum';
    main(root) {
        const main_content = root.main({datapath:'audio', max_width:'1400px', margin:'16px auto', padding:'16px'});
        main_content.h1(this.constructor.title);
        main_content.p('Local Web Audio analysis. Press Play to request microphone access. No recording, speaker playback, server upload or WebSocket audio transmission.');
        main_content.dataSetter({destination_path:'.running', value:false});
        main_content.dataSetter({destination_path:'.minimumDb', value:-100});
        const bar = main_content.menu({presentation:'bar', aria_label:'Audio controls', labelPosition:'tooltip', iconSize:20, padding:'4px 8px'});
        bar.menuline({caption:'Play', tooltip:'Start microphone', iconSrc:PLAY_ICON, disabled:'^.running', action:"this.SET('.running', true)"});
        bar.menuline({caption:'Stop', tooltip:'Stop microphone', iconSrc:STOP_ICON, disabled:'^.running:={} === false', action:"this.SET('.running', false)"});
        const controls = bar.menuline({group:true, gap:'8px'});
        this.numberChoice(controls.div({datapath:'.fftSize'}), 'FFT size', 1024, [256, 512, 1024, 2048, 4096, 8192]);
        this.numberChoice(controls.div({datapath:'.frameRate'}), 'Updates / second', 20, [5, 10, 20, 30]);
        bar.spacer({flex:1});
        const status = bar.menuline({group:true, gap:'8px'});
        status.span('^.status', {id:'audio-status'});
        status.span('^.sampleRate', {mask:'Sample rate: {} Hz'});
        main_content.div('^.error', {role:'alert'});
        main_content.dataFormula({result_path:'.waveform.step', formula:'rate ? 1000 / rate : 1', rate:'^.sampleRate', _init:true});
        main_content.dataFormula({result_path:'.spectrum.step', formula:'rate ? rate / size : 1', rate:'^.sampleRate', size:'^.fftSize.value', _init:true});
        this.signalChart(main_content.section({datapath:'.waveform'}), 'Waveform', 'milliseconds', 'amplitude', -1, 1);
        this.signalChart(main_content.section({datapath:'.spectrum'}), 'Spectrum', 'frequency', 'decibels', -100, 0);
        main_content.audioAnalyser({running:'^.running', fftSize:'^.fftSize.value', frameRate:'^.frameRate.value',
            minimumDb:'^.minimumDb', spectrum:'^.spectrum.samples', waveform:'^.waveform.samples',
            sampleRate:'^.sampleRate', status:'^.status', error:'^.error'});
        main_content.p('The spectrum floor is −100 dB. These are digital levels, not calibrated sound pressure (dB SPL). Browser microphone processing may affect the signal. FFT size controls frequency resolution; update rate controls display refresh. Stop or close the page to release the microphone.');
    }
    numberChoice(pane, label, initial, values) {
        pane.dataFormula({result_path:'.value', formula:'Number(choice)', choice:'^.choice', _init:true});
        const select = pane.select({value:'^.choice', default:String(initial), lbl:label, width:'100px'});
        for (const value of values) select.option(String(value), {value:String(value)});
    }
    signalChart(pane, title, coordinate, measure, minimum, maximum) {
        pane.h3(title);
        pane.dataSetter({destination_path:'.options', value:new Bag({[measure]: new Bag({color:'#5470c6', axis:'left'})})});
        pane.chartView({storepath:'.samples', rowMode:'samples', engine:'uplot', chartType:'line', captionField:coordinate,
            valueFields:measure, sampleStep:'^.step', sampleMin:minimum, sampleMax:maximum, seriesOptions:'^.options', height:'300px'});
    }
}
