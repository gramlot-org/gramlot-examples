import {Bag, Page as BasePage} from '@gramlot/gramlot/page';

const curves = t => ({seconds:t, signal:Math.sin(2*Math.PI*0.2*t), reference:0.6*Math.sin(2*Math.PI*0.2*t+0.8)});

export class Page extends BasePage {
    static title = 'Streaming sine waves';
    main(root) {
        const main_content = root.main({datapath:'stream', max_width:'1400px', margin:'20px auto', padding:'16px'});
        main_content.h1('Sine waves in streaming');
        main_content.p('600 samples per curve. Change the update rate, pause, or compare engines using the chart settings.');
        for (const [key, value] of Object.entries({running:true, sample:0, time:0, measuredRate:0, measuredTicks:0, measuredAt:0})) {
            main_content.dataSetter({destination_path:'.' + key, value});
        }
        const bar = main_content.div({display:'flex', align_items:'center', gap:'12px', flex_wrap:'wrap', white_space:'nowrap', margin_bottom:'12px'});
        const rate = bar.select({value:'^.rate', default:'30', lbl:'Updates / second', lbl_position:'L', id:'stream-rate', width:'80px'});
        for (const hz of [2, 10, 30, 60]) rate.option(String(hz), {value:String(hz)});
        bar.button('Pause / resume', {id:'stream-toggle', action:"this.SET('.running',!this.GET('.running'))"});
        bar.button('Reset', {id:'stream-reset'}).dataController({func:'reset'});
        bar.span('^.measuredRate', {mask:'Observed updates/s: {}', id:'stream-observed'});
        bar.span('^.sample', {mask:'New samples: {}', id:'stream-samples'});
        const rows = new Bag();
        for (let sample = -599; sample <= 0; sample++) rows.setItem(`r${sample}`, null, curves(sample / 60));
        const config = new Bag({engine:'uplot', chartType:'line', captionField:'seconds', drawer:'close'});
        for (const [name, color] of [['signal', '#5470c6'], ['reference', '#ee6666']]) {
            config.setItem(`seriesOptions.${name}`, new Bag({caption:name[0].toUpperCase() + name.slice(1), color, axis:'left', selected:true}));
        }
        config.setItem('seriesOptions.seconds', new Bag({caption:'Seconds', color:'#3ba272', axis:'left', selected:false}));
        main_content.dataSetter({destination_path:'.rows', value:rows});
        main_content.dataSetter({destination_path:'.config', value:config});
        main_content.chartPane({storepath:'.rows', configpath:'.config', rowMode:'attributes', id:'stream-pane', height:'600px'});
        main_content.dataFormula({result_path:'.interval', formula:'running ? 1 / Number(rate) : 0', running:'^.running', rate:'^.rate', _init:true});
        main_content.dataController({func:'restartMeasurement', rate:'^.rate', running:'^.running'});
        main_content.dataController({func:'tick', _timing:'^.interval'});
        main_content.p('Samples are simulated in the browser and delivered through the normal CollectionStore. The observed rate measures timer updates, not rendered frames. No WebSocket or special streaming buffer is used.');
        main_content.p('Pause to inspect and zoom. Resuming follows the newest data; changing the rate keeps the last 600 samples.');
    }
}

/** Example-only signal generation. State and samples belong to Data, never to the chart engine. */
export class Logic {
    restartMeasurement(node) {
        node.SET('.measuredAt',performance.now());
        node.SET('.measuredTicks',0);
        node.SET('.measuredRate',0);
    }
    tick(node) {
        if(!node.GET('.running'))return;
        const sample=node.GET('.sample')+1;
        const t=node.GET('.time')+1/Number(node.GET('.rate'));
        const rows=node.GET('.rows');
        rows.popNode(rows.getNodes()[0].label);
        rows.setItem(`r${sample}`,null,curves(t));
        node.SET('.sample',sample);node.SET('.time',t);
        const ticks=node.GET('.measuredTicks')+1,elapsed=performance.now()-node.GET('.measuredAt');
        node.SET('.measuredTicks',ticks);
        if(elapsed>=1000) {
            node.SET('.measuredRate',Math.round(ticks*10000/elapsed)/10);
            node.SET('.measuredAt',performance.now());node.SET('.measuredTicks',0);
        }
    }
    reset(node) {
        node.SET('.running',false);
        const rows=new Bag();
        for(let sample=-599;sample<=0;sample++) {
            const t=sample/60;
            rows.setItem(`r${sample}`,null,curves(t));
        }
        node.SET('.rows',rows);node.SET('.sample',0);node.SET('.time',0);
        this.restartMeasurement(node);
    }
}
