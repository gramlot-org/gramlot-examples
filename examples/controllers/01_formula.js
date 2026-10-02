import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Formula';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'order'});
        pane.h1('Formula');
        const form = pane.form({class: 'card stack'});
        for (const [label, key] of [['Price', 'price'], ['Quantity', 'quantity'], ['VAT rate', 'vat']]) {
            form.html_label(label, {for: key});
            form.input({type: 'number', step: 'any', value: `^.${key}`, live: true, id: key});
        }

        const result = pane.section({class: 'card stack'});
        result.h2('Results');
        const facts = result.dl();
        for (const [label, key] of [['Total (price × quantity)', 'total'], ['Gross (total × (1 + VAT), = vat)', 'gross'],
            ['Size (_if / _else)', 'size']]) {
            facts.dt(label);
            facts.dd(`^.${key}`, {id: key});
        }

        pane.dataFormula({result_path: '.total', formula: 'price * quantity', price: '^.price', quantity: '^.quantity', _init: true});
        pane.dataFormula({result_path: '.gross', formula: 'Math.round(total * (1 + vat) * 100) / 100', total: '^.total', vat: '=.vat',
            _init: true});
        pane.dataFormula({result_path: '.size', formula: "'large order'", total: '^.total', _if: 'total > 100', _else: "'small order'",
            _init: true});
        pane.dataSetter({destination_path: '.price', value: 12.5});
        pane.dataSetter({destination_path: '.quantity', value: 4});
        pane.dataSetter({destination_path: '.vat', value: 0.2});
    }
}
