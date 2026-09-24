/** Local Gramlot example index, authored as a normal JavaScript Page. */
import {Page as GramlotPage} from '@gramlot/native-html/page';

const examples = [
    ['catalog', 'HTML grammar catalogue', 'Every HTML family in its valid context'],
    ['e01', 'Hello World', 'First Source page'],
    ['e02', 'Text and links', 'Text content and navigation'],
    ['e03', 'Lists', 'Ordered, unordered and description lists'],
    ['e04', 'Semantic page', 'Landmarks and sections'],
    ['e05', 'Tables', 'Rows, cells and captions'],
    ['e06', 'Forms', 'Native form elements'],
    ['e07', 'Native disclosure', 'Details and summary'],
    ['e08', 'SVG shapes', 'Basic vector elements'],
    ['e09', 'SVG composition', 'Composed vector content'],
    ['e10', 'Cards with icons', 'HTML and SVG together'],
    ['e11', 'Static report', 'Structured information'],
    ['e12', 'Complete page', 'A composed example'],
];

export class Page extends GramlotPage {
    static title = 'Gramlot examples · runner';
    static css = ['/themes/gramlot-base/theme.css', '/examples/00-runner/runner.css'];

    main(root) {
        const shell = root.div({class: 'runner'});
        shell.input({type: 'radio', name: 'runner-language', id: 'show-python', checked: true, class: 'runner-choice'});
        shell.input({type: 'radio', name: 'runner-language', id: 'show-javascript', class: 'runner-choice'});
        const sidebar = shell.aside({class: 'runner-sidebar'});
        const brand = sidebar.header({class: 'runner-brand'});
        brand.span('GRAMLOT', {class: 'eyebrow'});
        brand.h1('Examples');
        brand.p('Choose a page and compare its Python and JavaScript implementations.', {class: 'muted'});
        const nav = sidebar.nav({'aria-label': 'Examples'});
        for (const [route, title, caption] of examples) {
            const item = nav.div({class: 'runner-item'});
            item.strong(title);
            item.small(caption);
            const links = item.div({class: 'runner-links'});
            links.a('Open Python ↗', {href: `/py/${route}`, target: 'python-example', class: 'runner-py-link'});
            links.a('Open JavaScript ↗', {href: `/js/${route}`, target: 'javascript-example', class: 'runner-js-link'});
            const folders = ['01_hello_world', '02_text_and_links', '03_lists', '04_semantic_page',
                '05_tables', '06_forms', '07_native_disclosure', '08_svg_shapes', '09_svg_composition',
                '10_cards_with_icons', '11_static_report', '12_complete_page'];
            const folder = route === 'catalog' ? 'catalog' : folders[Number(route.slice(1)) - 1];
            const sourceBase = route === 'catalog' ? `/examples/00-runner/${folder}` : `/examples/html_svg/${folder}`;
            links.a('Source .py', {href: `${sourceBase}/page.py`, target: '_blank'});
            links.a('Source .js', {href: `${sourceBase}/page.js`, target: '_blank'});
            links.a('README', {href: `${sourceBase}/README.md`, target: '_blank'});
        }
        sidebar.p('Source links open the original files; the inspector is pending a reusable Gramlot component.', {class: 'muted runner-note'});

        const content = shell.main({class: 'runner-main'});
        const intro = content.header({class: 'runner-intro'});
        intro.span('LOCAL EXAMPLE RUNNER', {class: 'eyebrow'});
        intro.h2('Native HTML, two authoring languages');
        intro.p('Each frame runs an actual Gramlot Page. Select a language link in the sidebar to load an example without leaving the runner.', {class: 'muted'});
        const tabs = content.div({class: 'runner-tabs', role: 'group', 'aria-label': 'Authoring language'});
        tabs.gramlot_label('Python', {for: 'show-python'});
        tabs.gramlot_label('JavaScript', {for: 'show-javascript'});
        const frames = content.div({class: 'runner-frames'});
        for (const [language, route] of [['Python', 'py'], ['JavaScript', 'js']]) {
            const panel = frames.section({class: `runner-panel runner-panel-${route}`});
            const bar = panel.header({class: 'runner-panel-header'});
            bar.h3(language);
            bar.a('Open catalogue ↗', {href: `/${route}/catalog`, target: '_blank'});
            panel.iframe({title: `${language} Gramlot example`, name: `${language.toLowerCase()}-example`, src: `/${route}/catalog`});
        }
        const foot = content.footer({class: 'runner-footer'});
        foot.a('Runner source (Python)', {href: '/examples/00-runner/page.py', target: '_blank'});
        foot.a('Runner source (JavaScript)', {href: '/examples/00-runner/page.js', target: '_blank'});
        foot.a('Catalogue notes', {href: '/examples/00-runner/catalog/README.md', target: '_blank'});
    }
}
