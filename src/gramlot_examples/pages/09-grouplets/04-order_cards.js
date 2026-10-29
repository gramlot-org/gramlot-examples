import {Page as BasePage} from '@gramlot/gramlot/page';
import grouplets from '../../gallery/dist/grouplets/descriptor.js';
import inputs from '../../gallery/dist/inputs/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';

export class Page extends BasePage {
    static title = 'Order review: work with grouplet cards';
    static gramlots = [grouplets, inputs, layout];
    main(root) {
        const main_content = root.main({class: 'grouplet-demo', datapath: 'order'});
        main_content.p('ORDER SO-1042 · 12 WORKSHOP LIGHTS', {class: 'eyebrow'});
        main_content.h1('Review the customer, invoice and delivery together');
        main_content.p('Each card keeps one part of the order together. Edit the fields, mark a section as reviewed using its header checkbox, and fold completed sections. The dispatch briefing stays visible below.', {class: 'demo-intro'});
        main_content.dataFormula({result_path: '.reviewed', formula: "(customer ? 1 : 0) + (billing ? 1 : 0) + (shipping ? 1 : 0)", customer: '^.customer.ui.checked', billing: '^.billing.ui.checked', shipping: '^.shipping.ui.checked', _init: true});
        main_content.dataFormula({result_path: '.progress', formula: "reviewed + ' of 3 sections reviewed'", reviewed: '^.reviewed', _init: true});
        const toolbar = main_content.div({class: 'demo-toolbar'});
        toolbar.button('Reload order cards', {id: 'reload-cards', action: "this.SET('.revision', this.GET('.revision') + 1)"});
        toolbar.checkbox({value: '^.shipping.ui.closed', lbl: 'Fold delivery', lbl_position: 'R', id: 'fold-delivery'});
        toolbar.checkbox({value: '^.shipping.ui.checked', lbl: 'Delivery reviewed', lbl_position: 'R', id: 'review-delivery'});
        toolbar.span('^.progress', {id: 'review-progress', class: 'demo-badge'});
        main_content.groupletCard({id: 'order-card', title: '^.reference', collapsible: true, collapsed: '^.ui.closed', remote: 'order_cards', remote_revision: '^.revision'});
        const summary = main_content.section({class: 'demo-panel demo-summary'});
        summary.h2('Dispatch briefing');
        summary.strong('^.customer.name', {id: 'order-customer-summary'});
        summary.p('^.customer.email', {id: 'order-email-summary'});
        summary.p('Invoice recipient');
        summary.strong('^.billing.recipient', {id: 'order-billing-summary'});
        summary.p('^.billing.city', {id: 'order-billing-city-summary'});
        summary.p('Delivery destination');
        summary.strong('^.shipping.address.recipient', {id: 'order-shipping-summary'});
        summary.p('^.shipping.address.street', {id: 'order-street-summary'});
        summary.p('^.shipping.address.city', {id: 'order-city-summary'});
        summary.p('^.shipping.window', {id: 'order-window-summary'});
        summary.p('^.shipping.instructions', {id: 'order-instructions-summary'});
        main_content.div('Try it: change the workshop city and delivery instructions, mark Delivery reviewed, fold the address inside that card, then reload the order cards. Your edits, review marks and fold states stay in this page. Expanding or folding a card makes no server request.', {class: 'demo-task'});
        main_content.p('Review marks are a local checklist. This lesson does not save or validate a database order.', {class: 'demo-caption'});
    }
    order_cards(root, {revision}) {
        root.p(`Order sections loaded · revision ${revision}`, {id: 'order-revision', class: 'demo-caption'});
        const customer = root.groupletCard({id: 'customer-card', datapath: '.customer', title: '^.name', collapsible: true, collapsed: '^.ui.closed', checkbox: '^.ui.checked', checkboxLabel: 'Reviewed', class: 'order-section'});
        customer.p('Contact details · the title follows the customer name as you edit it.', {class: 'demo-caption'});
        const fields = customer.formlet({col_min_width: '15rem'});
        for (const [name, label] of [['name', 'Customer name'], ['contact', 'Contact person'], ['email', 'Email'], ['phone', 'Phone']]) {
            fields.textbox({value: `^.${name}`, lbl: label, id: `order-customer-${name}`, live: true});
        }
        root.groupletCard({id: 'billing-card', datapath: '.billing', title: '^.title', chromeSide: 'left', collapsible: true, collapsed: '^.ui.closed', checkbox: '^.ui.checked', checkboxLabel: 'Reviewed', remote: 'order_address_fields', remote_slot: 'billing', class: 'order-section'});
        root.groupletCard({id: 'delivery-card', datapath: '.shipping', title: '^.title', chromeSide: 'right', collapsible: true, collapsed: '^.ui.closed', checkbox: '^.ui.checked', checkboxLabel: 'Reviewed', remote: 'order_delivery_fields', class: 'order-section'});
    }
    order_address_fields(root, {slot}) {
        const fields = root.formlet({col_min_width: '15rem'});
        for (const [name, label] of [['recipient', 'Recipient'], ['street', 'Street and number'], ['city', 'City'], ['zip', 'Postal code'], ['country', 'Country'], ['reference', 'Reference']]) {
            fields.textbox({value: `^.${name}`, lbl: label, id: `order-${slot}-${name}`, live: true});
        }
    }
    order_delivery_fields(root) {
        root.p('The address card below folds independently of the delivery card around it.', {class: 'demo-caption'});
        root.textbox({value: '^.window', lbl: 'Delivery window', id: 'order-delivery-window', live: true});
        root.textbox({value: '^.instructions', lbl: 'Unloading instructions', id: 'order-delivery-instructions', live: true});
        root.groupletCard({id: 'workshop-card', datapath: '.address', title: '^.title', collapsible: true, collapsed: '^.ui.closed', remote: 'order_address_fields', remote_slot: 'shipping', class: 'order-section'});
    }
}
Page.registerSource('order_cards');
Page.registerSource('order_address_fields');
Page.registerSource('order_delivery_fields');
