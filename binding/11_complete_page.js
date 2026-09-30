import {Page as BasePage} from '@gramlot/native-html/page';

const SESSIONS = [
    ['09:00', 'A first Source tree', 'Mira', 'mira', 'Describe a page with semantic HTML.'],
    ['10:30', 'Drawing with SVG', 'Theo', 'theo', 'Build a small scene from native shapes.'],
    ['13:00', 'Putting it together', 'Mira & Theo', null, 'Compose cards, a schedule and a summary.'],
];
const SPEAKERS = [['mira', 'Mira', 'Page authoring'], ['theo', 'Theo', 'SVG composition']];
const STOPS = [['entrance', 80, 110, 'Entrance'], ['studio', 300, 65, 'Studio'], ['hall', 510, 65, 'Hall']];
const QUESTIONS = [['Do I need a service?', 'This local example has no remote data.'],
    ['Is the map interactive?', 'The highlighted stop follows the radio buttons above it.']];

export class Page extends BasePage {
    static title = 'A complete page with binding';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const shell = root.div({class: 'example-page complete-page', datapath: 'event'});
        this.header(shell);
        const main_content = shell.html_main({class: 'stack'});
        this.hero(main_content);
        this.schedule(main_content);
        this.speakers(main_content);
        this.map(main_content);
        this.faq(main_content);
        shell.footer().small('^.footer');
        shell.dataSetter({destination_path: '.title', value: 'A day of small interfaces'});
        shell.dataSetter({destination_path: '.footer', value: 'Gramlot binding examples · Data-driven content'});
        shell.dataSetter({destination_path: '.show', value: {mira: true, theo: true}});
        shell.dataSetter({destination_path: '.stop', value: {entrance: false, studio: true, hall: false}});
        shell.dataSetter({destination_path: '.faq_open', value: false});
    }

    header(shell) {
        const header = shell.header({class: 'complete-header'});
        header.p('GRAMLOT FIELD NOTES', {class: 'eyebrow'});
        header.h1('^.title', {id: 'title'});
        header.html_label('Event title', {for: 'title-field'});
        header.input({value: '^.title', live: true, id: 'title-field'});
        const nav = header.nav({aria_label: 'Page sections'});
        for (const [label, target] of [['Schedule', 'schedule'], ['Speakers', 'speakers'], ['Map', 'map'], ['FAQ', 'faq']]) {
            nav.a(label, {href: `#${target}`});
        }
    }

    hero(main_content) {
        const hero = main_content.section({class: 'card complete-hero', aria_label: 'Illustration'});
        const drawing = hero.svg({viewBox: '0 0 720 180', role: 'img', aria_labelledby: 'complete-art-title', class: 'example-art'});
        drawing.title('Three connected steps', {id: 'complete-art-title'});
        drawing.line({x1: 125, y1: 90, x2: 595, y2: 90, stroke: 'var(--gramlot-border)', stroke_width: 8});
        for (const [x, label, color] of [[125, 'WRITE', 'var(--gramlot-action)'],
            [360, 'COMPOSE', 'var(--gramlot-warning)'],
            [595, 'REVIEW', 'var(--gramlot-success)']]) {
            const group = drawing.g({transform: `translate(${x} 90)`});
            group.circle({cx: 0, cy: 0, r: 47, fill: color});
            group.text(label, {x: 0, y: 6, text_anchor: 'middle', font_size: 15,
                font_weight: 'bold', fill: 'var(--gramlot-background)'});
        }
        hero.p('^.title');
    }

    schedule(main_content) {
        const section = main_content.section({id: 'schedule', class: 'stack'});
        section.h2('Schedule');
        const filters = section.div();
        for (const [key, name] of SPEAKERS) {
            filters.input({type: 'checkbox', value: `^.show.${key}`, id: `show-${key}`});
            filters.html_label(`Sessions of ${name}`, {for: `show-${key}`});
        }
        const table = section.table();
        table.caption('Three short sessions');
        const heading = table.thead().tr();
        for (const title of ['Time', 'Session', 'Speaker', 'Focus']) heading.th(title, {scope: 'col'});
        const body = table.tbody();
        SESSIONS.forEach(([time, title, speaker, key, focus], index) => {
            const row = key ? body.tr({visible: `^.show.${key}`, id: `session-${index}`}) : body.tr({id: `session-${index}`});
            row.th(time, {scope: 'row'});
            for (const text of [title, speaker, focus]) row.td(text);
        });
    }

    speakers(main_content) {
        const section = main_content.section({id: 'speakers', class: 'stack'});
        section.h2('Speakers');
        const cards = section.div({class: 'grid complete-grid'});
        for (const [key, name, specialty] of SPEAKERS) {
            const card = cards.article({class: 'card', visible: `^.show.${key}`});
            card.h3(name);
            card.p(specialty);
        }
    }

    map(main_content) {
        const section = main_content.section({id: 'map', class: 'stack'});
        section.h2('A schematic venue map');
        const choice = section.div();
        for (const [key, , , label] of STOPS) {
            choice.input({type: 'radio', group: 'stop', value: `^.stop.${key}`, id: `stop-${key}`});
            choice.html_label(label, {for: `stop-${key}`});
        }
        const figure = section.figure({class: 'card'});
        const drawing = figure.svg({viewBox: '0 0 600 210', role: 'img', aria_labelledby: 'venue-title', class: 'example-art'});
        drawing.title('Entrance, studio and hall connected by a path', {id: 'venue-title'});
        drawing.path({d: 'M80 110 H300 V65 H510', fill: 'none', stroke: 'var(--gramlot-action)', stroke_width: 8});
        for (const [key, x, y, label] of STOPS) {
            const stop = drawing.g({transform: `translate(${x} ${y})`});
            stop.circle({cx: 0, cy: 0, r: 25, fill: 'none', stroke: 'var(--gramlot-success)', stroke_width: 5,
                visible: `^.stop.${key}`, id: `ring-${key}`});
            stop.circle({cx: 0, cy: 0, r: 15, fill: 'var(--gramlot-warning)'});
            stop.text(label, {x: 0, y: 45, text_anchor: 'middle', font_size: 17, fill: 'currentColor'});
        }
        figure.figcaption('The ring marks the stop chosen above the map.');
    }

    faq(main_content) {
        const section = main_content.section({id: 'faq', class: 'stack'});
        section.h2('Frequently asked questions');
        const toggle = section.div();
        toggle.input({type: 'checkbox', value: '^.faq_open', id: 'faq-open'});
        toggle.html_label('Open all answers', {for: 'faq-open'});
        for (const [question, answer] of QUESTIONS) {
            const details = section.details({class: 'card', open: '^.faq_open'});
            details.summary(question);
            details.p(answer);
        }
    }
}
