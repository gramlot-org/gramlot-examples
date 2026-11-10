import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const panel = root.div({class: 'single-demo'});
        const fields = panel.div({class: 'single-fields'});
        fields.input({type: 'number', value: '^triangle.base', lbl: 'Base', default: 8, min: 0, max: 10});
        fields.input({type: 'number', value: '^triangle.height', lbl: 'Height', default: 6, min: 0, max: 10});
        fields.input({type: 'color', value: '^triangle.color', lbl: 'Color', default: '#3366cc'});
        fields.dataFormula({result_path: 'triangle.area', formula: 'base * height / 2',
            base: '^triangle.base', height: '^triangle.height', _init: true});
        fields.div('^triangle.area', {lbl: 'Area', lbl_variant: 'card', class: 'single-area'});
        const drawing = panel.svg({viewBox: '-1 -1 12 12', role: 'img', aria_label: 'Triangle', class: 'single-svg'});
        drawing.polygon({points: '^triangle.base:0,0 {},0 0,{height}', height: '^triangle.height',
            fill: '^triangle.color', transform: 'translate(0 10) scale(1 -1)'});
    }
}
