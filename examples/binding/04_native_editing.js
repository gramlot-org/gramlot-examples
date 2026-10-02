import {Page as BasePage} from '@gramlot/gramlot/page';

const FIELDS = [['Text', 'text', 'text'], ['Number', 'number', 'number'], ['Range', 'range', 'range'],
    ['Date', 'date', 'date'], ['Color', 'color', 'color']];

export class Page extends BasePage {
    static title = 'Native editing';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'edit'});
        pane.h1('Native editing');
        pane.html_label('Write at every keystroke (live)', {for: 'live'});
        pane.input({type: 'checkbox', value: '^.live', id: 'live'});

        const grid = pane.div({class: 'grid'});
        const form = grid.form({class: 'card stack'});
        for (const [label, key, kind] of FIELDS) {
            form.html_label(label, {for: key});
            form.input({type: kind, value: `^.${key}`, live: '^.live', id: key});
        }
        form.html_label('Note', {for: 'note'});
        form.textarea({value: '^.note', live: '^.live', rows: 3, id: 'note'});
        form.html_label('Size', {for: 'size'});
        const size = form.select({value: '^.size', id: 'size'});
        for (const option of ['S', 'M', 'L']) size.option(option, {value: option});
        form.html_label('Topics', {for: 'topics'});
        const topics = form.select({value: '^.topics', multiple: true, size: 3, id: 'topics'});
        for (const option of ['HTML', 'SVG', 'Data']) topics.option(option, {value: option.toLowerCase()});

        const values = grid.section({class: 'card stack'});
        values.h2('The Data');
        const facts = values.dl();
        for (const [label, key] of FIELDS) {
            facts.dt(label);
            facts.dd(`^.${key}`, {id: `out-${key}`});
        }
        for (const [label, key] of [['Note', 'note'], ['Size', 'size'], ['Topics', 'topics']]) {
            facts.dt(label);
            facts.dd(`^.${key}`, {id: `out-${key}`});
        }

        pane.dataSetter({destination_path: '.live', value: false});
        pane.dataSetter({destination_path: '.text', value: 'Edit me'});
        pane.dataSetter({destination_path: '.number', value: 42});
        pane.dataSetter({destination_path: '.range', value: 30});
        pane.dataSetter({destination_path: '.date', value: '2026-09-30'});
        pane.dataSetter({destination_path: '.color', value: '#456bc4'});
        pane.dataSetter({destination_path: '.note', value: 'Two\nlines'});
        pane.dataSetter({destination_path: '.size', value: 'M'});
        pane.dataSetter({destination_path: '.topics', value: ['html', 'data']});
    }
}
