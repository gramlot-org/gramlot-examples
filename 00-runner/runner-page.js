/** Browser-safe runner UI authored with Gramlot Source. */
import {Page as GramlotPage} from '@gramlot/native-html/page';

export class RunnerPage extends GramlotPage {
    static title = 'Gramlot examples';
    static runnerScript = '/examples/00-runner/dist/runner.js';
    static css = ['/themes/gramlot-base/theme.css', '/examples/00-runner/runner.css'];

    main(root) {
        const shell = root.div({class: 'runner', id: 'runner'});
        const sidebar = shell.aside({class: 'runner-sidebar'});
        const brand = sidebar.header();
        brand.img({src: this.constructor.logoUrl, alt: 'Gramlot', class: 'runner-logo'});
        brand.h1('Examples');
        const navigation = sidebar.nav({'aria-label': 'Examples'}).ul({class: 'runner-list'});
        const category = navigation.li();
        category.a('HTML / SVG', {id: 'open-html_svg', href: '#panel-html_svg',
            aria_current: null, tabindex: -1});
        const examplesList = category.ul({class: 'runner-list'});
        for (const example of this.constructor.exampleContent) {
            examplesList.li().a(example.title, {id: `open-${example.key}`, href: example.frameUrl,
                aria_current: null, tabindex: -1});
        }
        const footer = sidebar.footer({class: 'runner-keyboard'});
        const label = footer.gramlot_label({for: 'keyboard-navigation'});
        label.input({type: 'checkbox', id: 'keyboard-navigation',
            checked: false});
        label.span('Keyboard navigation');
        const theme = sidebar.footer({class: 'runner-theme'});
        theme.gramlot_label('Theme', {for: 'runner-theme'});
        const choices = theme.select({id: 'runner-theme', value: 'light'});
        choices.option('Light', {value: 'light', selected: true});
        choices.option('Dark', {value: 'dark', selected: false});

        const content = shell.main({class: 'runner-main'});
        const tabs = content.div({class: 'runner-tabs', role: 'tablist', aria_label: 'Open examples'});
        tabs.button('Introduction', {type: 'button', role: 'tab', id: 'tab-intro',
            aria_controls: 'panel-intro',
            aria_selected: 'true', tabindex: -1, hidden: false});
        tabs.button('HTML / SVG', {type: 'button', role: 'tab', id: 'tab-html_svg',
            aria_controls: 'panel-html_svg',
            aria_selected: 'false', tabindex: -1, hidden: true});
        for (const example of this.constructor.exampleContent) {
            const key = example.key;
            tabs.button(example.title, {type: 'button', role: 'tab', id: `tab-${key}`,
                aria_controls: `panel-${key}`,
                aria_selected: 'false', tabindex: -1, hidden: true});
        }

        const panels = content.div({class: 'runner-panels'});
        const intro = panels.section({id: 'panel-intro', class: 'runner-intro', role: 'tabpanel',
            aria_labelledby: 'tab-intro', hidden: false});
        intro.h2('Example runner');
        intro.p('This runner shows each native HTML page beside the code that creates it. ' +
            'The Python and JavaScript integrations have the same examples.');
        intro.p('Choose an example from the list. Its tab stays open so you can return to it. ' +
            'Enable Keyboard navigation in the sidebar to move through tabs by keyboard. ' +
            'The vertical divider resizes the preview and code.');

        const categoryPanel = panels.section({id: 'panel-html_svg', class: 'runner-category',
            role: 'tabpanel',
            aria_labelledby: 'tab-html_svg', hidden: true});
        categoryPanel.div(this.constructor.categoryReadme, {id: 'readme-html_svg'});

        for (const example of this.constructor.exampleContent) this.panel(panels, example);
        shell.script({src: this.constructor.runnerScript});
    }

    panel(parent, example) {
        const key = example.key;
        const panel = parent.section({id: `panel-${key}`, class: 'runner-panel', role: 'tabpanel',
            aria_labelledby: `tab-${key}`, hidden: true});
        const explanation = panel.header({class: 'runner-explanation'});
        explanation.div(example.readme, {id: `readme-${key}`});

        const split = panel.div({class: 'runner-split', id: `split-${key}`,
            style: '--split-position: 65%'});
        const preview = split.div({class: 'runner-preview', id: `preview-${key}`});
        preview.iframe({title: `${example.title} preview`, name: `example-${key}`,
            id: `frame-${key}`});
        split.div({class: 'runner-divider', id: `divider-${key}`,
            role: 'separator', aria_orientation: 'vertical', tabindex: 0,
            aria_label: 'Resize preview and code', aria_valuemin: 20,
            aria_valuemax: 80, aria_valuenow: 65});
        const codepane = split.div({class: 'runner-codepane', id: `codepane-${key}`});
        codepane.h3('JavaScript · page.js');
        codepane.pre().code(example.source, {class: 'language-javascript',
            id: `code-${key}`});
    }
}
