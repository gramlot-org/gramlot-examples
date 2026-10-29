import {Page as BasePage} from '@gramlot/gramlot/page';
import grouplets from '../../gallery/dist/grouplets/descriptor.js';
import inputs from '../../gallery/dist/inputs/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';

export class Page extends BasePage {
    static title = 'Shipping desk: card actions and scoped Clear';
    static gramlots = [grouplets, inputs, layout];
    main(root) {
        const main_content = root.main({class: 'grouplet-demo', datapath: 'order'});
        main_content.p('SHIPPING DESK · SO-1042', {class: 'eyebrow'});
        main_content.h1('Change delivery arrangements without losing the order');
        main_content.p('North Workshop ordered 12 workshop lights. Use Actions on the delivery card to arrange a morning delivery or prepare a contact note. Clear starts a new delivery draft while keeping the order and invoice details.', {class: 'demo-intro'});
        main_content.dataFormula({result_path: '.shipping.canClear', formula: '!invoiced', invoiced: '^.invoiced', _init: true});
        main_content.dataFormula({result_path: '.lockMessage', formula: "invoiced ? 'Invoiced: Clear is locked on both cards.' : 'Draft order: Clear is available after confirmation.'", invoiced: '^.invoiced', _init: true});
        const toolbar = main_content.div({class: 'demo-toolbar'});
        toolbar.checkbox({value: '^.invoiced', lbl: 'Order invoiced — lock Clear', lbl_position: 'R', id: 'actions-invoiced'});
        toolbar.button('Reload shipping cards', {id: 'actions-reload', action: "this.SET('.revision', this.GET('.revision') + 1)"});
        main_content.p('^.lockMessage', {id: 'actions-lock', class: 'demo-badge'});
        const overview = main_content.section({class: 'demo-panel demo-summary'});
        overview.h2('Order and invoice — retained by Clear');
        overview.strong('^.reference', {id: 'actions-order-summary'});
        overview.p('^.customer.name'); overview.p('^.billing.recipient'); overview.p('^.billing.street');
        overview.p('^.billing.city', {id: 'actions-billing-summary'});
        main_content.grouplet({remote: 'shipping_card', remote_revision: '^.revision', id: 'shipping-workbench'});
        const briefing = main_content.section({class: 'demo-panel demo-summary'});
        briefing.h2('Live dispatch briefing');
        briefing.p('^.shipping.status', {id: 'actions-status'});
        briefing.strong('^.shipping.address.recipient', {id: 'actions-recipient-summary'});
        briefing.p('^.shipping.address.street', {id: 'actions-street-summary'});
        briefing.p('^.shipping.address.city', {id: 'actions-city-summary'});
        briefing.p('^.shipping.window', {id: 'actions-window-summary'});
        briefing.p('^.shipping.instructions', {id: 'actions-instructions-summary'});
        briefing.p('Tracking reference (not an editable card field)');
        briefing.strong('^.shipping.tracking', {id: 'actions-tracking-summary'});
        main_content.div('Try it: choose Morning delivery from Actions; mark Reviewed; fold the address. Cancel Clear once, then confirm it. The nested address and delivery fields empty, but order, invoice, tracking and review/fold states remain. Tick Order invoiced and inspect the disabled Clear entries. Reload to verify that the draft is retained.', {class: 'demo-task'});
        main_content.p("All actions change this page's Data only. Preparing a contact note does not send a message; Clear does not delete a database order.", {class: 'demo-caption'});
    }
    shipping_card(root, {revision}) {
        root.p(`Shipping editor loaded · revision ${revision}`, {id: 'actions-revision', class: 'demo-caption'});
        const card = root.groupletCard({id: 'actions-delivery', datapath: '.shipping', title: 'Delivery arrangements', collapsible: true, collapsed: '^.ui.closed', checkbox: '^.ui.checked', checkboxLabel: 'Reviewed', delitem: '^.canClear'});
        const menu = card.menu();
        menu.menuline({caption: 'Morning delivery', id: 'actions-morning', action: "this.SET('.window', 'Tuesday, 09:00–12:00'); this.SET('.instructions', 'Call 30 minutes before arrival. Use gate B.'); this.SET('.status', 'Morning delivery requested — confirm with the carrier.')"});
        menu.menuline({caption: 'Prepare contact note', id: 'actions-contact-note', action: "this.SET('.status', 'Contact ' + (this.GET('.contact') || 'the recipient') + ' on ' + (this.GET('.phone') || 'a phone number to be entered') + ' to confirm access.')"});
        card.p('Clear in this header empties delivery fields and the nested address. Use Clear on Address only to replace just the destination.', {class: 'demo-caption'});
        const fields = card.formlet({col_min_width: '15rem'});
        for (const [name, label] of [['contact','Delivery contact'], ['phone','Phone'], ['window','Delivery window'], ['instructions','Unloading instructions']]) {
            fields.textbox({value: `^.${name}`, lbl: label, live: true, id: `actions-${name}`});
        }
        fields.textbox({value: '^order.reference', lbl: "Order reference — outside this card's data", live: true, id: 'actions-order-reference'});
        card.groupletCard({id: 'actions-address', datapath: '.address', title: 'Delivery address', chromeSide: 'left', collapsible: true, collapsed: '^.ui.closed', delitem: '^order.shipping.canClear', remote: 'shipping_address', class: 'order-section'});
    }
    shipping_address(root) {
        const fields = root.formlet({col_min_width: '15rem'});
        for (const [name, label] of [['recipient','Recipient'], ['street','Street and number'], ['city','City'], ['zip','Postal code'], ['country','Country'], ['reference','Access reference']]) {
            fields.textbox({value: `^.${name}`, lbl: label, live: true, id: `actions-address-${name}`});
        }
    }
}
Page.registerSource('shipping_card');
Page.registerSource('shipping_address');
