import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Actions, confirmations and references';
    static css = ['/themes/gramlot-base/theme.css'];
    main(root) {
        const pane = root.main({class: 'example-page stack', datapath: 'buttons'});
        pane.h1('One action, with or without a question');
        pane.dataSetter({destination_path: '.name', value: 'Ada'});
        pane.dataSetter({destination_path: '.confirm', value: true});
        pane.dataSetter({destination_path: '.result', value: 'No action yet'});
        pane.html_label('Ask before running', {for: 'confirm-needed'});
        pane.input({id: 'confirm-needed', type: 'checkbox', value: '^.confirm'});
        pane.button('Run action', {id: 'action', name: '=.name', action: "this.SET('.result', 'Hello ' + name)"});
        pane.button('Ask for a name', {id: 'action-ask', name: '=.name', action: "this.SET('.result', 'Hello ' + name)",
            ask: {title: 'Greeting', fields: [{name: 'name', lbl: 'Name', required: true}]}});
        pane.button('Conditional action', {id: 'conditional-action', name: '=.name', confirm_needed: '=.confirm',
            action: "this.SET('.result', 'Hello ' + name)", ask: 'Send this greeting?', _ask_if: 'confirm_needed'});
        pane.button('Conditional controller', {id: 'conditional-controller'}).dataController({func: 'greet', name: '=.name',
            confirm_needed: '=.confirm', _ask: 'Send this greeting?', _ask_if: 'confirm_needed'});
        pane.button('Conditional fields', {id: 'conditional-fields', name: '=.name', confirm_needed: '=.confirm',
            action: "this.SET('.result', 'Hello ' + name)",
            ask: {title: 'Greeting', _if: 'confirm_needed', fields: [{name: 'name', lbl: 'Name'}]}});
        pane.button('Legacy askIf', {id: 'legacy-askif', name: '=.name', action: "this.SET('.result', 'Hello ' + name)",
            ask: {msg: 'askIf=false alone still asks in legacy semantics.', askIf: 'false'}});
        pane.p('^.result', {id: 'result'});
        pane.h2('Pass the element, without looking up an ID');
        const target = pane.p('Original text', {id: 'reference-target'});
        pane.button('Use Source reference', {id: 'source-reference'}).dataController({func: 'changeSource', target});
        pane.button('Read DOM reference', {id: 'dom-reference'}).dataController({func: 'describeDom',
            target: target.builder.reference(target, 'dom')});
        pane.p('^.reference', {id: 'reference-result'});
    }
}

export class Logic {
    greet(node, {name}) { node.SET('.result', `Hello ${name}`); }
    changeSource(node, {target}) { target.setValue('Changed through Source'); }
    describeDom(node, {target}) { node.SET('.reference', `DOM element: ${target.tagName}`); }
}
