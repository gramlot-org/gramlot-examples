import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Pointers';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack'});
        pane.h1('^settings.caption', {id: 'caption'});
        pane.p('^settings.intro', {class: 'muted'});

        const settings = pane.section({datapath: 'settings', node_id: 'settings', class: 'card stack'});
        settings.h2('Relative pointers');
        settings.html_label('Caption', {for: 'caption-field'});
        settings.input({value: '^.caption', id: 'caption-field'});
        settings.p("Inside datapath='settings', .caption means settings.caption.");
        settings.p('=.caption', {id: 'first-caption', title: 'Read once with =: it does not follow the field.'});

        const person = pane.section({datapath: 'person', formId: 'person', class: 'card stack'});
        person.h2('Symbolic and attribute pointers');
        const facts = person.dl();
        facts.dt('#settings.caption');
        facts.dd('^#settings.caption', {id: 'symbolic'});
        facts.dt('#FORM.name');
        facts.dd('^#FORM.name', {id: 'form-name'});
        facts.dt('.name?role');
        facts.dd('^.name?role', {id: 'role'});
        person.html_label('Role', {for: 'role-field'});
        person.input({value: '^.name?role', id: 'role-field'});

        pane.dataSetter({destination_path: 'settings.caption', value: 'Pointers'});
        pane.dataSetter({destination_path: 'settings.intro', value: 'Type in the fields: every ^ pointer follows the Data.'});
        pane.dataSetter({destination_path: 'person.name', value: 'Ada Lovelace', role: 'Mathematician'});
    }
}

/** The page logic: this page names no methods. */
export class Logic {}
