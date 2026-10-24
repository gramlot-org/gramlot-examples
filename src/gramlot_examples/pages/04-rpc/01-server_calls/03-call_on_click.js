import {Page as BasePage} from '@gramlot/gramlot/page';

const SHOW_ERROR = "this.SET('.error', error.code + ': ' + error.message)";

/** The endpoint refuses the reservation; the class name reaches the page as error.remoteName. */
class OutOfStock extends Error {
    name = 'OutOfStock';
}

export class Page extends BasePage {
    static title = "Call the server from a button";

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

        const auth = pane.section({class: 'card stack'});
        auth.h2('0.2.15: Source authorization versus visibility');
        auth.p('Source-auth marker', {auth: 'admin', id: 'protected-source'});
        auth.p('Hidden marker is still delivered', {hidden: true, id: 'hidden-source'});
        auth.p('Without an authorized identity, the protected paragraph is omitted from Source.');

    }

    reserve({item}) { throw new OutOfStock(`${item} is out of stock`); }

    cancel({item}) { return false; }
}
Page.registerEndpoint('reserve');
Page.registerEndpoint('cancel', {auth: 'admin'});
