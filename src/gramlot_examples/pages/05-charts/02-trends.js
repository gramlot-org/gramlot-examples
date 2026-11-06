import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const frame = root.frameGrid({"datapath": "report", "storepath": ".rows", "rowMode": "values", "searchOn": true,
            "chart": "line", "chart_engine": "echarts", "chart_captionField": "x",
            "height": "340px"});
        const columns = frame.grid.struct();
        columns.column({field:"x", "name": "Sample", "width": "150px", "dtype": "L"});
        columns.column({field:"revenue", "name": "Signal A", "width": "150px", "dtype": "N"});
        columns.column({field:"margin", "name": "Signal B", "width": "150px", "dtype": "N"});
    }
}
