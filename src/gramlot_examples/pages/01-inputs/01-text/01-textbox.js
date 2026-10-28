import {Page as BasePage} from '@gramlot/gramlot/page';
import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static devices = ['desktop', 'tablet', 'phone'];
    static title = 'HTML and components';

    main(root) {
        const pane = root.main({class: 'example-page stack'});
        pane.h1('HTML and components');
        pane.p('Edit any name: all three fields share one Data value. HTML tags and Gramlot components use the same bindings and labelbox.');
        this.options(pane);
        const comparison = pane.div({display: 'grid', gap: '12px', max_width: '56rem',
            grid_template_columns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))'});
        this.html_controls(comparison);
        this.components(comparison);
        pane.h2('Shared Data');
        pane.p('^customer', {id: 'customer-value'});
    }

    html_controls(parent) {
        const card = parent.section({class: 'card stack', min_width: 0});
        card.h2('HTML tags');
        card.p('input + html_button: browser controls, declared through Gramlot.');
        card.input({id: 'customer-html', type: 'text', value: '^customer', lbl: 'Customer',
            lbl_position: '^position', live: '^live', readonly: '^readonly',
            placeholder: 'Enter a name', width: '100%', box_c_width: '100%'});
        card.html_button('Clear name', {id: 'clear-html', type: 'button',
            connect_onclick: "this.SET('customer', '')"});
        card.p('html_button selects the HTML tag. connect_onclick handles its click.', {class: 'muted'});
    }

    components(parent) {
        const fields = parent.formlet({class: 'card stack', min_width: 0, width: '100%'});
        fields.h2('Gramlot components');
        fields.p('textbox + button: controls with Gramlot behavior and dedicated options.');
        fields.textbox({id: 'customer', value: '^customer', lbl: 'Customer',
            lbl_position: '^position', live: '^live', readonly: '^readonly',
            placeholder: 'Enter a name', box_c_width: '100%'});
        fields.textbox({id: 'customer-copy', value: '^customer', lbl: 'Same customer',
            live: '^live', readonly: '^readonly'});
        fields.button('Clear name', {id: 'clear-component', action: "this.SET('customer', '')"});
        fields.p('button exposes action; textbox also supports validation and field state.', {class: 'muted'});
    }

    options(parent) {
        const options = parent.details({max_width: '32rem'});
        options.summary('Options · labels and editing');
        const controls = options.formlet({class: 'stack', width: '100%', max_width: '24rem'});
        controls.html_label('Label position', {for: 'position'});
        const position = controls.select({id: 'position', value: '^position', width: '8rem', max_width: '100%', default: 'TL'});
        for (const code of ['TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR']) position.option(code, {value: code});
        controls.checkbox({value: '^live', lbl: 'Editing', label: 'Update while typing', default: true});
        controls.checkbox({value: '^readonly', lbl: 'State', label: 'Read only', default: false});
    }
}
