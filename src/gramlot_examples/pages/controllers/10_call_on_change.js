import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Call on change';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'quote'});
        pane.h1('Call on change');

        const form = pane.form({class: 'card stack'});
        form.html_label('Quantity', {for: 'quantity'});
        form.input({type: 'number', min: 0, value: '^.quantity', live: true, id: 'quantity'});

        const result = pane.section({class: 'card stack'});
        result.h2('Quote');
        const facts = result.dl();
        for (const [label, key] of [['Total', 'total'], ['Status', 'status']]) {
            facts.dt(label);
            facts.dd(`^.${key}`, {id: key});
        }

        pane.dataRpc({method: 'quote', result_path: '.total', quantity: '^.quantity', _delay: 500, _init: true,
            _onCalling: "this.SET('.status', 'Asking the server for ' + quantity)",
            _onResult: "this.SET('.status', 'Answered ' + result + ' for ' + quantity)"});
        pane.dataSetter({destination_path: '.quantity', value: 1});
    }

    quote({quantity}) {
        quantity ??= 0;
        return quantity * (quantity >= 10 ? 8 : 10);
    }
}
Page.registerEndpoint('quote');

/** The page logic: this page names no methods. */
export class Logic {}
