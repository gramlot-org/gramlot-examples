import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const frame = root.frameGrid({"datapath": "report", "storepath": ".rows", "rowMode": "values", "searchOn": true,
            "chart": "bar3D", "chart_engine": "echarts", "chart_captionField": "region",
            "height": "340px", "chart_secondCaptionField": "quarter"});
        const columns = frame.grid.struct();
        columns.column({field:"region", "name": "Region", "width": "150px"});
        columns.column({field:"quarter", "name": "Quarter", "width": "150px"});
        columns.column({field:"revenue", "name": "Revenue", "width": "150px", "dtype": "N"});
    }
}
