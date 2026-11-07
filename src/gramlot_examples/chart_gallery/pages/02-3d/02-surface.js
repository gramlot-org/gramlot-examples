import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const frame = root.frameGrid({"datapath": "report", "storepath": ".rows", "rowMode": "values", "searchOn": true,
            "chart": "surface", "chart_engine": "plotly", "chart_captionField": "x",
            "height": "340px", "chart_secondCaptionField": "y"});
        const columns = frame.grid.struct();
        columns.column({field:"x", "name": "X", "width": "150px", "dtype": "N"});
        columns.column({field:"y", "name": "Y", "width": "150px", "dtype": "N"});
        columns.column({field:"height", "name": "Height", "width": "150px", "dtype": "N"});
    }
}
