"""Documentation lookup never mutates Source or opens arbitrary paths."""
import json
from pathlib import Path
from types import SimpleNamespace
import pytest
from genro_bag import Bag
from gramlot import GramlotBuilder
from gramlot_examples.trials.visual_editor_chat import documentation
from gramlot_examples.trials.visual_editor_chat.documentation import DocumentationIndex
from gramlot_examples.trials.visual_editor_chat.assistant import SourceAssistant

@pytest.fixture
def documents(tmp_path):
    roots={name:tmp_path/name for name in ('gramlot','gramlot-examples')}
    manifest=json.loads(Path(documentation.__file__).with_suffix('.json').read_text())
    content='# Manual\nCurrent scope.\n\n<a id="formlet"></a>\n### `formlet`\ncolumns: integer count or CSS track list.\n\n### `groupBox`\nLabeled container.\n'
    for entry in manifest['documents']:
        path=roots[entry['repository']]/entry['path']
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(content)
    return DocumentationIndex(roots['gramlot'],roots['gramlot-examples'])

def test_index_and_every_section_resolve(documents):
    index=documents.index()
    assert len(index['topics'])==11
    assert len(index['documents'])==13
    for doc in index['documents']:
        assert 'text' not in doc and 'sections' not in doc
        toc=documents.read(doc['id'])
        assert toc['sections']
        for entry in toc['sections']:
            result=documents.read(doc['id'],entry['section'])
            assert result['text'].strip()
            assert result['digest']==doc['digest']
    binding=documents.read('data-binding')['sections']
    assert not any(s['section'].startswith('Text:') for s in binding)

def test_read_is_bounded_to_registered_sections(documents):
    for path in ('../../secrets','/etc/passwd','https://example.com'):
        with pytest.raises(ValueError,match='document ID'): documents.read(path)
    with pytest.raises(ValueError,match='exact section'): documents.read('widgets','invented')
    form=documents.read('widgets','`formlet`')
    assert 'formlet' in form['text']
    assert '### `groupBox`' not in form['text']
    assert form['anchors']

def test_fenced_example_headings_are_not_document_sections():
    source='# Title\nIntro\n\n<a id="known"></a>\n## Fields\n```python\n# Example comment\n## Not a heading\n```\n## Layout\nBody\n'
    sections=DocumentationIndex._sections(source)
    assert [s['section'] for s in sections]==['Title','Fields','Layout']
    assert sections[1]['anchors']==['known']
    assert '## Not a heading' in sections[1]['text']

class Block(SimpleNamespace):
    def model_dump(self,**kwargs): return vars(self)

def tool(name,args,id):
    return SimpleNamespace(stop_reason='tool_use',content=[Block(type='tool_use',name=name,input=args,id=id)])

def assess(decision='edit',message='The complete request is feasible in the current mode.'):
    return tool('assess_request',dict(decision=decision,message=message),'assessment')

def end():
    return SimpleNamespace(stop_reason='end_turn',content=[Block(type='text',text='Done')])

class Client:
    def __init__(self,replies):
        self.replies=iter(replies); self.requests=[]
        self.models=SimpleNamespace(list=lambda **kw:[SimpleNamespace(id='test',display_name='Test',lifecycle='active')])
        self.messages=SimpleNamespace(create=self.create)
    def create(self,**kwargs):
        self.requests.append(json.loads(json.dumps(kwargs)))
        return next(self.replies)

def test_prompt_contains_index_and_reads_only_requested_section_before_edit(documents):
    operation=dict(operation='insert',path='pageRoot',tag='formlet',label='form',attributes={'columns':2})
    client=Client([tool('read_gramlot_doc',{'document':'widgets'},'contents'),
                   tool('read_gramlot_doc',{'document':'widgets','section':'`formlet`'},'section'),
                   assess(),tool('edit_source',operation,'edit')])
    provider=SourceAssistant(client,documents)
    source=GramlotBuilder(); source.root.div(node_label='pageRoot')
    context=Bag(dict(source=source.to_tytx(),selected='pageRoot',schema='{}'))
    history=provider.start('Add a form',context)
    payload=json.loads(history[0]['content'])
    assert 'documentationIndex' in payload
    assert 'sections' not in payload['documentationIndex']['documents'][0]
    references=[]
    result=provider.step(history,'test',0,on_read=references.append)
    assert result['operation']==operation
    assert [r.get('section') for r in references]==[None,'`formlet`']
    assert len(history)==7  # Read results and assessment persist for the editing acknowledgement.
    assert 'text' not in json.loads(history[2]['content'][0]['content'])
    assert 'text' in json.loads(history[4]['content'][0]['content'])
    assert source.source.nodes[0].value is None

def test_invalid_lookup_returns_error_to_model_without_editing(documents):
    client=Client([tool('read_gramlot_doc',{'document':'../../secret'},'bad'),end()])
    history=[dict(role='user',content='Read a manual')]
    result=SourceAssistant(client,documents).step(history,'test',0)
    assert result['text']=='Done'
    assert history[-1]['content'][0]['is_error'] is True

def test_read_budget_does_not_consume_edit_budget(documents):
    replies=[tool('read_gramlot_doc',{'document':'widgets'},f'read{i}') for i in range(8)]
    operation=dict(operation='insert',path='pageRoot',tag='div',label='new')
    client=Client([*replies,assess(),tool('edit_source',operation,'edit')])
    history=[dict(role='user',content='Read then edit')]
    assert SourceAssistant(client,documents).step(history,'test',0)['operation']==operation
    assert [t['name'] for t in client.requests[-1]['tools']]==['edit_source']


def test_python_mode_edits_draft_with_no_source_tool(documents):
    draft="from gramlot import Page as BasePage\nclass Page(BasePage):\n    def main(self, root):\n        root.h2('Draft')\n"
    client=Client([assess(),tool('edit_code',{'content':draft},'draft')])
    result=SourceAssistant(client,documents).step([dict(role='user',content='Add heading')],'test',0,mode='code',language='python')
    assert result['operation']==dict(operation='replace_code',content=draft)
    assert [t['name'] for t in client.requests[1]['tools']]==['edit_code','read_gramlot_doc']
    assert 'only the user pressing Save' in client.requests[0]['system']

def test_python_mode_rejects_invalid_syntax_before_delivery(documents):
    client=Client([assess(),tool('edit_code',{'content':'class Broken:'},'bad')])
    with pytest.raises(SyntaxError):
        SourceAssistant(client,documents).step([dict(role='user',content='Edit')],'test',0,mode='code',language='python')

def test_source_mode_does_not_accept_python_tool(documents):
    client=Client([assess(),tool('edit_code',{'content':'pass'},'wrong')])
    with pytest.raises(ValueError,match='Unsupported'):
        SourceAssistant(client,documents).step([dict(role='user',content='Edit')],'test',0)


def test_javascript_code_mode_returns_only_an_unsaved_draft(documents):
    draft="export class Page extends BasePage { main(root) { root.h2('Draft'); } }"
    client=Client([assess(),tool('edit_code',{'content':draft},'draft')])
    result=SourceAssistant(client,documents).step([dict(role='user',content='Edit JavaScript')],
                                                'test',0,mode='code',language='javascript')
    assert result['operation']==dict(operation='replace_code',content=draft)
    assert 'JavaScript' in client.requests[0]['system']
    assert 'only the user pressing Save' in client.requests[0]['system']


@pytest.mark.parametrize('mode,language,operation', [
    ('source',None,tool('edit_source',dict(operation='insert',path='pageRoot',tag='tabContainer'),'early')),
    ('code','python',tool('edit_code',{'content':'pass'},'early'))])
def test_harness_rejects_mutation_without_assessment(documents,mode,language,operation):
    client=Client([operation])
    with pytest.raises(ValueError,match='assessment is required'):
        SourceAssistant(client,documents).step([], 'test',0,mode=mode,language=language)
    assert [t['name'] for t in client.requests[0]['tools']]==['assess_request','read_gramlot_doc']

@pytest.mark.parametrize('language',['python','javascript'])
def test_code_proposal_stops_before_any_source_change(documents,language):
    client=Client([assess('code',f'Serve {language}: seleziona Code per continuare.')])
    result=SourceAssistant(client,documents).step([], 'test',0,language=language,code_writable=True)
    assert result==dict(decision='code',text=f'Serve {language}: seleziona Code per continuare.')
    assert len(client.requests)==1
    assert 'edit_source' not in [t['name'] for t in client.requests[0]['tools']]

@pytest.mark.parametrize('mode,code_writable',[('source',False),('code',True)])
def test_code_proposal_requires_source_mode_and_writable_host(documents,mode,code_writable):
    client=Client([assess('code','Use Code')])
    with pytest.raises(ValueError,match='editable code document'):
        SourceAssistant(client,documents).step([], 'test',0,mode=mode,language='python',code_writable=code_writable)

def test_clarification_preserves_page_and_pending_context(documents):
    client=Client([assess('clarify','test.invoice è la tabella?')])
    provider=SourceAssistant(client,documents)
    source=GramlotBuilder(); source.root.div(node_label='pageRoot')
    context=Bag(dict(source=source.to_tytx(),mode='source',selected='pageRoot',schema='{}',language='python',codeWritable=True))
    pending=[dict(role='user',content='Grid degli stati da test invoice'),dict(role='assistant',content='test.invoice è la tabella?')]
    history=provider.start('Sì',context,pending)
    payload=json.loads(history[0]['content'])
    assert payload['pendingRequest']==pending
    assert payload['instruction']=='Sì'
    assert payload['codeWritable'] is True and payload['language']=='python'
    assert payload['code'] is None
    result=provider.step(history,'test',0,language='python',code_writable=True)
    assert result['decision']=='clarify'
    assert 'operation' not in result
    assert source.source.nodes[0].value is None

@pytest.mark.parametrize('input', [dict(decision='edit'),dict(decision='unknown',message='x'),dict(decision='edit',message='')])
def test_invalid_assessment_never_exposes_edit_tools(documents,input):
    client=Client([tool('assess_request',input,'bad')])
    with pytest.raises(ValueError,match='Expected a request assessment'):
        SourceAssistant(client,documents).step([],'test',0)
    assert len(client.requests)==1
