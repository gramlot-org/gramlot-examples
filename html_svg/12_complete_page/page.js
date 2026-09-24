import {Page as BasePage} from '@gramlot/native-html/page';

const SESSIONS = [
    ['09:00', 'A first Source tree', 'Mira', 'Describe a page with semantic HTML.'],
    ['10:30', 'Drawing with SVG', 'Theo', 'Build a small scene from native shapes.'],
    ['13:00', 'Putting it together', 'Mira & Theo', 'Compose cards, a schedule and a summary.'],
];
const SPEAKERS = [['Mira', 'Page authoring'], ['Theo', 'SVG composition']];
const QUESTIONS = [['Do I need a service?', 'This local example has no remote data.'],
    ['Is the map interactive?', 'No. It is a schematic SVG illustration.']];

export class Page extends BasePage {
    static title = 'A complete example page';
    static css = ['/themes/gramlot-base/theme.css', '/examples/html_svg/12_complete_page/style.css'];

    main(root) {
        const shell = root.div({class: 'example-page complete-page'});
        this.header(shell);
        const main = shell.main({class: 'stack'});
        this.hero(main);
        this.highlights(main);
        this.schedule(main);
        this.speakers(main);
        this.map(main);
        this.faq(main);
        shell.footer().small('Gramlot native HTML/SVG examples · Static content');
    }

    header(shell) {
        const header = shell.header({class: 'complete-header'});
        header.p('GRAMLOT FIELD NOTES', {class: 'eyebrow'});
        header.h1('A day of small interfaces');
        header.p('A composed page built from native HTML and SVG Source.');
        const nav = header.nav({aria_label: 'Page sections'});
        for (const [label, target] of [['Highlights', 'highlights'], ['Schedule', 'schedule'],
            ['Speakers', 'speakers'], ['Map', 'map'], ['FAQ', 'faq']]) nav.a(label, {href: `#${target}`});
    }

    hero(main) {
        const hero = main.section({class: 'card complete-hero', aria_label: 'Illustration'});
        const drawing = hero.svg({viewBox: '0 0 720 180', role: 'img', aria_labelledby: 'complete-art-title', class: 'example-art'});
        drawing.title('Three connected steps', {id: 'complete-art-title'});
        drawing.line({x1: 125, y1: 90, x2: 595, y2: 90, stroke: 'var(--gramlot-border)', stroke_width: 8});
        for (const [x, label, color] of [[125, 'WRITE', 'var(--gramlot-action)'],
            [360, 'COMPOSE', 'var(--gramlot-warning)'], [595, 'REVIEW', 'var(--gramlot-success)']]) {
            const group = drawing.g({transform: `translate(${x} 90)`});
            group.circle({cx: 0, cy: 0, r: 47, fill: color});
            group.text(label, {x: 0, y: 6, text_anchor: 'middle', font_size: 15,
                font_weight: 'bold', fill: 'var(--gramlot-background)'});
        }
        hero.p('Three lessons. One Source tree. A page you can read without scripts beyond the Gramlot runtime.');
    }

    highlights(main) {
        const section = main.section({id: 'highlights', class: 'stack'});
        section.h2('Highlights');
        const cards = section.div({class: 'grid complete-grid'});
        for (const [number, title, description] of [
            ['01', 'Write', 'Use page methods to describe content.'],
            ['02', 'Compose', 'Nest native elements and SVG.'],
            ['03', 'Review', 'Inspect the result in either language.'],
        ]) {
            const card = cards.article({class: 'card stack'});
            card.p(number, {class: 'eyebrow'});
            card.h3(title);
            card.p(description);
        }
    }

    schedule(main) {
        const section = main.section({id: 'schedule', class: 'stack'});
        section.h2('Schedule');
        const table = section.table();
        table.caption('Three short sessions');
        const heading = table.thead().tr();
        for (const title of ['Time', 'Session', 'Speaker', 'Focus']) heading.th(title, {scope: 'col'});
        const body = table.tbody();
        for (const [time, title, speaker, focus] of SESSIONS) {
            const row = body.tr();
            row.th(time, {scope: 'row'});
            for (const text of [title, speaker, focus]) row.td(text);
        }
    }

    speakers(main) {
        const section = main.section({id: 'speakers', class: 'stack'});
        section.h2('Speakers');
        const cards = section.div({class: 'grid complete-grid'});
        for (const [name, specialty] of SPEAKERS) {
            const card = cards.article({class: 'card'});
            card.h3(name);
            card.p(specialty);
        }
    }

    map(main) {
        const section = main.section({id: 'map', class: 'stack'});
        section.h2('A schematic venue map');
        const figure = section.figure({class: 'card'});
        const drawing = figure.svg({viewBox: '0 0 600 210', role: 'img', aria_labelledby: 'venue-title', class: 'example-art'});
        drawing.title('Entrance, studio and hall connected by a path', {id: 'venue-title'});
        drawing.path({d: 'M80 110 H300 V65 H510', fill: 'none', stroke: 'var(--gramlot-action)', stroke_width: 8});
        for (const [x, y, label] of [[80, 110, 'Entrance'], [300, 65, 'Studio'], [510, 65, 'Hall']]) {
            const stop = drawing.g({transform: `translate(${x} ${y})`});
            stop.circle({cx: 0, cy: 0, r: 15, fill: 'var(--gramlot-warning)'});
            stop.text(label, {x: 0, y: 37, text_anchor: 'middle', font_size: 17, fill: 'currentColor'});
        }
        figure.figcaption('A diagram made of paths, circles and labels; it is not navigation.');
    }

    faq(main) {
        const section = main.section({id: 'faq', class: 'stack'});
        section.h2('Frequently asked questions');
        for (const [question, answer] of QUESTIONS) {
            const details = section.details({class: 'card'});
            details.summary(question);
            details.p(answer);
        }
    }
}
