/** Gallery content on Gramlot's reusable index page. */
import {IndexPage} from '@gramlot/gramlot/page';
export class GalleryPage extends IndexPage {
    static title = 'Gramlot examples';
    static serverlessDownloadUrl = null;
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
            'Open Settings (⚙) in the footer and enable Keyboard navigation to move through tabs by keyboard. ' +
            'Use the top bar to show or hide Navigation and Code; drag their dividers to resize them. ' +
            'Choose Base, Compact, mimi or joanna independently of the color mode.');

    }
    groupPanel(pane, group) { pane.div(group.readme, {id: `readme-${group.key}`}); }
    footer(footer) {
        if (this.constructor.serverlessDownloadUrl) {
            footer.a('↓ Serverless ZIP', {href: this.constructor.serverlessDownloadUrl,
                download: 'gramlot-gallery-serverless.zip', class: 'gallery-download',
                title: 'Download the offline gallery; unzip and open index.html'});
        }
        footer.html_button('⚙', {type: 'button', id: 'gallery-settings-toggle', class: 'gallery-settings-toggle',
            title: 'Settings', aria_label: 'Settings', popovertarget: 'gallery-settings'});
        const settings = footer.div({id: 'gallery-settings', popover: 'auto', aria_labelledby: 'gallery-settings-title'});
        const heading = settings.div({class: 'gallery-settings-heading'});
        heading.h2('Settings', {id: 'gallery-settings-title'});
        heading.html_button('×', {type: 'button', aria_label: 'Close settings', popovertarget: 'gallery-settings', popovertargetaction: 'hide'});
        super.footer(settings);
        const labels = settings.div({class: 'index-theme'});
        labels.html_label('Label position', {for: 'gallery-label-position'});
        const position = labels.select({id: 'gallery-label-position', value: 'example'});
        position.option('As in the example', {value: 'example', selected: true});
        for (const code of ['TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR']) position.option(code, {value: code});
        settings.p("Label position applies to input components in the previews. Choose As in the example to restore the lesson's layout.");
        const inspector = footer.html_button({type: 'button', id: 'gallery-inspector', class: 'gallery-inspector',
            title: 'Open inspector', aria_label: 'Inspector', aria_pressed: 'false', disabled: true});
        inspector.span('🔍', {aria_hidden: 'true'});

    }
    header(shell) {
        const header = shell.header({class: 'gallery-toolbar'});
        header.html_button('☰ Navigation', {type: 'button', id: 'index-navigation-toggle',
            aria_controls: 'index-sidebar', aria_expanded: 'true'});
        header.html_button('☰', {type: 'button', id: 'gallery-mobile-menu', class: 'gallery-mobile-only',
            aria_label: 'Navigation', aria_controls: 'index-sidebar', aria_expanded: 'false'});
        header.h1(this.constructor.title);
        header.html_button('Code ⟨/⟩', {type: 'button', id: 'index-code-toggle',
            aria_controls: 'index-code', aria_expanded: 'false', disabled: true});
        const views = header.div({class: 'gallery-mobile-views gallery-mobile-only', role: 'group', aria_label: 'Gallery view'});
        for (const [view, caption] of [['example', 'Example'], ['code', 'Code'], ['inspector', 'Inspector']]) {
            views.html_button(caption, {type: 'button', id: `gallery-view-${view}`, aria_pressed: String(view === 'example')});
        }
    }
    behavior(shell) {
        shell.html_button('', {type: 'button', id: 'gallery-mobile-backdrop', hidden: true,
            aria_label: 'Close navigation', tabindex: -1});
        shell.section({id: 'gallery-inspector-panel', aria_label: 'Inspector'});
        shell.div({class: 'index-divider', id: 'index-code-divider', hidden: true,
            title: 'Drag to resize code', role: 'separator', aria_orientation: 'vertical',
            tabindex: 0, aria_label: 'Resize code', aria_controls: 'index-code',
            aria_valuemin: 200, aria_valuemax: 800, aria_valuenow: 420});
        const code = shell.aside({id: 'index-code', aria_label: 'Example source code', hidden: true});
        for (const family of this.constructor.navigation) {
            for (const example of family.children) this.codePanel(code, example);
        }
        shell.script({src: this.constructor.galleryScript});
    }

    panel(parent, example) {
        const key = example.key;
        const panel = parent.section({id: `panel-${key}`, class: 'gallery-panel', role: 'tabpanel',
            aria_labelledby: `tab-${key}`, hidden: true});
        const explanation = panel.header({class: 'gallery-explanation'});
        explanation.div(example.readme, {id: `readme-${key}`});

        const preview = panel.div({class: 'gallery-preview', id: `preview-${key}`});
        const modes = preview.div({class: 'gallery-preview-modes', role: 'group', aria_label: 'Preview mode'});
        for (const [mode, caption] of [['normal', 'Normal'], ['mobile', 'Mobile']]) {
            modes.html_button(caption, {type: 'button', id: `preview-${mode}-${key}`, aria_pressed: mode === 'normal' ? 'true' : 'false'});
        }
        const stage = preview.div({class: 'gallery-preview-stage', id: `preview-stage-${key}`});
        stage.iframe({title: `${example.title} preview`, name: `example-${key}`,
            id: `frame-${key}`});
    }
    codePanel(parent, example) {
        const key = example.key;
        const codepane = parent.div({class: 'gallery-codepane', id: `codepane-${key}`, hidden: true});
        const tabs = codepane.div({class: 'gallery-source-tabs', role: 'tablist', aria_label: 'Source files'});
        tabs.html_button('JavaScript', {title: `${example.folder}.js`, type: 'button', role: 'tab',
            id: `code-tab-${key}`, aria_controls: `code-panel-${key}`, aria_selected: 'true', tabindex: 0});
        if (example.logic != null) {
            tabs.html_button('logic.js', {hidden: true, title: `${example.folder}_aux.js`, type: 'button', role: 'tab',
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
