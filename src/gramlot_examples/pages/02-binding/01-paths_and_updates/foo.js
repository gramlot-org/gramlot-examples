import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Load example data and replay field edits";

    main(root) {
        const pane = root.div({class: 'example-page stack'});
        pane.h1('Automatic initial data');
        pane.p('The customer comes from foo_data.tytx. Edit the name: the preview follows. '
            + 'The accent is interface state, initialized with default.');
        const customer = pane.section({datapath: 'customer', class: 'card stack'});
        customer.html_label('Customer name', {for: 'customer-name'});
        customer.input({value: '^.name', live: true, id: 'customer-name'});
        customer.p('^.name', {id: 'customer-preview', color: '^ui.accent'});
        customer.p('^.city', {id: 'customer-city'});
        pane.html_label('Accent', {for: 'accent'});
        pane.input({type: 'color', value: '^ui.accent', default: '#2563eb', id: 'accent'});
        const draft = pane.section({datapath: 'draft', class: 'card stack'});
        draft.h2('Try an empty form');
        draft.p('Type a name and city yourself, or press Play to copy the customer above '
            + 'into this separate draft, with a short pause between fields. Clear stops playback. Editing the draft does not change the customer.');
        draft.html_label('Draft name', {for: 'draft-name'});
        draft.input({value: '^.name', default: '', live: true, id: 'draft-name'});
        draft.html_label('Draft city', {for: 'draft-city'});
        draft.input({value: '^.city', default: '', live: true, id: 'draft-city'});
        const actions = draft.div({class: 'actions'});
        actions.button('Play · fill sample', {id: 'fill-sample', type: 'button'}).dataController({func: 'playSample'});
        actions.button('Clear draft', {id: 'clear-draft', type: 'button'}).dataController({func: 'clearSample'});
        draft.dataController({
            script: "this.SET('draft.city', sample.getItem('city')); this.SET('ui.playSample', null);",
            sample: '^ui.playSample', _if: 'sample', _delay: 300});
        draft.p('^.name', {id: 'draft-preview'});
    }
}

export class Logic {
    playSample(node) {
        const sample = node.GET('customer').deepcopy();
        const draft = sample.deepcopy();
        draft.setItem('city', '');
        node.SET('draft', draft);
        node.SET('ui.playSample', sample);
    }

    clearSample(node) {
        node.SET('ui.playSample', null);
        node.SET('draft', null);
    }
}
