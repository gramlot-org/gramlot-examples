import {Page as BasePage} from '@gramlot/gramlot/page';

const RECORDS = {lamp: ['Lamp', 3], desk: ['Desk', 0], chair: ['Chair', 12]};

export class Page extends BasePage {
    static title = 'Remote';

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'catalog'});
        pane.h1('Remote');

        const form = pane.form({class: 'card stack'});
        form.html_label('Record', {for: 'record'});
        const choice = form.select({value: '^.record_id', id: 'record'});
        for (const [key, [name]] of Object.entries(RECORDS)) choice.option(name, {value: key});

        const details = pane.section('Waiting for the server', {class: 'card stack', id: 'details'});
        details.remote('details', {record_id: '^.record_id'});

    }

    details(root, {record_id}) {
        const [name, stock] = RECORDS[record_id];
        root.h2(name, {id: 'name'});
        root.p(`${stock} in stock`, {id: 'stock'});
    }
}
Page.registerSource('details');
