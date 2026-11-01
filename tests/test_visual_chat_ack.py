import json
import pytest
from genro_bag import Bag
from gramlot import GramlotBuilder
from gramlot_examples.trials.visual_editor_chat import assistant as module

class Provider:
    models={'test':'Test'}
    def __init__(self): self.calls=[]
    def start(self,text,context,pending=None): return [dict(role='user',content=text)]
    def step(self,messages,model,index,on_read=None,mode="source",language=None,code_writable=False):
        self.calls.append((messages,model,index))
        if index==2: return dict(text='Done')
        operation=dict(operation='insert',path='pageRoot',tag='h2',label='title')
        return dict(operation=operation,callId=f'call{index}',blocks=[dict(type='tool_use',id=f'call{index}',name='edit_source',input=operation)])

@pytest.fixture
def running(monkeypatch):
    provider=Provider(); monkeypatch.setattr(module,'get_assistant',lambda:provider)
    store=module.SourceAssistantStore(); store.start()
    source=GramlotBuilder(); source.root.div(node_label='pageRoot')
    wire=source.to_tytx()
    store.data.set_item('editing.context',Bag(dict(run=1,source=wire,selected='pageRoot',schema='{}')))
    store.data.set_item('chats.main.request',Bag(dict(id='request1',action='send',text='Add title',attachments=Bag())))
    yield store,provider,wire
    store.close()

def acknowledge(store,wire,index=0,**kw):
    payload=dict(run=1,index=index,applied=True,stop=False,error='',source=wire,selected='pageRoot')
    payload.update(kw)
    store.data.set_item('editing.ack',Bag(payload))

def test_waits_for_ack_and_finishes(running):
    store,provider,wire=running
    assert len(provider.calls)==1
    assert store.data.get_item('editing.active') is True
    assert len(store.data.get_item('editing.operations'))==1
    acknowledge(store,wire)
    assert len(provider.calls)==2
    acknowledge(store,wire)  # duplicate
    assert len(provider.calls)==2
    acknowledge(store,wire,index=1)
    assert len(provider.calls)==3
    assert store.data.get_item('editing.active') is False
    assert store.data.get_item('chats.main.messages').nodes[-1].value=='Done'

def test_rejection_is_returned_to_model(running):
    store,provider,wire=running
    acknowledge(store,wire,applied=False,error='Tab title is required')
    result=provider.calls[-1][0][-1]['content'][0]
    assert result['is_error'] is True
    assert json.loads(result['content'])['error']=='Tab title is required'

def test_stale_ack_and_manual_edit_stop(running):
    store,provider,wire=running
    acknowledge(store,wire,run=0)
    assert len(provider.calls)==1
    acknowledge(store,wire,applied=False,stop=True,error='Source changed manually')
    assert len(provider.calls)==1
    assert store.data.get_item('editing.active') is False
    assert 'Source changed manually' in store.data.get_item('chats.main.messages').nodes[-1].value


@pytest.mark.parametrize('reset',[False,True])
def test_proposal_then_clarification_keeps_intent_without_operations(monkeypatch,reset):
    class AskingProvider(Provider):
        def __init__(self): self.starts=[]; self.answers=iter(['code','clarify','done'])
        def start(self,text,context,pending=None):
            self.starts.append((text,pending,context.get_item('mode')))
            return [dict(role='user',content=text)]
        def step(self,*args,**kwargs):
            decision=next(self.answers)
            return dict(text={'code':'Seleziona Code per preparare la pagina.','clarify':'Quale campo contiene lo stato?','done':'Richiesta annullata.'}[decision],decision=decision)
    provider=AskingProvider(); monkeypatch.setattr(module,'get_assistant',lambda:provider)
    store=module.SourceAssistantStore(); store.start()
    try:
        source=GramlotBuilder(); source.root.div(node_label='pageRoot')
        wire=source.to_tytx()
        store.data.set_item('editing.context',Bag(dict(run=1,mode='source',language='python',codeWritable=True,source=wire,selected='pageRoot',schema='{}')))
        for i,text in enumerate(['Grid degli stati di test.invoice','Sì','Annulla']):
            if i==2 and reset:
                store.data.set_item('chats.main.request',Bag(dict(id='reset',action='reset')))
            store.data.set_item('chats.main.request',Bag(dict(id=f'r{i}',action='send',text=text,attachments=Bag())))
            assert len(store.data.get_item('editing.operations'))==0
            assert store.data.get_item('editing.active') is False
            assert store.data.get_item('editing.context.source')==wire
            assert store.data.get_item('editing.context.mode')=='source'
        assert provider.starts[0][1]==[]
        assert provider.starts[1][1][0]['content']=='Grid degli stati di test.invoice'
        assert provider.starts[1][1][1]['content']=='Seleziona Code per preparare la pagina.'
        assert len(provider.starts[2][1])==(0 if reset else 4)
        assert store.data.get_item('editing.pendingRequest')=='[]'
    finally: store.close()
