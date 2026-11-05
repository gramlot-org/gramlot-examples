import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'projection'});
        pane.h2('One value, several presentations');
        pane.html_label('Name', {for: 'name'});
        pane.input({value: '^.name', live: true, id: 'name'});
        pane.p('^.name', {mask: 'Hello, {}', id: 'greeting'});
        pane.div('Hover to read the title', {customer: '^.name', title: '^.name:Customer: {customer}', id: 'card'});
        pane.h2('A separate HTML preview');
        pane.html_label('Preview HTML', {for: 'html'});
        pane.textarea({value: '^.html', live: true, id: 'html'});
        pane.iframe({srcdoc: '^.html', title: 'Sandboxed preview', id: 'preview'});
    }
}
