import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Data exchange';
    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'exchange'});
        pane.h1('Data exchange');
        const form = pane.section({class: 'card stack', datapath: '.record'});
        form.html_label('Name', {for: 'name'});
        form.input({value: '^.name', id: 'name'});
        form.html_label('Seats', {for: 'seats'});
        form.input({type: 'number', value: '^.seats', id: 'seats'});
        form.html_label('Confirmed', {for: 'confirmed'});
        form.input({type: 'checkbox', value: '^.confirmed', id: 'confirmed'});
        form.p('The record also contains a null note and a nested address.');
        const actions = pane.div({class: 'actions'});
        for (const [label, method] of [['Inspect types', 'inspect'], ['Save TYTX', 'save'],
            ['Restore TYTX', 'restore'], ['Export JSON', 'exportJson'], ['Export XML', 'exportXml'],
            ['Preview email text', 'previewMail']]) {
            actions.button(label, {type: 'button', id: method}).dataController({func: method});
        }
        pane.p('^.status', {id: 'status'});
        pane.pre('^.types', {id: 'types'});
        pane.pre('^.mail', {id: 'mail'});
        pane.dataSetter({destination_path: '.record', value: {name: 'Ada', seats: 2, confirmed: true,
            note: null, address: {city: 'Rome'}}});
        pane.dataSetter({destination_path: '.status', value: 'Choose an action; files stay under your control.'});
    }
}

export class Logic {
    inspect(node) {
        const record = node.GET('.record');
        node.SET('.types', `name: ${typeof record.getItem('name')}
seats: ${typeof record.getItem('seats')}
confirmed: ${typeof record.getItem('confirmed')}
note: ${record.getItem('note') === null ? 'null' : typeof record.getItem('note')}
city: ${record.getItem('address.city')}`);
    }
    save(node) { this.page.utl.inout.save('exchange.record', 'registration.tytx.json'); node.SET('.status', 'TYTX download requested'); }
    async restore(node) {
        try {
            await this.page.utl.inout.restore('exchange.record');
            this.inspect(node); node.SET('.status', 'Restored typed Data');
        } catch (error) { node.SET('.status', error.message); }
    }
    exportJson() { this.page.utl.inout.download('exchange.record', 'registration.json', 'json'); }
    exportXml() { this.page.utl.inout.download('exchange.record', 'registration.xml', 'xml'); }
    previewMail(node) { node.SET('.mail', this.page.utl.inout.mailText('exchange.record')); }
}
