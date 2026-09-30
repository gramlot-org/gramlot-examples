import {Page as BasePage} from '@gramlot/native-html/page';

const CHOICES = [
    ['Class', 'tone', ['card', 'card status status--success', 'card status status--warning']],
    ['Font size', 'size', ['1rem', '1.5rem', '2rem']],
    ['Corners (rounded)', 'radius', ['0', '8px', '24px']],
];

export class Page extends BasePage {
    static title = 'Style and visibility';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'look'});
        pane.h1('Style and visibility');

        const controls = pane.form({class: 'card stack'});
        for (const [label, key] of [['visible', 'show'], ['hidden', 'hide']]) {
            const row = controls.div();
            row.input({type: 'checkbox', value: `^.${key}`, id: key});
            row.html_label(label, {for: key});
        }
        for (const [label, key] of [['Text color', 'color'], ['Background color', 'background']]) {
            controls.html_label(label, {for: key});
            controls.input({type: 'color', value: `^.${key}`, id: key});
        }
        for (const [label, key, options] of CHOICES) {
            controls.html_label(label, {for: key});
            const select = controls.select({value: `^.${key}`, id: key});
            for (const option of options) select.option(option, {value: option});
        }
        controls.html_label('style', {for: 'style'});
        controls.input({value: '^.style', id: 'style'});

        const stage = pane.div({class: 'stack'});
        stage.p('The box keeps its place when it is not visible.', {class: 'muted'});
        stage.div('A styled box', {id: 'box', class: '^.tone', style: '^.style',
            color: '^.color', background_color: '^.background', font_size: '^.size',
            rounded: '^.radius', padding: '1rem', visible: '^.show', hidden: '^.hide'});
        stage.p('This line follows the box.', {class: 'muted'});

        pane.dataSetter({destination_path: '.show', value: true});
        pane.dataSetter({destination_path: '.hide', value: false});
        pane.dataSetter({destination_path: '.color', value: '#ffffff'});
        pane.dataSetter({destination_path: '.background', value: '#456bc4'});
        pane.dataSetter({destination_path: '.tone', value: 'card'});
        pane.dataSetter({destination_path: '.size', value: '1.5rem'});
        pane.dataSetter({destination_path: '.radius', value: '8px'});
        pane.dataSetter({destination_path: '.style', value: 'border: 4px dashed #ffc400'});
    }
}
