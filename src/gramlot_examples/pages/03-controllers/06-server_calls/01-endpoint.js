import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Endpoint';

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'invoice'});
        pane.h1('Endpoint');

        const result = pane.section({class: 'card stack'});
        result.h2('Total with VAT, computed by the server');
        const facts = result.dl();
        for (const [label, key] of [['Price', 'price'], ['VAT rate (%)', 'rate'], ['Total with VAT', 'gross']]) {
            facts.dt(label);
            facts.dd(`^.${key}`, {id: key});
        }

        pane.dataRpc({method: 'with_vat', result_path: '.gross', price: '=.price', rate: '=.rate', _init: true});
        pane.dataSetter({destination_path: '.price', value: 12.5});
        pane.dataSetter({destination_path: '.rate', value: 22});
    }

    // Half up to the cent, as the Python twin: floor(x + 0.5).
    with_vat({price, rate}) { return Math.floor(price * (100 + rate) + 0.5) / 100; }
}
Page.registerEndpoint('with_vat');
