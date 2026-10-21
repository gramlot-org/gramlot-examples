import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Parent and child messages';
    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'frames'});
        main_content.h1('Parent and child messages');
        main_content.dataSetter({destination_path: '.child', value: false});
        main_content.dataSetter({destination_path: '.text', value: 'Hello'});
        main_content.html_label('Message', {for: 'message'});
        main_content.input({id: 'message', value: '^.text', live: true});
        const parent = main_content.section({hidden: '^.child'});
        const frame = parent.iframe({id: 'detail', title: 'Child page', src: '^.frame_url', class: 'frame-preview'});
        parent.button('Send to child', {id: 'send-child'}).dataController({func: 'sendChild', target: frame, text: '=.text'});
        main_content.button('Reply to parent', {id: 'reply'}).dataController({func: 'reply', text: '=.text', child: '=.child'});
        main_content.p('^.received', {id: 'received'});
        main_content.dataController({func: 'receive', subscribe_message: true});
        main_content.dataController({func: 'setup', _onStart: true});
    }
}

export class Logic {
    setup(node) {
        const url = new URL(this.page.dom.getDomNode(node.parentNode).ownerDocument.location.href);
        const child = url.hash === '#child';
        node.SET('.child', child);
        if (!child) { url.hash = 'child'; node.SET('.frame_url', url.href); }
    }
    sendChild(node, {target, text}) {
        try { this.page.publish({topic: 'message', iframe: target}, {text}); }
        catch (error) { node.SET('.received', error.message); }
    }
    reply(node, {text, child}) {
        if (child) this.page.publish({topic: 'message', parent: true}, {text});
        else node.SET('.received', 'Use Reply inside the child page.');
    }
    receive(node, {text}) { node.SET('.received', text); }
}
