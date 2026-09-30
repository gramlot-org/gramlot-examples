import {Page as BasePage} from '@gramlot/native-html/page';

export class Page extends BasePage {
    static title = 'SVG shapes with binding';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'shapes'});
        pane.h1('SVG shape vocabulary, bound');
        pane.p('The six shapes of HTML / SVG example 08. Their size, stroke, color and label come from the Data.');
        const controls = pane.form({class: 'card stack'});
        for (const [label, key, low, high] of [['Rectangle width', 'width', 20, 95], ['Circle radius', 'radius', 10, 45],
            ['Ellipse height', 'ry', 10, 45], ['Stroke width', 'stroke', 1, 14]]) {
            controls.html_label(label, {for: key});
            controls.input({type: 'range', min: low, max: high, value: `^.${key}`, live: true, id: key});
        }
        controls.html_label('Triangle color', {for: 'triangle'});
        controls.input({type: 'color', value: '^.triangle', id: 'triangle'});
        controls.html_label('Label', {for: 'label'});
        controls.input({value: '^.label', live: true, id: 'label'});

        const figure = pane.figure({class: 'card'});
        const art = figure.svg({viewBox: '0 0 480 200', role: 'img', aria_labelledby: 'shapes-title', class: 'example-art'});
        art.title('Six geometric shapes', {id: 'shapes-title'});
        art.rect({x: 15, y: 20, width: '^.width', height: 75, rx: 14, fill: 'var(--gramlot-action)', id: 'rect'});
        art.circle({cx: 172, cy: 58, r: '^.radius', fill: 'var(--gramlot-warning)', id: 'circle'});
        art.ellipse({cx: 263, cy: 58, rx: 26, ry: '^.ry', fill: 'var(--gramlot-selected)', id: 'ellipse'});
        art.line({x1: 294, y1: 20, x2: 315, y2: 98, stroke: 'currentColor', stroke_width: '^.stroke', stroke_linecap: 'round'});
        art.polyline({points: '325,95 345,25 365,70 385,25 405,95', fill: 'none', stroke: 'var(--gramlot-success)',
            stroke_width: '^.stroke', stroke_linejoin: 'round', id: 'polyline'});
        art.polygon({points: '430,95 450,20 470,95', fill: '^.triangle', id: 'polygon'});
        art.text('^.label', {x: 18, y: 150, fill: 'currentColor', font_size: 17, id: 'caption'});
        figure.figcaption('The shape attributes are pointers into the Data.');

        pane.dataSetter({destination_path: '.width', value: 95});
        pane.dataSetter({destination_path: '.radius', value: 38});
        pane.dataSetter({destination_path: '.ry', value: 38});
        pane.dataSetter({destination_path: '.stroke', value: 7});
        pane.dataSetter({destination_path: '.triangle', value: '#456bc4'});
        pane.dataSetter({destination_path: '.label', value: 'rectangle · circle · ellipse · line · polyline · polygon'});
    }
}
