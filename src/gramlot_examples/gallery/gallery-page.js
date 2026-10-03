/** Browser-safe gallery UI authored with Gramlot Source. */
import {Page as GramlotPage} from '@gramlot/gramlot/page';

export class GalleryPage extends GramlotPage {
    static title = 'Gramlot examples';
    static galleryScript = '/gallery/dist/gallery.js';
    static css = ['/themes/gramlot-base/theme.css', '/gallery/gallery.css'];

    main(root) {
        const families = this.constructor.families;
        const shell = root.div({class: 'gallery', id: 'gallery'});
        const sidebar = shell.aside({class: 'gallery-sidebar'});
        const brand = sidebar.header();
        brand.img({src: this.constructor.logoUrl, alt: 'Gramlot', class: 'gallery-logo'});
        brand.h1('Examples');
        const navigation = sidebar.nav({'aria-label': 'Examples'}).ul({class: 'gallery-list'});
        for (const family of families) {
            const category = navigation.li().details({open: family === families[0]});
            category.summary({tabindex: -1}).a(family.title, {id: `open-${family.key}`, href: `#panel-${family.key}`,
                class: 'gallery-family', aria_current: null, tabindex: -1});
            const examplesList = category.ul({class: 'gallery-list'});
            for (const example of family.examples) {
                examplesList.li().a(example.title, {id: `open-${example.key}`, href: example.frameUrl,
                    aria_current: null, tabindex: -1});
            }
        }
        const footer = sidebar.footer({class: 'gallery-keyboard'});
        const label = footer.html_label({for: 'keyboard-navigation'});
        label.input({type: 'checkbox', id: 'keyboard-navigation',
            checked: false});
        label.span('Keyboard navigation');
        const theme = sidebar.footer({class: 'gallery-theme'});
        theme.html_label('Theme', {for: 'gallery-theme'});
        const choices = theme.select({id: 'gallery-theme', value: 'light'});
        choices.option('Light', {value: 'light', selected: true});
        choices.option('Dark', {value: 'dark', selected: false});

        const content = shell.main({class: 'gallery-main'});
        const tabs = content.div({class: 'gallery-tabs', role: 'tablist', aria_label: 'Open examples'});
        tabs.button('Introduction', {type: 'button', role: 'tab', id: 'tab-intro',
            aria_controls: 'panel-intro',
            aria_selected: 'true', tabindex: -1, hidden: false});
        for (const family of families) {
            for (const {key, title} of [family, ...family.examples]) {
                tabs.button(title, {type: 'button', role: 'tab', id: `tab-${key}`,
                    aria_controls: `panel-${key}`,
                    aria_selected: 'false', tabindex: -1, hidden: true});
            }
        }

        const panels = content.div({class: 'gallery-panels'});
        const intro = panels.section({id: 'panel-intro', class: 'gallery-intro', role: 'tabpanel',
            aria_labelledby: 'tab-intro', hidden: false});
        intro.h2('Example gallery');
        intro.p('This gallery shows each example page beside the code that creates it. ' +
            'The Python and JavaScript integrations have the same examples.');
        intro.p('Choose an example from the list. Its tab stays open so you can return to it. ' +
            'Enable Keyboard navigation in the sidebar to move through tabs by keyboard. ' +
            'The vertical divider resizes the preview and code.');

        for (const family of families) {
            const categoryPanel = panels.section({id: `panel-${family.key}`, class: 'gallery-category',
                role: 'tabpanel',
                aria_labelledby: `tab-${family.key}`, hidden: true});
            categoryPanel.div(family.readme, {id: `readme-${family.key}`});
            for (const example of family.examples) this.panel(panels, example);
        }
        shell.script({src: this.constructor.galleryScript});
    }

    panel(parent, example) {
        const key = example.key;
        const panel = parent.section({id: `panel-${key}`, class: 'gallery-panel', role: 'tabpanel',
            aria_labelledby: `tab-${key}`, hidden: true});
        const explanation = panel.header({class: 'gallery-explanation'});
        explanation.div(example.readme, {id: `readme-${key}`});

        const split = panel.div({class: 'gallery-split', id: `split-${key}`,
            style: '--split-position: 65%'});
        const preview = split.div({class: 'gallery-preview', id: `preview-${key}`});
        preview.iframe({title: `${example.title} preview`, name: `example-${key}`,
            id: `frame-${key}`});
        split.div({class: 'gallery-divider', id: `divider-${key}`,
            role: 'separator', aria_orientation: 'vertical', tabindex: 0,
            aria_label: 'Resize preview and code', aria_valuemin: 20,
            aria_valuemax: 80, aria_valuenow: 65});
        const codepane = split.div({class: 'gallery-codepane', id: `codepane-${key}`});
        codepane.h3(`JavaScript · ${example.folder}.js`);
        codepane.pre().code(example.source, {class: 'language-javascript',
            id: `code-${key}`});
        if (example.logic != null) {
            codepane.h3(`Logic · ${example.folder}_aux.js`);
            codepane.pre().code(example.logic, {class: 'language-javascript',
                id: `logic-${key}`});
        }
    }
}
