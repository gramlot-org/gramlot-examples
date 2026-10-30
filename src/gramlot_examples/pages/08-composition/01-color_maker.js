import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Color Maker: one block, three contexts';
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const main_content = root.main({datapath: 'maker', class: 'color-maker'});
        const header = main_content.div({class: 'maker-header'});
        header.h1('Color Maker');
        const icon = header.button({aria_label: 'Open color palette', title: 'Open color palette',
            action: "this.SET('.paletteOpen', true)"}).svg({viewBox: '0 0 24 24', width: 22, height: 22,
            fill: 'none', stroke: 'currentColor', stroke_width: 1.7});
        icon.path({d: 'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.6-3.2 1.5 1.5 0 0 1 1.2-2.4H18a4 4 0 0 0 4-4C22 7 17.5 3 12 3Z'});
        for (const [x, y] of [[7, 9], [10, 6], [15, 7]]) icon.circle({cx: x, cy: y, r: 1, fill: 'currentColor', stroke: 'none'});
        main_content.p('A learning example: open the palette, select a color block, then move its sliders or press Random.', {class: 'muted'});
        this.preview(main_content);
        this.palette(main_content);
        main_content.p('One RGB method, reused on three independent datapaths. Select a block by clicking it or focusing one of its sliders.', {class: 'maker-note'});
    }

    palette(pane) {
        const window = pane.floatingPane({title: 'Color palette', open: '^.paletteOpen', width: '320px', height: '550px',
            resizable: false, collapsible: false});
        const bar = window.frame.top.div({class: 'maker-palette-bar', selected: '^.selected', default_selected: 'background'});
        bar.span('^.selected', {mask: 'Selected: {}'});
        bar.button('Random', {action: "for (const channel of ['red', 'green', 'blue']) this.SET('.' + this.GET('.selected') + '.' + channel, Math.floor(Math.random() * 256));"});
        const controls = window.frame.center.div({class: 'maker-controls'});
        for (const [name, title, rgb] of [['background', 'Background', [242, 184, 110]],
                                        ['ink', 'Text', [49, 47, 78]],
                                        ['shadow', 'Shadow', [117, 79, 131]]]) {
            const panel = controls.section({panel: name, tabindex: 0, aria_label: title,
                class: "^.selected:='maker-panel' + ({} === {panel} ? ' maker-selected' : '')",
                connect_onclick: "this.SET('.selected', this.getAttr('panel'))",
                connect_onfocusin: "this.SET('.selected', this.getAttr('panel'))"});
            this.colorRgb(panel.div({datapath: `.${name}`}), title, rgb);
        }
    }

    colorRgb(pane, title, rgb) {
        const heading = pane.div({class: 'maker-panel-heading'});
        heading.h2(title);
        heading.span({class: 'maker-swatch', background_color: '^.rgb', aria_hidden: 'true'});
        for (const [i, channel] of ['red', 'green', 'blue'].entries()) {
            const row = pane.div({class: `maker-channel maker-${channel}`});
            row.horizontalSlider({value: `^.${channel}`, lbl: ['Red', 'Green', 'Blue'][i], lbl_position: 'L', lbl_width: '3rem',
                min: 0, max: 255, step: 1, live: true, default: rgb[i]});
            row.span(`^.${channel}`, {class: 'maker-value'});
        }
        pane.dataFormula({result_path: '.rgb', formula: "'rgb(' + red + ', ' + green + ', ' + blue + ')'",
            red: '^.red', green: '^.green', blue: '^.blue', _init: true});
        pane.code('^.rgb', {class: 'maker-code'});
    }

    preview(pane) {
        const stage = pane.section({class: 'maker-stage', aria_label: 'Live color preview'});
        stage.span('LIVE PREVIEW', {class: 'maker-kicker'});
        const frame = stage.div({class: 'maker-shadow', style: '^.shadow.rgb:box-shadow: 0 20px 48px -12px {}'});
        const poster = frame.article({class: 'maker-poster', background_color: '^.background.rgb', color: '^.ink.rgb'});
        poster.span('COLOR STUDIES / 01', {class: 'maker-kicker'});
        poster.h2('A little color.\nA different mood.');
        poster.p('Background, type and shadow — composed by you.');
        poster.div('Aa', {class: 'maker-specimen', aria_hidden: 'true'});
        stage.p('Try a warm background with cool text. Then change only the shadow.', {class: 'muted'});
    }
}
