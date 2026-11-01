import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Order addresses: reuse one editor twice';
    main(root) {
        const main_content = root.main({class: 'grouplet-demo', datapath: 'order'});
        const columns = main_content.div({class: 'demo-addresses'});
        for (const [slot, title] of [['billing', 'Billing address'], ['shipping', 'Delivery address']]) {
            columns.grouplet({id: `${slot}-editor`, datapath: `.${slot}`, remote: 'address_fields', remote_slot: slot, remote_title: title, class: 'demo-panel'});
        }
        const summary = main_content.section({class: 'demo-panel'});
        summary.h2('Order routing preview');
        const rows = summary.div({class: 'demo-addresses'});
        for (const [slot, title] of [['billing', 'Send the invoice to'], ['shipping', 'Deliver the goods to']]) {
            const block = rows.div({datapath: `.${slot}`, class: 'demo-summary'});
            block.h3(title);
            block.strong('^.recipient', {id: `${slot}-recipient-summary`});
            block.p('^.street', {id: `${slot}-street-summary`});
            block.p('^.city', {id: `${slot}-city-summary`});
            block.p('^.country');
        }
    }
    address_fields(root, {slot, title}) {
        root.h2(title);
        root.textbox({value: '^.recipient', lbl: 'Recipient / company', id: `${slot}-recipient`, live: true});
        root.textbox({value: '^.street', lbl: 'Street and number', id: `${slot}-street`, live: true});
        const fields = root.formlet({columns: 2});
        for (const [name, label] of [['city', 'City'], ['zip', 'Postal code'], ['region', 'Region'], ['country', 'Country']]) {
            fields.textbox({value: `^.${name}`, lbl: label, id: `${slot}-${name}`, live: true});
        }
        root.textbox({value: '^.instructions', lbl: 'Delivery / invoice instructions', id: `${slot}-instructions`, live: true});
    }
}
Page.registerSource('address_fields');
