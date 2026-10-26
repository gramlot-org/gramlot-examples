import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Update SVG from Data";

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'drawing'});
        pane.h1('Bound SVG');
        pane.p("Move the controls and watch the drawing change. SVG attributes use the same Data bindings as text and form fields.");

        const work = pane.div({class: 'grid lesson-workbench'});
        const controls = work.form({class: 'card stack'});
        controls.html_label('Radius', {for: 'radius'});
        controls.input({default: 40, type: 'range', min: 5, max: 80, value: '^.radius', live: true, id: 'radius'});
        controls.html_label('Circle fill', {for: 'fill'});
        controls.input({default: "#ffc400", type: 'color', value: '^.fill', id: 'fill'});
        controls.html_label('Bar width', {for: 'width'});
        controls.input({default: 160, type: 'range', min: 10, max: 260, value: '^.width', live: true, id: 'width'});
        controls.html_label('Bar fill', {for: 'bar'});
        controls.input({default: "#456bc4", type: 'color', value: '^.bar', id: 'bar'});

        const figure = work.figure({class: 'card'});
        const art = figure.svg({viewBox: '0 0 480 200', role: 'img', aria_label: 'A circle and a bar', class: 'example-art'});
        art.circle({cx: 100, cy: 100, r: '^.radius', fill: '^.fill', id: 'circle'});
        art.rect({x: 200, y: 80, height: 40, rx: 6, width: '^.width', fill: '^.bar', id: 'bar-shape'});
        art.text('^.radius', {x: 100, y: 190, text_anchor: 'middle', fill: 'currentColor', id: 'radius-label'});
        figure.figcaption('The circle and the bar read their geometry and paint from the Data.');

    }
}
