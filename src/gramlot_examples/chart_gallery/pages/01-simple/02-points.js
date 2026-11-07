import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const frame = root.frameGrid({"datapath": "report", "storepath": ".rows", "rowMode": "values", "searchOn": true,
            "chart": "scatter", "chart_engine": "plotly", "chart_captionField": "x",
            "height": "340px"});
        const columns = frame.grid.struct();
        columns.column({field:"x", "name": "Input", "width": "150px", "dtype": "N"});
        columns.column({field:"value", "name": "Observed", "width": "150px", "dtype": "N"});
    }
}
