/** Gallery content on Gramlot's reusable index page. */
import {IndexPage} from '@gramlot/gramlot/page';
export class GalleryPage extends IndexPage {
    static title = 'Gramlot examples';
    static installable = true;
    static appIcon = '/assets/branding/app-icon.png';
    static shellId = 'gallery';
    static galleryScript = '/gallery/dist/gallery.js';
    static css = [...IndexPage.css, '/gallery/gallery.css'];
    static get navigation() {
        return this.families.map(group => ({...group,
            children: group.examples.map(item => ({...item, url: item.frameUrl}))}));
    }
    introduction(intro) {
        intro.h2('Example gallery');
        intro.p('This gallery shows each example page beside the code that creates it. ' +
            'The Python and JavaScript integrations have the same examples.');
        intro.p('Choose an example from the list. Its tab stays open so you can return to it. ' +
            'Enable Keyboard navigation in the footer to move through tabs by keyboard. ' +
            'Drag the dividers to resize the sidebar or the preview and code. ' +
            'Choose Base or Compact independently of the color mode.');

    }
    groupPanel(pane, group) { pane.div(group.readme, {id: `readme-${group.key}`}); }
    footer(footer) {
        super.footer(footer);
        const inspector = footer.button({type: 'button', id: 'gallery-inspector', class: 'gallery-inspector',
            title: 'Inspect the gallery or the visible example', aria_label: 'Inspector', aria_pressed: 'false', disabled: true});
        const icon = inspector.svg({viewBox: '0 0 24 24', width: '18', height: '18', aria_hidden: 'true'});
        icon.rect({x: '3', y: '3', width: '18', height: '18', rx: '2', fill: 'none', stroke: 'currentColor', stroke_width: '1.5'});
        icon.path({d: 'M9 3v18M12 8h6M12 12h6M12 16h4', fill: 'none', stroke: 'currentColor', stroke_width: '1.5'});
        inspector.span('Inspector');

    }
    behavior(shell) { shell.script({src: this.constructor.galleryScript}); }

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
        const tabs = codepane.div({class: 'gallery-source-tabs', role: 'tablist', aria_label: 'Source files'});
        tabs.button('JavaScript', {title: `${example.folder}.js`, type: 'button', role: 'tab',
            id: `code-tab-${key}`, aria_controls: `code-panel-${key}`, aria_selected: 'true', tabindex: 0});
        if (example.logic != null) {
            tabs.button('logic.js', {hidden: true, title: `${example.folder}_aux.js`, type: 'button', role: 'tab',
                id: `logic-tab-${key}`, aria_controls: `logic-panel-${key}`, aria_selected: 'false', tabindex: -1});
        }
        codepane.pre({id: `code-panel-${key}`, role: 'tabpanel', aria_labelledby: `code-tab-${key}`, tabindex: 0})
            .code(example.source, {class: 'language-javascript', id: `code-${key}`});
        if (example.logic != null) {
            codepane.pre({id: `logic-panel-${key}`, role: 'tabpanel', aria_labelledby: `logic-tab-${key}`,
                tabindex: 0, hidden: true}).code(example.logic, {class: 'language-javascript', id: `logic-${key}`});
        }
    }
}
