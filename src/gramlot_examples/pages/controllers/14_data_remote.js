import {Page as BasePage} from '@gramlot/gramlot/page';

const MENUS = {dishes: ['Soup', 'Risotto', 'Fish'], drinks: ['Water', 'Lemonade', 'Coffee']};

export class Page extends BasePage {
    static title = 'Data remote';

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'kitchen'});
        pane.h1('Data remote');

        const form = pane.form({class: 'card stack'});
        form.html_label('Table', {for: 'table'});
        const choice = form.select({value: '^.table', id: 'table'});
        for (const key of Object.keys(MENUS)) choice.option(key[0].toUpperCase() + key.slice(1), {value: key});

        const result = pane.section({class: 'card stack'});
        result.h2('Menu, loaded by the server when it is read');
        result.p('^.menu', {id: 'menu'});

        result.button('Read current value', {id: 'read-menu'}).dataController({func: 'readMenu'});
        result.p('Snapshot returned by the explicit read:', {class: 'muted'});
        result.p('^.read_value', {id: 'read-value'});

        pane.dataRemote({destination_path: '.menu', method: 'load_menu', cacheTime: 5, table: '^.table'});
        pane.dataSetter({destination_path: '.table', value: 'dishes'});
    }

    load_menu({table}) { return MENUS[table].join(', '); }
}
Page.registerEndpoint('load_menu');

/** The explicit read returns the stored value and may start a resolver refresh. */
export class Logic {
    readMenu(node) {
        node.SET('.read_value', node.GET('.menu'));
    }
}
