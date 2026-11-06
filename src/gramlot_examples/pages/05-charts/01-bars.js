import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.numberTextBox({value:"^report.rows.north.revenue", lbl:"North revenue", dtype:"L", live:true});
        const frame = root.frameGrid({"datapath": "report", "storepath": ".rows", "rowMode": "values", "searchOn": true,
            "chart": true, "chart_captionField": "region",
            "height": "340px"});
        const columns = frame.grid.struct();
        columns.column({field:"region", "name": "Region", "width": "150px"});
        columns.column({field:"revenue", "name": "Revenue", "width": "150px", "dtype": "N"});
        columns.column({field:"margin", "name": "Margin", "width": "150px", "dtype": "N"});
    }
}
