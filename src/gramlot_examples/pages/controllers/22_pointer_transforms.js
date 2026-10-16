import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Pointer templates and expressions';
    static css = ['/themes/gramlot-base/theme.css'];
    static locale = 'it-IT';
    static timeZone = 'Europe/Rome';

    main(root) {
        const pane = root.main({class: 'example-page stack', datapath: 'transforms'});
        for (const [path, value] of [['width', 38], ['draft', false], ['name', 'Ada'], ['amount', 1234.5]]) {
            pane.dataSetter({destination_path: `.${path}`, value});
        }
        pane.h1('Same Data, different presentation');
        const sizes = pane.section({class: 'card stack'});
        sizes.h2('1. A number becomes a CSS length');
        sizes.html_label('Width in pixels', {for: 'width-input'});
        sizes.input({id: 'width-input', type: 'number', value: '^.width', live: true});
        sizes.div('Width', {id: 'width-preview', width: '^.width:{}px', background_color: '#456bc4', color: 'white'});
        sizes.p('Edit the number: only its presentation gains px. Clear it: the explicit width disappears.');
        const state = pane.section({class: 'card stack'});
        state.h2('2. A boolean becomes another boolean');
        state.html_label('Draft: allow editing', {for: 'draft-input'});
        state.input({id: 'draft-input', type: 'checkbox', value: '^.draft'});
        state.html_label('Name', {for: 'name-input'});
        state.input({id: 'name-input', value: '^.name', readonly: '^.draft:=!{}'});
        const display = pane.section({class: 'card stack'});
        display.h2('3. Format a number, then wrap the text');
        display.html_label('Amount', {for: 'amount-input'});
        display.input({id: 'amount-input', type: 'number', value: '^.amount', live: true});
        display.p('^.amount', {id: 'amount-display', format: '0.00', mask: 'Total: {} €'});
        display.p('Hover to read the same amount in the title.', {id: 'amount-title',
            title: "^.amount:=_F({}, {pattern: '0.00', mask: '{} €'})"});
        display.p('This page uses Italian formatting. The amount in Data remains a number.');
    }
}

/** The page logic: this page names no methods. */
export class Logic {}
