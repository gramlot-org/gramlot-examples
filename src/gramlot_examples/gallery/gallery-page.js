/** Gallery content on Gramlot's reusable index page. */
import {IndexPage} from '@gramlot/gramlot/page';
import {guidedDemo} from './guided-demo.js';
export class GalleryPage extends IndexPage {
    static title = 'Gramlot examples';
    static serverlessDownloadUrl = null;
    static installable = true;
    static appIcon = '/assets/branding/app-icon.png';
    static shellId = 'gallery';
    static galleryScript = '/gallery/dist/gallery.js';
    static css = [...IndexPage.css, '/gallery/gallery.css'];
    static get navigation() {
        return this.families.map(group => ({key: group.key, title: group.title,
            children: group.examples.map(item => ({key: item.key, title: item.title, url: item.frameUrl}))}));
    }
    main(root) {
        const families = this.constructor.navigation;
        const shell = root.div({class: 'index-shell gallery-containers', id: this.constructor.shellId});
        this.header(shell);
        const regions = shell.borderContainer({id: 'gallery-regions', node_id: 'galleryRegions',
            data_index_regions: true, height: '100%', min_height: 0});
        const sidebar = regions.contentPane({region: 'left', width: '240px', minSize: 160, maxSize: 420,
            splitter: true, drawer: true, drawer_icon: '☰', drawer_label: 'Navigation', drawer_minimize: true,
            node_id: 'galleryNavigation', class: 'index-sidebar', id: 'index-sidebar'});
        sidebar.header().img({src: this.constructor.logoUrl, alt: this.constructor.title, class: 'index-logo'});
        const navigation = sidebar.nav({aria_label: 'Pages'}).ul({class: 'index-list'});
        for (const family of families) {
            const category = navigation.li().details({open: family === families[0]});
            category.summary({tabindex: -1}).a(family.title, {id: `open-${family.key}`,
                href: `#panel-${family.key}`, class: 'index-family', tabindex: -1});
            const items = category.ul({class: 'index-list'});
            for (const example of family.children) {
                items.li().a(example.title, {id: `open-${example.key}`, href: example.url, tabindex: -1});
            }
        }
        const center = regions.contentPane({region: 'center', id: 'gallery-center', overflow: 'hidden'});
        shell.dataSetter({destination_path: 'galleryIndex.active', value: 'intro'});
        const panels = center.tabContainer({id: 'index-pages', class: 'index-main', height: '100%',
            selectedPage: '^galleryIndex.active', tabMode: 'tabs'});
        this.introduction(panels.contentPane({id: 'panel-intro', title: 'Introduction', pageName: 'intro', class: 'index-intro'}));
        const code = regions.contentPane({region: 'right', width: '420px', minSize: 220, maxSize: 900,
            splitter: true, drawer: true, drawer_icon: '⌘', drawer_label: 'Code', drawer_minimize: true,
            node_id: 'galleryCode', id: 'index-code', aria_label: 'Example source code', hidden: true});
        code.div({id: 'gallery-code-pages', height: '100%'});
        this.footer(shell.footer({class: 'index-footer'}));
        this.behavior(shell);
    }
    introduction(intro) {
        intro.h2("Example gallery");
        intro.p("This gallery shows each example page beside the code that creates it. The Python and JavaScript integrations have the same examples.");
        intro.p("Choose an example from the list. Its tab stays open so you can return to it. Use the arrow keys on a focused tab to switch pages. In Settings (⚙), enable Keyboard navigation to include the navigation links in the Tab sequence. Use the top bar to show or hide Navigation and Code; drag their splitters to resize them. The drawer handles keep both panels within reach. Each lesson has Example and Explanation tabs; switching them preserves the running example. Choose Base, Compact, mimi or joanna independently of the color mode.");
    }
    groupPanel(pane, group) { pane.div(group.readme, {id: `readme-${group.key}`}); }
    footer(footer) {
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
        header.span('', {id: 'gallery-load-status', role: 'status', aria_live: 'polite'});
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
        shell.script({src: this.constructor.galleryScript});
    }

    galleryItem(key) {
        for (const family of this.constructor.families) {
            if (family.key === key) return family;
            for (const example of family.examples) if (example.key === key) return example;
        }
        throw new Error(`Unknown gallery entry: ${key}`);
    }
    lesson(root, {key, view = 'example'}) {
        const item = this.galleryItem(key);
        if (view === 'code' && !item.examples) this.codePanel(root, item);
        else if (view === 'description' && !item.examples) root.div(item.readme, {id: `readme-${key}`});
        else if (view === 'example') {
            if (item.examples) this.groupPanel(root, item);
            else this.panel(root, item);
        } else throw new Error(`Unknown gallery view: ${key}/${view}`);
    }
    panel(parent, example) {
        const key = example.key;
        const panel = parent.div({class: 'gallery-panel-layout'});
        const header = panel.header({class: 'gallery-explanation'});
        header.h2(example.title);
        header.p('In this example: ' + example.description);
        const preview = panel.tabContainer({class: 'gallery-preview', id: `preview-${key}`,
            tabMode: 'underline', height: '100%', min_height: 0,
            ...(key === 'l04' ? {node_id: 'galleryGuidePreview'} : {})});
        let stage = preview.contentPane({title: 'Example', pageName: 'example',
            class: 'gallery-preview-stage', id: `preview-stage-${key}`});
        if (key === 'l04') {
            const layout = stage.borderContainer({height: '100%', id: 'gallery-guide-layout'});
            stage = layout.contentPane({region: 'center', overflow: 'hidden'});
            guidedDemo(layout);
        }
        stage.iframe({title: `${example.title} preview`, name: `example-${key}`, id: `frame-${key}`});
        preview.contentPane({title: 'Explanation', pageName: 'explanation', class: 'gallery-lesson', overflow: 'auto', id: `description-${key}`})
            .p('Loading explanation…', {role: 'status'});
    }
    codePanel(parent, example) {
        const key = example.key;
        const codepane = parent;
        codepane.contentPane({title: 'JavaScript', pageName: 'javascript', id: `code-panel-${key}`})
            .pre({tabindex: 0}).code(example.source, {class: 'language-javascript', id: `code-${key}`});
        if (example.logic != null) {
            codepane.contentPane({title: 'logic.js', pageName: 'logic', id: `logic-panel-${key}`})
                .pre({tabindex: 0}).code(example.logic, {class: 'language-javascript', id: `logic-${key}`});
        }
    }
}

GalleryPage.registerSource('lesson');
