import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Service visit: compose a site dossier';
    main(root) {
        const main_content = root.main({class: 'grouplet-demo', datapath: 'visit'});
        const toolbar = main_content.div({class: 'demo-toolbar'});
        toolbar.button('Reload site section', {id: 'reload-site', action: "this.SET('.revision', this.GET('.revision') + 1)"});
        toolbar.span('Draft held in this page', {class: 'demo-badge'});
        main_content.grouplet({id: 'site-dossier', datapath: '.site', remote: 'site_profile', remote_revision: '^visit.revision', class: 'demo-panel'});
        const summary = main_content.section({class: 'demo-panel demo-summary'});
        summary.h2('Visit briefing');
        summary.strong('^.site.name', {id: 'site-summary'});
        summary.p('^.site.contact.name', {id: 'contact-summary'});
        summary.p('^.site.contact.phone', {id: 'phone-summary'});
        summary.p('^.site.address.street', {id: 'street-summary'});
        summary.p('^.site.address.city', {id: 'city-summary'});
        summary.p('^.site.instructions', {id: 'instructions-summary'});
    }
    site_profile(root, {revision}) {
        root.h2('Site details');
        root.p(`Section loaded · revision ${revision}`, {id: 'site-revision', class: 'demo-caption'});
        root.textbox({value: '^.name', lbl: 'Site name', id: 'site-name', live: true});
        const columns = root.div({class: 'demo-addresses'});
        columns.grouplet({id: 'site-contact', datapath: '.contact', remote: 'contact_fields', class: 'demo-subsection'});
        columns.grouplet({id: 'site-address', datapath: '.address', remote: 'address_fields', class: 'demo-subsection'});
        root.textbox({value: '^.instructions', lbl: 'Access instructions', id: 'site-instructions', live: true});
    }
    contact_fields(root) {
        root.h3('On-site contact');
        for (const [name, label] of [['name', 'Full name'], ['role', 'Role'], ['email', 'Email'], ['phone', 'Phone']]) {
            root.textbox({value: `^.${name}`, lbl: label, id: `contact-${name}`, live: true});
        }
    }
    address_fields(root) {
        root.h3('Site address');
        for (const [name, label] of [['street', 'Street and number'], ['city', 'City'], ['zip', 'Postal code'], ['country', 'Country']]) {
            root.textbox({value: `^.${name}`, lbl: label, id: `site-${name}`, live: true});
        }
    }
}
Page.registerSource('site_profile');
Page.registerSource('contact_fields');
Page.registerSource('address_fields');
