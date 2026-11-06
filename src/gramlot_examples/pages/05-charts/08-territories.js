import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.dataFormula({result_path:"report._chart.geoJSON", formula:"JSON.parse(text)", text:"^report.geometry", _onBuilt:true});
        const frame = root.frameGrid({"datapath": "report", "storepath": ".rows", "rowMode": "values", "searchOn": true,
            "chart": "map", "chart_engine": "echarts", "chart_captionField": "region",
            "height": "340px", "chart_mapValueField": "revenue"});
        const columns = frame.grid.struct();
        columns.column({field:"region", "name": "Region", "width": "150px"});
        columns.column({field:"revenue", "name": "Revenue", "width": "150px", "dtype": "N"});
        columns.column({field:"margin", "name": "Margin", "width": "150px", "dtype": "N"});
    }
}
