import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import chat from '@gramlot/gramlot/components/chat';
import {Logic} from '../src/gramlot_examples/trials/chat/pages/index.js';

function fixture(t) {
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    const page=new Gramlot({document:window.document,transport:false,collections:[chat]});
    page.src.logicRegistry.register(Logic,{resource:'ai-chat'});
    const b=new GramlotBuilder(null,{collections:[chat]});
    const root=b.root.div({datapath:'chat'});
    root.dataSetter({value:new Bag({messages:new Bag(),ready:true,response:null}),destination_path:'.conversation'});
    root.dataSetter({value:new Bag(),destination_path:'.messageData'});
    root.dataSetter({value:new Bag(),destination_path:'.attachments'});
    const log=root.chatMessages({id:'messages'});
    log.dataController({func:'chatRender',messages:'^.conversation.messages',_onBuilt:true});
    page.src.startSource(b.toTytx());
    const node=page.src.source.getNode('main').value.getNodes()[0];
    t.after(()=>{page.dispose();window.close();});
    return {page,node,window};
}

test('AI Page delegates send and completion to the shared binder behavior',t=>{
    const {page,node}=fixture(t);
    page.publish=()=>assert.fail('AI chat must use Data sync');
    page.data.setItem('chat.draft','Draw a fireplace');
    Logic.prototype.chatSend.call({page},node);
    const request=page.data.getItem('chat.conversation.request');
    assert.equal(request.getItem('text'),'Draw a fireplace');
    assert.equal(request.getItem('action'),'send');
    Logic.prototype.chatCompleted.call({page},node,{response:new Bag({id:request.getItem('id'),submitted:'Draw a fireplace',accepted:true,error:''})});
    assert.equal(page.data.getItem('chat.draft'),'');
    assert.equal(page.data.getItem('chat.pending'),false);
    Logic.prototype.chatReset.call({page},node);
    assert.equal(page.data.getItem('chat.conversation.request.action'),'reset');
});

test('image replies are ordinary Source rendered by core and released on reset',t=>{
    const {page,window}=fixture(t);
    const source=new GramlotBuilder();
    source.root.div('=='+JSON.stringify('^Literal image description'));
    source.root.img({src:'data:image/png;base64,iVBORw0KGgo=',alt:'Generated image'});
    const messages=page.data.getItem('chat.conversation.messages');
    messages.setItem('m_a',source.source,{role:'assistant',author:'Assistant'});
    const image=window.document.querySelector('article img');
    assert.equal(image.getAttribute('src'),'data:image/png;base64,iVBORw0KGgo=');
    assert.match(window.document.querySelector('article').textContent,/\^Literal/);
    messages.setItem('m_b','Next message',{role:'user',author:'You'});
    assert.equal(window.document.querySelector('article img'),image);
    page.data.setItem('chat.conversation.messages',new Bag());
    assert.equal(window.document.querySelector('article'),null);
});

test('application controls use ordinary Data',()=>{
    const data=new Map([['.settings.effort','high'],['.contextOpen',false],['.draft','hello']]);
    const node={SET:(path,value)=>data.set(path,value),getRelativeData:path=>data.get(path)};
    Logic.prototype.modelChanged(node);Logic.prototype.toggleContext(node);Logic.prototype.clearDraft(node);
    assert.equal(data.get('.settings.effort'),'default');assert.equal(data.get('.contextOpen'),true);
    assert.equal(data.get('.draft'),'');
});
