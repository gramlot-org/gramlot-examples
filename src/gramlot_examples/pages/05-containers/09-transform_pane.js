import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const main_content = root.main({class:'example-page stack', datapath:'transformDemo'});
        main_content.dataFormula({result_path:'.cardStyle',
            formula:'`transform: translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${zoom});`',
            x:'^.pose.x', y:'^.pose.y', rotate:'^.pose.rotate', zoom:'^.pose.zoom', _init:true});

        main_content.p('Drag anywhere on the stage. On a touch screen, use two fingers to rotate and zoom.');
        const stage = main_content.transformPane({
            id:'transform-stage', x:'^.pose.x', y:'^.pose.y', rotate:'^.pose.rotate',
            zoom:'^.pose.zoom', min:0.5, max:3, step:0.01, onEnd:'recordGesture',
            display:'block', overflow:'hidden', height:'270px', border_radius:'8px',
            border:'1px solid var(--gramlot-border-control)',
            background:'var(--gramlot-surface-subtle)',
        });
        const center = stage.div({display:'flex', align_items:'center', justify_content:'center', height:'100%'});
        center.div('▲  Sample card', {
            id:'transform-card', style:'^.cardStyle', padding:'1rem',
            border:'2px solid var(--gramlot-action)', border_radius:'8px',
            background:'var(--gramlot-field-background)', font_weight:'bold',
        });

        const controls = main_content.formlet({col_min_width:'9rem', lbl_position:'TL'});
        for (const [name, label] of [['x', 'X (px)'], ['y', 'Y (px)'], ['rotate', 'Angle (°)']]) {
            controls.numberTextBox({lbl:label, value:`^.pose.${name}`, validate_notnull:true, width:'100%'});
        }
        controls.numberTextBox({lbl:'Zoom', value:'^.pose.zoom', min:0.5, max:3, validate_notnull:true, width:'100%'});
        main_content.textbox({lbl:'Card note', value:'^.note', default:'This text survives a pose reset.', live:true});
        main_content.button('Reset pose', {action:'resetPose'});
        main_content.p('^.gestureCount', {mask:'Completed gestures: {}'});
        main_content.p('^.lastGesture', {id:'transform-last-gesture'});
    }
}

export class Logic {
    resetPose(node) {
        node.SET('.pose.x', 0);
        node.SET('.pose.y', 0);
        node.SET('.pose.rotate', 0);
        node.SET('.pose.zoom', 1);
    }

    recordGesture(node, {x, y, rotate, zoom}) {
        node.SET('.gestureCount', node.GET('.gestureCount') + 1);
        node.SET('.lastGesture',
            `Last gesture: X ${x.toFixed(1)} px, Y ${y.toFixed(1)} px, angle ${rotate.toFixed(1)}°, zoom ${zoom.toFixed(2)}×.`);
    }
}
