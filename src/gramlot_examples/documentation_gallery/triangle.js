export function triangle(pane, base, height, color) {
    pane.input({type: 'number', value: '^.base', lbl: 'Base', lbl_position: 'L', default: base, min: 0, max: 10, step: 1});
    pane.input({type: 'number', value: '^.height', lbl: 'Height', lbl_position: 'L', default: height, min: 0, max: 10, step: 1});
    pane.input({type: 'color', value: '^.color', lbl: 'Color', lbl_position: 'L', default: color});
    pane.dataFormula({result_path: '.area', formula: 'base * height / 2', base: '^.base', height: '^.height', _init: true});
    pane.div('^.area', {lbl: 'Area', lbl_variant: 'card', class: 'result'});
    const drawing = pane.svg({viewBox: '-1 -1 12 12', role: 'img', aria_label: 'Triangle', class: 'triangle-svg'});
    drawing.polygon({points: '^.base:0,0 {},0 0,{height}', height: '^.height', fill: '^.color',
        transform: 'translate(0 10) scale(1 -1)'});
}
