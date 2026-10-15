import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Publish and subscribe';
    static css = ['/themes/gramlot-base/theme.css'];
    main(root) {
        const pane = root.main({class: 'example-page stack', datapath: 'messages'});
        pane.h1('The same action, two entry points');
        pane.p('Compare the direct controller with a page topic. Both update the same summary.');
        pane.dataSetter({destination_path: '.text', value: 'Hello'});
        pane.html_label('Message', {for: 'message'});
        pane.input({id: 'message', value: '^.text', live: true});
        pane.button('Direct controller', {id: 'direct'}).dataController({func: 'save', text: '=.text'});
        pane.button('Publish', {id: 'publish'}).dataController({func: 'publishMessage', text: '=.text'});
        pane.dataController({func: 'save', subscribe_saved: true});
        pane.p('^.summary', {id: 'summary'});
        pane.button('Ask, then publish', {id: 'ask'}).dataController({func: 'publishMessage',
            _ask: {title: 'Message', fields: [{name: 'text', lbl: 'Message', required: true}]}, text: '=.text'});
        pane.h2('Two independent receivers');
        for (const name of ['left', 'right']) {
            const box = pane.section({class: 'card stack', datapath: `.${name}`});
            box.h3(name[0].toUpperCase() + name.slice(1));
            const target = box.dataController({func: 'receive', selfsubscribe_refresh: true});
            box.button(`Send to ${name}`, {id: `send-${name}`}).dataController({func: 'sendToNode', target, text: '=.text'});
            box.p('^.received', {id: `received-${name}`});
            box.dataSetter({destination_path: '.text', value: `Hello ${name}`});
        }
    }
}

export class Logic {
    save(node, {text, _reason}) { node.SET('.summary', `${text} (${_reason})`); }
    publishMessage(node, {text}) { this.page.publish('saved', {text}); }
    sendToNode(node, {target, text}) { target.publish('refresh', {text}); }
    receive(node, {text}) { node.SET('.received', text); }
}
