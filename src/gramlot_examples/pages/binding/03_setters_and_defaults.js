import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Setters and defaults';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'order'});
        pane.h1('Setters and defaults');
        pane.p('Every value below was in the Data before the first render.', {class: 'muted'});

        const form = pane.form({class: 'card stack'});
        form.html_label('Customer', {for: 'customer'});
        form.input({value: '^.customer', id: 'customer'});
        form.html_label('Quantity (default 1)', {for: 'quantity'});
        form.input({type: 'number', value: '^.quantity', default: 1, id: 'quantity'});
        form.html_label('Note (default_value wins over default)', {for: 'note'});
        form.input({value: '^.note', default_value: 'No note', default: 'Never used', id: 'note'});
        form.html_label('Price', {for: 'price'});
        form.input({type: 'number', value: '^.price', attr_currency: 'EUR', id: 'price'});

        const summary = pane.section({class: 'card stack'});
        summary.h2('The Data');
        const facts = summary.dl();
        for (const [label, pointer, key] of [['Customer', '^.customer', 'out-customer'],
            ['Quantity', '^.quantity', 'out-quantity'],
            ['Note', '^.note', 'out-note'],
            ['Price', '^.price', 'out-price'],
            ['Currency (price?currency)', '^.price?currency', 'out-currency'],
            ['Shipping city', '^.shipping.city', 'out-city']]) {
            facts.dt(label);
            facts.dd(pointer, {id: key});
        }

        pane.dataSetter({destination_path: '.customer', value: 'Ada Lovelace'});
        pane.dataSetter({destination_path: '.price', value: 12.5});
        const later = pane.section({class: 'muted'});
        later.p('This section holds the second setters: a descendant writes after its ancestors.');
        later.dataSetter({destination_path: '.customer', value: 'Grace Hopper'});
        later.dataSetter({destination_path: '.shipping', value: {city: 'London', zone: 'EU'}});
    }
}

/** The page logic: this page names no methods. */
export class Logic {}
