import {Page as BasePage} from '@gramlot/native-html/page';

const REGIONS = [['North', 12, 'var(--gramlot-action)'], ['South', 9, 'var(--gramlot-warning)'], ['West', 15, 'var(--gramlot-success)']];

export class Page extends BasePage {
    static title = 'Static report';
    static css = ['/themes/gramlot-base/theme.css', '/examples/html_svg/11_static_report/style.css'];

    main(root) {
        const page = root.main({class: 'example-page stack'});
        const header = page.header();
        header.p('SAMPLE REPORT', {class: 'eyebrow'});
        header.h1('Orders by region');
        header.p('A fixed dataset feeds the summary, chart and table.');
        const total = REGIONS.reduce((sum, region) => sum + region[1], 0);
        this.summary(page, total);
        this.chart(page);
        this.table(page, total);
    }

    summary(page, total) {
        const summary = page.section({class: 'grid report-summary', aria_label: 'Summary'});
        this.stat(summary, 'Total orders', String(total));
        this.stat(summary, 'Regions', String(REGIONS.length));
    }

    chart(page) {
        const chart = page.figure({class: 'card'});
        const svg = chart.svg({viewBox: '0 0 520 230', role: 'img', aria_labelledby: 'report-chart-title', class: 'example-art'});
        svg.title('Orders by region: North 12, South 9, West 15', {id: 'report-chart-title'});
        REGIONS.forEach(([region, value, color], index) => {
            const y = 28 + index * 68;
            svg.text(region, {x: 12, y: y + 23, font_size: 17, fill: 'currentColor'});
            svg.rect({x: 105, y, width: value * 23, height: 32, rx: 7, fill: color});
            svg.text(String(value), {x: 112 + value * 23, y: y + 23, font_size: 17, fill: 'currentColor'});
        });
        chart.figcaption('The bar lengths and table cells use the same values.');
        const legend = page.ul({class: 'report-legend'});
        for (const [region, , color] of REGIONS) {
            const item = legend.li();
            item.span('■ ', {style: `color: ${color}`});
            item.span(region);
        }
    }

    table(page, total) {
        const table = page.table();
        table.caption('Exact figures');
        const head = table.thead().tr();
        head.th('Region', {scope: 'col'});
        head.th('Orders', {scope: 'col'});
        const body = table.tbody();
        for (const [region, value] of REGIONS) {
            const row = body.tr();
            row.th(region, {scope: 'row'});
            row.td(String(value));
        }
        const foot = table.tfoot().tr();
        foot.th('Total', {scope: 'row'});
        foot.td(String(total));
    }

    stat(parent, label, value) {
        const card = parent.div({class: 'card'});
        card.p(label, {class: 'muted'});
        card.p(value, {class: 'report-number'});
    }
}
