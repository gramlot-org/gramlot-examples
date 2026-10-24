import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Publish and subscribe';
    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'messages'});
        main_content.h1('The same action, two entry points');
        main_content.p('Compare the direct controller with a page topic. Both update the same summary.');
        main_content.html_label('Message', {for: 'message'});
        main_content.input({id: 'message', value: '^.text', live: true});
        main_content.button('Direct controller', {id: 'direct'}).dataController({func: 'save', text: '=.text'});
        main_content.button('Publish', {id: 'publish'}).dataController({func: 'publishMessage', text: '=.text'});
        main_content.dataController({func: 'save', subscribe_saved: true});
        main_content.p('^.summary', {id: 'summary'});
        main_content.button('Ask, then publish', {id: 'ask'}).dataController({func: 'publishMessage',
            _ask: {title: 'Message', fields: [{name: 'text', lbl: 'Message', required: true}]}, text: '=.text'});
        main_content.h2('Two independent receivers');
        for (const name of ['left', 'right']) {
            const box = main_content.section({class: 'card stack', datapath: `.${name}`});
            box.h3(name[0].toUpperCase() + name.slice(1));
            const target = box.dataController({func: 'receive', selfsubscribe_refresh: true});
            box.button(`Send to ${name}`, {id: `send-${name}`}).dataController({func: 'sendToNode', target, text: '=.text'});
            box.p('^.received', {id: `received-${name}`});
        }
    }
}

export class Logic {
    save(node, {text, _reason}) { node.SET('.summary', `${text} (${_reason})`); }
    publishMessage(node, {text}) { this.page.publish('saved', {text}); }
    sendToNode(node, {target, text}) { target.publish('refresh', {text}); }
    receive(node, {text}) { node.SET('.received', text); }
}
