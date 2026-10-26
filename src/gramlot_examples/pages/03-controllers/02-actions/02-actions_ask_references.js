import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Confirm actions and target references";
    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'buttons'});
        main_content.h1('One action, with or without a question');
        main_content.p("Run an action directly, then with confirmation. Cancel a question to leave the result unchanged; the reference examples pass an existing Source or DOM object.");
        main_content.html_label('Ask before running', {for: 'confirm-needed'});
        main_content.input({id: 'confirm-needed', type: 'checkbox', value: '^.confirm'});
        main_content.button('Run action', {id: 'action', name: '=.name', action: "this.SET('.result', 'Hello ' + name)"});
        main_content.button('Ask for a name', {id: 'action-ask', name: '=.name', action: "this.SET('.result', 'Hello ' + name)",
            ask: {title: 'Greeting', fields: [{name: 'name', lbl: 'Name', required: true}]}});
        main_content.button('Conditional action', {id: 'conditional-action', name: '=.name', confirm_needed: '=.confirm',
            action: "this.SET('.result', 'Hello ' + name)", ask: 'Send this greeting?', _ask_if: 'confirm_needed'});
        main_content.button('Conditional controller', {id: 'conditional-controller'}).dataController({func: 'greet', name: '=.name',
            confirm_needed: '=.confirm', _ask: 'Send this greeting?', _ask_if: 'confirm_needed'});
        main_content.button('Conditional fields', {id: 'conditional-fields', name: '=.name', confirm_needed: '=.confirm',
            action: "this.SET('.result', 'Hello ' + name)",
            ask: {title: 'Greeting', _if: 'confirm_needed', fields: [{name: 'name', lbl: 'Name'}]}});
        main_content.button('Legacy askIf', {id: 'legacy-askif', name: '=.name', action: "this.SET('.result', 'Hello ' + name)",
            ask: {msg: 'askIf=false alone still asks in legacy semantics.', askIf: 'false'}});
        main_content.p('^.result', {id: 'result'});
        main_content.h2('Pass the element, without looking up an ID');
        const target = main_content.p('Original text', {id: 'reference-target'});
        main_content.button('Use Source reference', {id: 'source-reference'}).dataController({func: 'changeSource', target});
        main_content.button('Read DOM reference', {id: 'dom-reference'}).dataController({func: 'describeDom',
            target: target.builder.reference(target, 'dom')});
        main_content.p('^.reference', {id: 'reference-result'});
    }
}

export class Logic {
    greet(node, {name}) { node.SET('.result', `Hello ${name}`); }
    changeSource(node, {target}) { target.setValue('Changed through Source'); }
    describeDom(node, {target}) { node.SET('.reference', `DOM element: ${target.tagName}`); }
}
