/** Gallery content on Gramlot's reusable index page. */
import {Bag} from '@gramlot/gramlot';
import {IndexPage} from '@gramlot/gramlot/page';
import {guidedDemo} from './guided-demo.js';
export class GalleryPage extends IndexPage {
    static title = 'Gramlot examples';
    static serverlessDownloadUrl = null;
    static installable = true;
    static appIcon = '/assets/branding/app-icon.png';
    static shellId = 'gallery';
    static datapath = 'galleryIndex';
    static introductionUrl = 'pages/00-index';
    static css = [...IndexPage.css, '/themes/gramlot-index/theme.css', '/gallery/gallery.css'];
    static get groups() {
        return this.families.map(group => ({key: group.key, title: group.title,
            children: group.examples.map(item => ({key: item.key, title: item.title, url: item.frameUrl}))}));
    }
    static get navigation() {
        const navigation = new Bag();
        for (const family of this.groups) navigation.setItem(family.key, null, {title:family.title, key:family.key, category:true, directory:family.key});
        return navigation;
    }
    left(pane) {
        pane.setAttr({id:'index-sidebar', class:'index-sidebar', nodeId:'galleryNavigation'});
        pane.header().img({src:this.constructor.logoUrl, alt:this.constructor.title, class:'index-logo'});
        super.left(pane);
        pane.setAttr({drawer_minimize:true});
        pane.value.getNode('tree').setAttr({id:'gallery-navigation-tree', class:'gallery-navigation-tree', autoCollapse:true, hideValues:true});

    }
    center(pane) {
        pane.setAttr({id:'gallery-center', overflow:'hidden'});
        super.center(pane);
        pane.value.getNode('tabs').setAttr({id:'index-pages', class:'index-main', hidden:true});
        pane.div({id:'gallery-introduction',height:'100%'}).iframe({src:this.constructor.introductionUrl,title:'Example gallery',width:'100%',height:'100%',border:0});
    }
    right(pane) {
        pane.setAttr({id:'index-code', nodeId:'galleryCode', width:'420px', minSize:220, maxSize:900, splitter:true,
            drawer:'close', drawer_label:'Code', drawer_minimize:true, aria_label:'Example source code', hidden:true});
        pane.div({id:'gallery-code-pages', height:'100%'});
    }
    bottom(pane) {
        pane.setAttr({id:'gallery-settings', height:'180px', drawer:'close', drawer_label:'Settings', drawer_icon:'⚙',
            drawer_minimize:true, class:'index-footer', aria_label:'Settings'});
        this.footer(pane);
    }
    top(pane) { pane.setAttr({height:'42px'}); this.header(pane); }
    navigation_section({directory}) {
        const family = directory;
        const group = this.constructor.groups.find(item => item.key === family);
        if (!group) throw new Error(`Unknown gallery section: ${family}`);
        const children = new Bag();
        for (const item of group.children) children.setItem(item.key, null,
            {title: item.title, key: item.key, url: item.url, category: false});
        return children;
    }
    introduction(intro) {
        intro.h2("Example gallery");
        intro.p("This gallery shows each example page beside the code that creates it. The Python and JavaScript integrations have the same examples.");
        intro.p("Expand a section in the tree and choose an example. Its tab stays open so you can return to it. Use the arrow keys on a focused tab to switch pages. The navigation tree supports the arrow keys and Enter. Use the Navigation and Code drawer labels to show or hide their panels; drag their splitters to resize them. The drawer handles keep both panels within reach. Each lesson has Example and Explanation tabs; switching them preserves the running example. Choose Base, Compact, mimi or joanna independently of the color mode.");
    }
    groupPanel(pane, group) { pane.div(group.readme, {id: `readme-${group.key}`}); }
    footer(footer) {
        const settings = footer.div({class: 'gallery-settings-content'});
        settings.div({class: 'gallery-settings-heading'}).h2('Settings', {id: 'gallery-settings-title'});
        const theme = settings.div({class: 'index-theme'});
        theme.html_label('Theme', {for: 'index-appearance'});
        const appearance = theme.select({id: 'index-appearance', value: 'compact'});
        appearance.option('Base', {value: 'base', selected: false});
        appearance.option('Compact', {value: 'compact', selected: true});
        appearance.option('mimi', {value: 'mimi'});
        appearance.option('joanna', {value: 'joanna'});
        const color = settings.div({class: 'index-theme'});
        color.html_label('Color mode', {for: 'index-theme'});
        const choices = color.select({id: 'index-theme', value: 'light'});
        choices.option('Light', {value: 'light', selected: true});
        choices.option('Dark', {value: 'dark', selected: false});
        const keyboard = settings.div({class: 'index-keyboard'});
        const label = keyboard.html_label({for: 'keyboard-navigation'});
        label.input({type: 'checkbox', id: 'keyboard-navigation', checked: false});
        label.span('Keyboard navigation');

        if (this.constructor.installable) {
            const app = settings.details({class: 'index-install'});
            app.summary('Install app');
            app.html_button('Install', {type: 'button', id: 'index-install-button', hidden: true});
            app.p('', {id: 'index-install-status', role: 'status'});
            app.p('Chrome: use Install page as app in the browser menu. Safari on macOS Sonoma or later: File > Add to Dock.');
            app.p('Use HTTPS or localhost. For a static export, serve the directory; direct file opening is not installable. Keep the server running for hosted pages.');
        }
        const labels = settings.div({class: 'index-theme'});
        labels.html_label('Label position', {for: 'gallery-label-position'});
        const position = labels.select({id: 'gallery-label-position', value: 'example'});
        position.option('As in the example', {value: 'example', selected: true});
        for (const code of ['TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR']) position.option(code, {value: code});
        settings.p("Label position applies to input components in the previews. Choose As in the example to restore the lesson's layout.");

    }
    header(shell) {
        const header = shell.header({class: 'gallery-toolbar'});
        header.h1(this.constructor.title);
        header.span('', {id: 'gallery-load-status', role: 'status', aria_live: 'polite'});
        const inspector = header.html_button({type: 'button', id: 'gallery-inspector', class: 'gallery-inspector',
            title: 'Open inspector', aria_label: 'Inspector', aria_pressed: 'false', disabled: true});
        inspector.span('🔍', {aria_hidden: 'true'});
        inspector.span('Inspector');

    }
    behavior(shell) {
        shell.setAttr({class:'frame-page index-shell gallery-containers'});
        shell.value.getNode('frame').setAttr({id:'gallery-regions', nodeId:'galleryRegions'});
        shell.section({id: 'gallery-inspector-panel', aria_label: 'Inspector'});
        shell.dataController({func:'galleryInitialize', _onBuilt:true});
        shell.dataController({func:'galleryMount', _onStart:true});
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
            else this.examplePanel(root, item);
        } else throw new Error(`Unknown gallery view: ${key}/${view}`);
    }
    panel(pane, node) {
        const key = node.attr.key;
        if (Object.hasOwn(node.attr,'markdown')) pane.div(node.attr.markdown,{class:'gallery-directory-markdown',padding:'24px'});
        else if (node.attr.category || key == null) pane.iframe({src:node.attr.url, title:node.attr.title ?? node.label,
            width:'100%', height:'100%', border:0});
        else this.examplePanel(pane, this.galleryItem(key));
    }
    examplePanel(parent, example) {
        const key = example.key;
        const panel = parent.div({class: 'gallery-panel-layout'});
        const header = panel.header({class: 'gallery-explanation'});
        header.h2(example.title);
        header.p('In this example: ' + example.description);
        const preview = panel.tabContainer({class: 'gallery-preview', id: `preview-${key}`,
            tabMode: 'underline', height: '100%', min_height: 0,
            ...(key === 'l04' ? {nodeId: 'galleryGuidePreview'} : {})});
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

GalleryPage.registerEndpoint('navigation_section');
