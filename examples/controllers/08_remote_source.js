import {Page as BasePage, source} from '@gramlot/gramlot/page';

const TOPICS = {
    binding: ['Binding', 'Pointers connect the DOM to the Data in both directions.'],
    controllers: ['Controllers', 'Formulas and controllers run code when the Data changes.'],
    svg: ['SVG', 'SVG attributes follow the Data like HTML attributes.'],
};

export class Page extends BasePage {
    static title = 'Remote Source';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'remote'});
        pane.h1('Remote Source');
        pane.html_label('Topic', {for: 'topic'});
        const topic = pane.select({value: '^.topic', id: 'topic'});
        for (const [key, [title]] of Object.entries(TOPICS)) topic.option(title, {value: key});
        pane.button('Load from the server', {id: 'load'}).dataController({func: 'load', topic: '=.topic'});
        const target = pane.section({node_id: 'details', class: 'card stack', id: 'details'});
        target.p('Nothing loaded yet.', {class: 'muted'});
        pane.dataSetter({destination_path: '.topic', value: 'binding'});
    }

    details(root, {topic = 'binding'} = {}) {
        const [title, summary] = TOPICS[topic];
        const branch = root.div({datapath: `topics.${topic}`, class: 'stack'});
        branch.h2('^.title', {id: 'remote-title'});
        branch.p('^.summary', {id: 'remote-summary'});
        branch.dataSetter({destination_path: '.title', value: title});
        branch.dataSetter({destination_path: '.summary', value: summary});
    }
}
source(Page.prototype.details);
