import {Page as BasePage} from '@gramlot/native-html/page';

export class Page extends BasePage {
    static title = 'Bound SVG';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'drawing'});
        pane.h1('Bound SVG');

        const controls = pane.form({class: 'card stack'});
        controls.html_label('Radius', {for: 'radius'});
        controls.input({type: 'range', min: 5, max: 80, value: '^.radius', live: true, id: 'radius'});
        controls.html_label('Circle fill', {for: 'fill'});
        controls.input({type: 'color', value: '^.fill', id: 'fill'});
        controls.html_label('Bar width', {for: 'width'});
        controls.input({type: 'range', min: 10, max: 260, value: '^.width', live: true, id: 'width'});
        controls.html_label('Bar fill', {for: 'bar'});
        controls.input({type: 'color', value: '^.bar', id: 'bar'});

        const figure = pane.figure({class: 'card'});
        const art = figure.svg({viewBox: '0 0 480 200', role: 'img', aria_label: 'A circle and a bar', class: 'example-art'});
        art.circle({cx: 100, cy: 100, r: '^.radius', fill: '^.fill', id: 'circle'});
        art.rect({x: 200, y: 80, height: 40, rx: 6, width: '^.width', fill: '^.bar', id: 'bar-shape'});
        art.text('^.radius', {x: 100, y: 190, text_anchor: 'middle', fill: 'currentColor', id: 'radius-label'});
        figure.figcaption('The circle and the bar read their geometry and paint from the Data.');

        pane.dataSetter({destination_path: '.radius', value: 40});
        pane.dataSetter({destination_path: '.fill', value: '#ffc400'});
        pane.dataSetter({destination_path: '.width', value: 160});
        pane.dataSetter({destination_path: '.bar', value: '#456bc4'});
    }
}
