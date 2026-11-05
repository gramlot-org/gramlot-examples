import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const main_content = root.main({class: 'grouplet-demo', datapath: 'customer'});
        const toolbar = main_content.div({class: 'demo-toolbar'});
        toolbar.html_label('Customer type', {for: 'customer-kind'});
        const choice = toolbar.select({id: 'customer-kind', value: '^.kind'});
        choice.option('Private customer', {value: 'person'});
        choice.option('Company', {value: 'company'});
        toolbar.span('Draft held in this page', {class: 'demo-badge'});
        const workspace = main_content.div({class: 'demo-workspace'});
        workspace.grouplet({id: 'customer-fields', remote: 'customer_fields', remote_kind: '^.kind', class: 'demo-panel'});
        const summary = workspace.aside({class: 'demo-panel demo-summary'});
        summary.h2('Contact preview');
        summary.strong('^.email', {id: 'customer-email-summary'});
        summary.p('^.phone', {id: 'customer-phone-summary'});
        summary.p('^.notes', {id: 'customer-notes-summary'});
    }
    customer_fields(root, {kind}) {
        root.h2({person: 'Private customer', company: 'Company'}[kind], {id: 'customer-section-title'});
        const fields = root.formlet({columns: 2});
        const identity = kind === 'person' ? [['first_name', 'First name'], ['last_name', 'Last name']] : [['company', 'Company name'], ['vat', 'VAT number']];
        for (const [name, label] of [...identity, ['email', 'Email'], ['phone', 'Phone']]) {
            fields.textbox({value: `^.${name}`, lbl: label, id: `customer-${name}`, live: true});
        }
        root.textbox({value: '^.notes', lbl: 'Contact notes', id: 'customer-notes', live: true});
    }
}
Page.registerSource('customer_fields');
