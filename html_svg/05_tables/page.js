import {Page as BasePage} from '@gramlot/native-html/page';

const ROWS = [['North', 12, 8], ['South', 9, 11], ['West', 15, 6]];

export class Page extends BasePage {
    static title = 'Tables';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const page = root.main({class: 'example-page stack'});
        page.h1('A small regional report');
        page.p('Rows come from data; totals are computed before Source is built.');
        const table = page.table();
        table.caption('Orders by region and quarter');
        const heading = table.thead().tr();
        for (const label of ['Region', 'Q1', 'Q2', 'Total']) heading.th(label, {scope: 'col'});
        const body = table.tbody();
        for (const [region, q1, q2] of ROWS) {
            const row = body.tr();
            row.th(region, {scope: 'row'});
            for (const value of [q1, q2, q1 + q2]) row.td(String(value));
        }
        const total = table.tfoot().tr();
        total.th('All regions', {scope: 'row'});
        for (const value of [ROWS.reduce((n, row) => n + row[1], 0), ROWS.reduce((n, row) => n + row[2], 0), ROWS.reduce((n, row) => n + row[1] + row[2], 0)]) total.td(String(value));
    }
}
