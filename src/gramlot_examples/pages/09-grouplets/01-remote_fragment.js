import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Customer onboarding: adapt the customer details';
    main(root) {
        const main_content = root.main({class: 'grouplet-demo', datapath: 'customer'});
        main_content.p('CUSTOMER ONBOARDING', {class: 'eyebrow'});
        main_content.h1('One customer editor, two kinds of customer');
        main_content.p('Choose a private customer or a company. The server builds the appropriate fields inside the same page; the contact details and draft remain available.', {class: 'demo-intro'});
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
        summary.p('The preview follows your edits without another server request.');
        summary.strong('^.email', {id: 'customer-email-summary'});
        summary.p('^.phone', {id: 'customer-phone-summary'});
        summary.p('^.notes', {id: 'customer-notes-summary'});
        main_content.div('Try it: enter a company and VAT number, switch to Private customer, then switch back. The fields change, but your company draft is still there.', {class: 'demo-task'});
    }
    customer_fields(root, {kind}) {
        root.h2({person: 'Private customer', company: 'Company'}[kind], {id: 'customer-section-title'});
        const fields = root.formlet({columns: 2});
        const identity = kind === 'person' ? [['first_name', 'First name'], ['last_name', 'Last name']] : [['company', 'Company name'], ['vat', 'VAT number']];
        for (const [name, label] of [...identity, ['email', 'Email'], ['phone', 'Phone']]) {
            fields.textbox({value: `^.${name}`, lbl: label, id: `customer-${name}`, live: true});
        }
        root.textbox({value: '^.notes', lbl: 'Contact notes', id: 'customer-notes', live: true});
        root.p('These are editable customer details, not a saved database record.', {class: 'demo-caption'});
    }
}
Page.registerSource('customer_fields');
