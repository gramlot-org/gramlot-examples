import {Page as BasePage, source} from '@gramlot/native-html/page';

export class Page extends BasePage {
    static title = 'End-to-end story';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'story'});
        pane.h1('^.settings.caption', {id: 'caption'});

        const form = pane.form({class: 'card stack', node_id: 'form'});
        form.html_label('Caption', {for: 'caption-field'});
        form.input({value: '^.settings.caption', live: '^.live', id: 'caption-field'});
        const row = form.div();
        row.input({type: 'checkbox', value: '^.live', id: 'live'});
        row.html_label('live', {for: 'live'});
        form.html_label('Quantity', {for: 'quantity'});
        form.input({type: 'number', min: 0, value: '^.quantity', default: 2, id: 'quantity'});
        form.dataSetter({destination_path: '.settings.caption', value: 'A first caption'});
        const sizes = form.fieldset();
        sizes.legend('Size');
        for (const [key, label] of [['small', 'Small'], ['large', 'Large']]) {
            sizes.input({type: 'radio', group: 'size', value: `^.size.${key}`, id: key});
            sizes.html_label(label, {for: key});
        }
        const gift = form.div();
        gift.input({type: 'checkbox', value: '^.gift', id: 'gift'});
        gift.html_label('Gift wrap', {for: 'gift'});

        const result = pane.section({class: 'card stack'});
        result.p('^.total', {id: 'total'});
        const drawing = result.svg({viewBox: '0 0 200 200', role: 'img', aria_label: 'Total as a circle', class: 'example-art'});
        drawing.circle({cx: 100, cy: 100, r: '^.radius', fill: '^.color', id: 'circle'});
        result.button('Press, also with Shift', {id: 'press'}).dataController({func: 'press'});
        result.p('^.presses', {id: 'presses'});
        result.p('^.modifiers', {id: 'modifiers', class: 'muted'});

        pane.dataFormula({result_path: '.total', formula: 'quantity * (large ? 3 : 1) + (gift ? 5 : 0)', quantity: '^.quantity',
            large: '^.size.large', gift: '^.gift', _init: true});
        pane.dataFormula({result_path: '.radius', formula: 'Math.min(20 + total * 4, 90)', total: '^.total', _init: true});
        pane.dataController({func: 'paint', total: '^.total', _init: true});

        const later = pane.section({class: 'card stack', node_id: 'later'});
        later.h2('A later branch');
        const notes = later.ul({node_id: 'notes', id: 'notes'});
        for (const text of ['Setters live here too', 'This note can be removed under freeze']) notes.li(text);
        const actions = later.div({class: 'actions'});
        for (const [label, method] of [['Load extras', 'loadExtras'], ['Freeze', 'freeze'],
            ['Remove a note', 'removeNote'], ['Thaw', 'thaw']]) {
            actions.button(label, {id: method}).dataController({func: method});
        }
        later.section({node_id: 'extras', id: 'extras'}).p('No extras yet.', {class: 'muted'});
        later.dataSetter({destination_path: '.settings.caption', value: 'The story of a page'});
        later.dataSetter({destination_path: '.size', value: {small: true, large: false}});
        later.dataSetter({destination_path: '.gift', value: false});
        later.dataSetter({destination_path: '.live', value: false});
    }

    extras(root) {
        const branch = root.div({datapath: 'extras', class: 'stack'});
        branch.h3('^.title', {id: 'extras-title'});
        branch.p('^.items', {id: 'extras-items'});
        branch.dataSetter({destination_path: '.title', value: 'Extras from the server'});
        branch.dataSetter({destination_path: '.items', value: 'Ribbon, card, envelope'});
    }
}
source(Page.prototype.extras);
