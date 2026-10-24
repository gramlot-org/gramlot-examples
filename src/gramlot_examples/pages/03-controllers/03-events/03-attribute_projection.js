import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Attribute projection';
    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'projection'});
        pane.h1('Attribute projection');
        pane.h2('0.2.0: one value, several projections');
        pane.html_label('Name', {for: 'name'});
        pane.input({value: '^.name', live: true, id: 'name'});
        pane.p('^.name', {mask: 'Hello, {}', id: 'greeting'});
        pane.div('Hover to read the title', {customer: '^.name', title: '^.name:Customer: {customer}', id: 'card'});
        pane.p('The pointer template reads customer from Source; the customer attribute remains projected.');
        pane.h2('0.2.3: a separate HTML preview');
        pane.html_label('Preview HTML', {for: 'html'});
        pane.textarea({value: '^.html', live: true, id: 'html'});
        pane.iframe({srcdoc: '^.html', title: 'Sandboxed preview', id: 'preview'});
        pane.p('Data-bound srcdoc receives an empty sandbox; this preview only displays content.');
    }
}
