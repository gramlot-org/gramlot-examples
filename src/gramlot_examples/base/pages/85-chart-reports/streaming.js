import {Bag} from '@gramlot/gramlot/page';

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
        rows.setItem(`r${sample}`,null,{seconds:t,signal:Math.sin(2*Math.PI*0.2*t),reference:0.6*Math.sin(2*Math.PI*0.2*t+0.8)});
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
            rows.setItem(`r${sample}`,null,{seconds:t,signal:Math.sin(2*Math.PI*0.2*t),reference:0.6*Math.sin(2*Math.PI*0.2*t+0.8)});
        }
        node.SET('.rows',rows);node.SET('.sample',0);node.SET('.time',0);
        this.restartMeasurement(node);
    }
}
