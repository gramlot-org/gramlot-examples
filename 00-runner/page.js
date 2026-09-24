/** The JavaScript integration's runner, authored with Gramlot Source. */
import {Page as GramlotPage} from '@gramlot/native-html/page';
import examples from './catalog.json' with {type: 'json'};

export class Page extends GramlotPage {
    static title = 'Gramlot examples';
    static css = ['/themes/gramlot-base/theme.css', '/examples/00-runner/runner.css'];

    main(root) {
        const shell = root.div({class: 'runner', data_gramlot_tabs: 'catalog'});
        const sidebar = shell.aside({class: 'runner-sidebar'});
        sidebar.header().h1('Examples');
        const navigation = sidebar.nav({'aria-label': 'Examples'}).ul({class: 'runner-list'});
        for (const example of examples) {
            navigation.li().button(example.title, {type: 'button', data_gramlot_open: example.key,
                aria_current: example.key === 'catalog' ? 'page' : null});
        }
        const content = shell.main({class: 'runner-main'});
        const tabs = content.div({class: 'runner-tabs', role: 'tablist', aria_label: 'Open examples'});
        for (const example of examples) {
            const key = example.key;
            const active = key === 'catalog';
            tabs.button(example.title, {type: 'button', role: 'tab', id: `tab-${key}`,
                data_gramlot_tab: key, aria_controls: `panel-${key}`,
                aria_selected: active ? 'true' : 'false', tabindex: active ? 0 : -1, hidden: !active});
        }
        const panels = content.div({class: 'runner-panels'});
        for (const example of examples) this.panel(panels, example);
    }

    panel(parent, example) {
        const key = example.key;
        const panel = parent.section({id: `panel-${key}`, class: 'runner-panel', role: 'tabpanel',
            data_gramlot_panel: key, aria_labelledby: `tab-${key}`, hidden: key !== 'catalog'});
        const explanation = panel.header({class: 'runner-explanation'});
        explanation.h2(example.title);
        explanation.p(example.description, {class: 'runner-description'});
        explanation.p(example.explanation);
        const base = key === 'catalog' ? '/examples/00-runner/catalog' : `/examples/html_svg/${example.folder}`;
        const links = explanation.div({class: 'runner-resources'});
        links.a('JavaScript source', {href: `${base}/page.js`, target: '_blank'});
        links.a('README', {href: `${base}/README.md`, target: '_blank'});
        panel.iframe({title: example.title, name: `example-${key}`,
            data_gramlot_frame: key, data_gramlot_src: key, src: key === 'catalog' ? key : null});
    }
}
