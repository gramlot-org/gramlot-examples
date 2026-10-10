import {Page as BasePage} from '@gramlot/gramlot/page';

const SHOW_ERROR = "this.SET('.error', error.code + ': ' + error.message)";

export class Page extends BasePage {
    static title = 'Call on click';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'stock'});
        pane.h1('Call on click');

        const calls = pane.section({class: 'card stack'});
        calls.h2('A dataRpc nested in the button');
        const reserve = calls.button('Reserve the item', {id: 'reserve'});
        reserve.dataRpc({method: 'reserve', result_path: '.reserved', item: '=.item', _onError: SHOW_ERROR});
        const cancel = calls.button('Cancel the order (auth)', {id: 'cancel'});
        cancel.dataRpc({method: 'cancel', result_path: '.reserved', item: '=.item', _onError: SHOW_ERROR});
        const facts = calls.dl();
        for (const [label, key] of [['Item', 'item'], ['Reserved', 'reserved'], ['Error', 'error']]) {
            facts.dt(label);
            facts.dd(`^.${key}`, {id: key});
        }

        pane.dataSetter({destination_path: '.item', value: 'Lamp'});
    }

    reserve({item}) { throw new Error(`${item} is out of stock`); }

    cancel() { return false; }
}
Page.registerEndpoint('reserve');
Page.registerEndpoint('cancel', {auth: 'admin'});

/** The page logic: this page names no methods. */
export class Logic {}
