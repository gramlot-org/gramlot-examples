/** Gallery content on Gramlot's reusable index page. */
import {Bag} from '@gramlot/gramlot';
import {IndexPage} from '@gramlot/gramlot/page';
import {guidedDemo} from './guided-demo.js';
import {featureIndex} from './features.js';
const NAVIGATION_ICON = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%223%22%20y%3D%224%22%20width%3D%2218%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3Cpath%20d%3D%22M9%204v16M5.5%208h1M5.5%2012h1M5.5%2016h1%22%2F%3E%3C%2Fsvg%3E";
const SETTINGS_ICON = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m10%203-.5%202-2%20.9-1.9-.6-2%203.4L5%2010v2l-1.4%201.3%202%203.4%201.9-.6%202%20.9.5%202h4l.5-2%202-.9%201.9.6%202-3.4L19%2012v-2l1.4-1.3-2-3.4-1.9.6-2-.9L14%203Z%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2211%22%20r%3D%223%22%2F%3E%3C%2Fsvg%3E";

const INSPECTOR_ICON = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke-width%3D%221%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210.5%22%20stroke%3D%22%23404448%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%229.5%22%20stroke%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%228.5%22%20stroke%3D%22%23404448%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%227.5%22%20stroke%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%226.5%22%20stroke%3D%22%23404448%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%225.5%22%20stroke%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%224.5%22%20stroke%3D%22%23404448%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223.5%22%20stroke%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%222.5%22%20stroke%3D%22%23404448%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%221.5%22%20stroke%3D%22%23ffffff%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%220.5%22%20stroke%3D%22%23404448%22%2F%3E%3C%2Fsvg%3E";


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
        navigation.setItem('features', null, {title:'Features', key:'features', category:false});
        return navigation;
    }
    main(root) {
        const frame = root.framePane({id:'gallery-frame', height:'100%', min_height:0});
        frame.left.setAttr({id:'gallery-rail-region', width:'42px', padding:'45px 3px 3px', class:'gallery-rail-region'});
        const rail = frame.left.menu({id:'gallery-rail', presentation:'bar', orientation:'vertical',
            labelPosition:'tooltip', iconSize:24, width:'100%', height:'100%', aria_label:'Gallery tools'});
        rail.menuline({caption:'Navigation', tooltip:'Navigation — browse examples and documentation', iconSrc:NAVIGATION_ICON,
            checked:'^galleryIndex.navigationOpen', action:'galleryToggleNavigation', overflowable:false,
            id:'gallery-navigation-button', width:'36px', height:'36px'});
        rail.spacer({flex:1});
        rail.menuline({caption:'Inspector', tooltip:'Inspector — explore the current page’s Source and Data', iconSrc:INSPECTOR_ICON,
            checked:false, disabled:true, overflowable:false,
            id:'gallery-inspector', width:'36px', height:'36px'});
        rail.menuline({caption:'Settings', tooltip:'Settings — change theme, colors and toolbar position', iconSrc:SETTINGS_ICON,
            checked:'^galleryIndex.settingsOpen', action:'galleryToggleSettings', overflowable:false,
            id:'gallery-settings-button', width:'36px', height:'36px'});
        super.main(frame.center);
    }
    left(pane) {
        pane.setAttr({id:'index-sidebar', class:'index-sidebar', nodeId:'galleryNavigation'});
        const header=pane.header({class:'gallery-navigation-header'});
        header.img({src:this.constructor.logoUrl, alt:this.constructor.title, class:'index-logo'});
        const search=header.menu({presentation:'bar',class:'gallery-navigation-search',aria_label:'Search navigation'});
        const field=search.menuline({group:true,overflowable:false,flex:1,min_width:0}).div({class:'gallery-search-field'});
        field.span({class:'gallery-search-icon',aria_hidden:'true'});
        field.input({type:'search',value:'^galleryIndex.search',default:'',live:true,placeholder:'Search examples',aria_label:'Search examples'});
        field.html_button({type:'button',class:'gallery-search-clear',aria_label:'Clear search',title:'Clear search',hidden:"^galleryIndex.search:={} === ''",connect_onclick:"this.SET('galleryIndex.search', '')"});
        super.left(pane);
        pane.setAttr({drawer_minimize:true, drawer_label:'', drawer_display:'none'});
        pane.value.getNode('tree').setAttr({id:'gallery-navigation-tree', class:'gallery-navigation-tree', autoCollapse:true, hideValues:true, searchText:'^galleryIndex.search'});

    }
    center(pane) {
        pane.setAttr({id:'gallery-center', overflow:'hidden'});
        super.center(pane);
        pane.value.getNode('tabs').setAttr({id:'index-pages', class:'index-main', hidden:true});
        pane.div({id:'gallery-introduction',height:'100%'}).iframe({src:this.constructor.introductionUrl,title:'Example gallery',width:'100%',height:'100%',border:0});
        featureIndex(pane, Object.fromEntries(this.constructor.groups.flatMap(group => group.children.map(item => [item.key, item]))));
    }
    top(pane) { pane.setAttr({height:'var(--gallery-toolbar-size,42px)'}); this.header(pane); }
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
        intro.p("Expand a section in the tree and choose an example. Its tab stays open so you can return to it. Use the arrow keys on a focused tab to switch pages. The navigation tree supports the arrow keys and Enter. Use the Navigation toolbar button to show or hide the tree. Each lesson has Example, Explanation and Code tabs. Drag the icon beside Code to open it in a floating window; close that window to return Code to its tab. Switching tabs preserves the running example. Choose Base, Compact, mimi or joanna independently of the color mode.");
    }
    groupPanel(pane, group) { pane.div(group.readme, {id: `readme-${group.key}`}); }
    footer(footer) {
        const settings = footer.div({class:'gallery-settings-content'});
        const fields = settings.formlet({columns:1, lbl_position:'L', lbl_text_align:'right',
            box_c_width:'100%', gap:'8px 12px', id:'gallery-settings-form'});
        fields.filteringSelect({validate_notnull:true, lbl:'Theme', id:'index-appearance', value:'^galleryIndex.appearance',
            values:'base:Base,compact:Compact,mimi:mimi,joanna:joanna,mela:Mela'});
        fields.filteringSelect({validate_notnull:true, lbl:'Colors', id:'index-palette', value:'^galleryIndex.palette',
            values:'default:Theme default,compact:Blue & slate,mimi:Sage & green,joanna:Warm gray & blue'});
        fields.filteringSelect({validate_notnull:true, lbl:'Color mode', id:'index-theme', value:'^galleryIndex.theme',
            values:'light:Light,dark:Dark'});
        fields.filteringSelect({validate_notnull:true, lbl:'Toolbar', id:'gallery-toolbar-position',
            value:'^galleryIndex.toolbarPosition', default:'auto', values:'auto:Automatic,left:Left,bottom:Bottom'});
        fields.filteringSelect({validate_notnull:true, lbl:'Label position', id:'gallery-label-position', value:'^galleryIndex.labelPosition',
            values:'example:As in the example,TL:Top left,TC:Top center,TR:Top right,L:Left,R:Right,BL:Bottom left,BC:Bottom center,BR:Bottom right'});
        fields.checkbox({lbl:'Navigation', label:'Keyboard shortcuts', id:'keyboard-navigation', value:'^galleryIndex.keyboard'});
        settings.p('Changes apply immediately. Colors do not change density; label position affects the example fields.');
        settings.p('Automatic uses the bottom in narrow, portrait windows and the left otherwise. Choose Left or Bottom to compare.');
        if (this.constructor.installable) {
            const app = settings.details({class:'index-install'});
            app.summary('Install app');
            app.html_button('Install', {type:'button', id:'index-install-button', hidden:true});
            app.p('', {id:'index-install-status', role:'status'});
            app.p('Chrome: use Install page as app in the browser menu. Safari on macOS Sonoma or later: File > Add to Dock.');
            app.p('Use HTTPS or localhost. For a static export, serve the directory; direct file opening is not installable. Keep the server running for hosted pages.');
        }
    }
    header(shell) {
        const header = shell.header({class: 'gallery-toolbar'});
        header.h1(this.constructor.title);
        header.span('', {id: 'gallery-load-status', role: 'status', aria_live: 'polite'});
    }
    behavior(shell) {
        shell.setAttr({height:'100%'});
        shell.dataController({script:"this.SET('galleryIndex.navigationOpen', open)", subscribe_galleryNavigation_closable_change:true});
        shell.setAttr({class:'frame-page index-shell gallery-containers'});
        shell.value.getNode('frame').setAttr({id:'gallery-regions', nodeId:'galleryRegions'});
        shell.section({id: 'gallery-inspector-panel', aria_label: 'Inspector'});
        const settings = shell.floatingPane({title:'Settings', id:'gallery-settings',
            open:'^galleryIndex.settingsOpen', width:'390px', height:'420px'});
        settings.frame.center.setAttr({padding:'12px', overflow:'auto'});
        this.footer(settings.frame.center);
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
        preview.contentPane({title:'Code', pageName:'code', detachable:true, class:'gallery-codepane', id:`codepane-${key}`})
            .tabContainer({id:`code-tabs-${key}`, class:'gallery-source-tabs', height:'100%', tabMode:'underline'})
            .contentPane({title:'Code'}).p('Loading code…', {role:'status'});
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
