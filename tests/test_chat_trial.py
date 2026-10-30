"""Conversation state and Anthropic request contracts; no paid API calls here."""
import importlib.util
from pathlib import Path
from uuid import uuid4
from types import SimpleNamespace as NS
import pytest
pytest.importorskip("anthropic", reason="Install the chat extra to test optional AI providers")
pytest.importorskip("openai", reason="Install the chat extra to test optional AI providers")
import gramlot_examples
from gramlot_examples.gallery.collections import collections
from genro_bag import Bag
from gramlot_examples.trials.chat.anthropic_chat import AnthropicChat, ChatError, EFFORTS

PAGES = Path(gramlot_examples.__file__).parent / 'trials/chat/pages'
spec = importlib.util.spec_from_file_location('chat_trial_page', PAGES / 'index.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


@pytest.fixture
def provider(monkeypatch):
    calls = []
    def create(**kwargs):
        calls.append(kwargs)
        text = '\n'.join(item['content'] for item in kwargs['messages'] if item['role'] == 'user')
        return NS(stop_reason='end_turn', content=[NS(type='text', text=text)])
    catalog = [NS(id='model-a', display_name='Model A', lifecycle='active', capabilities=NS(
        effort=NS(supported=True, **{level: NS(supported=level in ('low', 'high')) for level in EFFORTS}))),
        NS(id='retired', lifecycle='retired')]
    client = NS(models=NS(list=lambda **kw: catalog), messages=NS(create=create))
    result = AnthropicChat(client)
    result.calls = calls
    monkeypatch.setattr(module, 'get_provider', lambda: result)
    return result


@pytest.fixture
def store(provider, monkeypatch):
    monkeypatch.setattr(module, "get_images", lambda: NS(models={"gpt-image-2.5-sunburst":"Sunburst 2.5"}))
    instance = module.PageStore(); instance.start()
    instance.subscribe('chat', 'chats.main', lambda wire: None)
    yield instance
    instance.close()


def send(store, text, model='model-a', effort='default', image_model='gpt-image-2.5-sunburst'):
    store.data.set_item('settings', Bag(dict(model=model, effort=effort, imageModel=image_model)))
    store.change('chat', dict(path='request', evt='upd_value', attr={},
                 value=Bag(dict(id=uuid4().hex, action='send', text=text, attachments=Bag()))))


def test_full_context_is_sent_only_by_server_and_options_reach_api(store, provider):
    send(store, 'First line\n<script>alert(1)</script>')
    send(store, 'Remember?', effort='low')
    assert store.data.get_item('turns') == 2
    messages = store.data.get_item('chats.main.messages')
    assert len(messages) == 4
    assert provider.calls[1]['messages'] == [
        dict(role='user', content='First line\n<script>alert(1)</script>'),
        dict(role='assistant', content='First line\n<script>alert(1)</script>'),
        dict(role='user', content='Remember?')]
    assert provider.calls[1]['model'] == 'model-a'
    assert provider.calls[1]['output_config'] == dict(effort='low')
    assert 'output_config' not in provider.calls[0]
    assert 'temperature' not in provider.calls[1]
    assert store.data.get_item('chats.main.response.accepted') is True


@pytest.mark.parametrize('text', ['', '  \n', 'x' * 8001, None, 12])
def test_invalid_message_preserves_context_and_reports_rejection(store, provider, text):
    send(store, 'Existing message'); send(store, text)
    assert store.data.get_item('turns') == 1
    assert len(provider.calls) == 1
    assert store.data.get_item('chats.main.response.error')
    assert store.data.get_item('chats.main.response.accepted') is False


@pytest.mark.parametrize('model,effort', [('retired', 'default'), ('model-a', 'max'), (None, 'low')])
def test_unsupported_configuration_is_rejected_before_api_call(store, provider, model, effort):
    send(store, 'Request', model=model, effort=effort)
    assert not provider.calls
    assert len(store.data.get_item('chats.main.messages')) == 0
    assert store.data.get_item('chats.main.response.accepted') is False


def test_provider_failure_does_not_add_partial_turn_and_can_recover(store, provider):
    original = provider.client.messages.create
    def failing(**kwargs):
        raise RuntimeError('private backend details')
    provider.client.messages.create = failing
    send(store, 'Keep this draft')
    assert store.data.get_item('turns') == 0
    assert len(store.data.get_item('chats.main.messages')) == 0
    assert 'private' not in store.data.get_item('notice')
    provider.client.messages.create = original
    send(store, 'Keep this draft')
    assert store.data.get_item('turns') == 1
    assert store.data.get_item('notice') == ''


def test_incomplete_response_is_not_added_as_completed_context(store, provider):
    provider.client.messages.create = lambda **kwargs: NS(stop_reason='max_tokens', content=[NS(type='text', text='Partial')])
    send(store, 'Long request')
    assert store.data.get_item('turns') == 0
    assert 'output limit' in store.data.get_item('notice')


def test_new_conversation_resets_context_without_touching_another_store(store, provider):
    other = module.PageStore(); other.start()
    other.subscribe('chat', 'chats.main', lambda wire: None)
    try:
        send(store, 'Old context'); send(other, 'Independent context')
        store.data.set_item('chats.main.request', Bag(dict(id=uuid4().hex, action='reset', text=None)))
        assert len(store.data.get_item('chats.main.messages')) == 0
        assert other.data.get_item('chats.main.messages').nodes[0].value == 'Independent context'
        send(store, 'New context')
        assert provider.calls[-1]['messages'] == [dict(role='user', content='New context')]
    finally:
        other.close()


def test_image_command_reports_missing_provider_without_paid_text_call(store, provider):
    original = module.get_images
    module.get_images = lambda: (_ for _ in ()).throw(ChatError('Image generation needs OPENAI_API_KEY on the server.'))
    try:
        send(store, '/image A mountain')
    finally:
        module.get_images = original
    assert not provider.calls
    assert 'OPENAI_API_KEY' in store.data.get_item('notice')


def test_generated_image_uses_same_bag_and_text_context(store, provider, monkeypatch):
    calls = []
    def generate(prompt, *, model):
        calls.append((prompt, model))
        return 'iVBORw0KGgo='
    monkeypatch.setattr(module, 'get_images', lambda: NS(generate=generate, models={'gpt-image-2.5-sunburst':'Sunburst 2.5'}))
    send(store, '/image A mountain')
    assert calls == [('A mountain', 'gpt-image-2.5-sunburst')]
    image = store.data.get_item('chats.main.messages').nodes[-1].value
    assert image.nodes[-1].attr['src'] == 'data:image/png;base64,iVBORw0KGgo='
    assert store.data.get_item('providerContext').nodes[-1].value == 'Generated image: A mountain'
    send(store, 'What did we generate?')
    assert provider.calls[-1]['messages'][1]['content'] == 'Generated image: A mountain'
    assert 'iVBOR' not in repr(provider.calls)


def test_python_composition_builds_native_controls(provider):
    import json
    from gramlot import GramlotBuilder
    builder = GramlotBuilder(collections=[json.loads(c.verify()[c.grammar]) for c in collections()])
    from gramlot_examples.trials.chat.composition import chat_frame
    chat_frame(builder.root, datapath='chat', models=provider.models, image_models={'gpt-image-2.5-sunburst':'Sunburst 2.5'})
    assert 'chat-model' in builder.to_tytx()


def test_images_api_parameters_and_png_validation():
    from gramlot_examples.trials.chat.openai_images import OpenAIImages, IMAGE_MODELS
    calls = []
    def generate(**kwargs):
        calls.append(kwargs)
        return NS(data=[NS(b64_json='iVBORw0KGgo=')])
    images = OpenAIImages(NS(images=NS(generate=generate), models=NS(list=lambda: [NS(id=key) for key in IMAGE_MODELS])))
    assert images.generate('A mountain', model='gpt-image-2.5-flare') == 'iVBORw0KGgo='
    assert calls == [dict(model='gpt-image-2.5-flare', prompt='A mountain', n=1, size='1024x1024', quality='low', output_format='png')]
    with pytest.raises(ChatError):
        images.generate(' ', model='gpt-image-2.5-flare')

    with pytest.raises(ChatError, match='image model'):
        images.generate('A mountain', model='unavailable-model')
    assert len(calls) == 1


def test_chat_configuration_reaches_system_prompt_and_is_isolated(store, provider):
    from gramlot_examples.trials.chat.prompts import BASE_PROMPT
    store.data.set_item('configuration.title', 'Fireplaces')
    store.data.set_item('configuration.instructions', 'Always answer in Italian.')
    store.data.set_item('configuration.notes', 'The room is small.')
    send(store, 'Help me choose')
    system = provider.calls[-1]['system']
    assert system.startswith(BASE_PROMPT)
    assert 'Always answer in Italian.' in system and 'The room is small.' in system
    assert provider.calls[-1]['tools'][0]['name'] == 'generate_image'
    store.data.set_item('chats.main.request', Bag(dict(id=uuid4().hex, action='reset', text=None)))
    assert store.data.get_item('configuration.instructions') == ''
    assert store.data.get_item('configuration.notes') == ''


def test_invalid_configuration_does_not_reach_provider(store, provider):
    store.data.set_item('configuration.instructions', 'x' * 12001)
    send(store, 'Hello')
    assert not provider.calls
    assert 'instructions' in store.data.get_item('notice')


def image_tool(prompt='A fireplace'):
    payload = dict(type='tool_use', id='tool-1', name='generate_image', input=dict(prompt=prompt))
    return NS(**payload, model_dump=lambda **kwargs: payload)


def test_natural_image_request_round_trip_uses_selected_model(store, provider, monkeypatch):
    calls = []
    def generate(prompt, *, model):
        calls.append((prompt, model)); return 'iVBORw0KGgo='
    monkeypatch.setattr(module, 'get_images', lambda: NS(generate=generate))
    requests = []
    def create(**kwargs):
        requests.append(kwargs)
        if len(requests) == 1:
            return NS(stop_reason='tool_use', content=[image_tool()])
        assert kwargs['tool_choice'] == {'type':'none'}
        assert kwargs['messages'][-1]['content'][0]['tool_use_id'] == 'tool-1'
        assert kwargs['messages'][-2]['content'][0]['type'] == 'tool_use'
        return NS(stop_reason='end_turn', content=[NS(type='text', text='Here is the fireplace.')])
    provider.client.messages.create = create
    send(store, 'Draw a fireplace', image_model='gpt-image-2.5-flare')
    assert calls == [('A fireplace', 'gpt-image-2.5-flare')]
    assert len(requests) == 2
    answer = store.data.get_item('chats.main.messages').nodes[-1].value
    assert answer.nodes[-1].attr['src'] == 'data:image/png;base64,iVBORw0KGgo='
    assert 'Here is the fireplace.' in store.data.get_item('providerContext').nodes[-1].value
    assert store.data.get_item('chats.main.response.accepted')


def test_generated_image_survives_text_followup_failure(store, provider, monkeypatch):
    monkeypatch.setattr(module, 'get_images', lambda: NS(generate=lambda prompt, **kwargs: 'iVBORw0KGgo='))
    requests = []
    def create(**kwargs):
        requests.append(kwargs)
        if len(requests) == 1:
            return NS(stop_reason='tool_use', content=[image_tool()])
        return NS(stop_reason='max_tokens', content=[])
    provider.client.messages.create = create
    send(store, 'Draw a fireplace')
    assert store.data.get_item('chats.main.messages').nodes[-1].value.nodes[-1].attr['src'] == 'data:image/png;base64,iVBORw0KGgo='
    assert 'text follow-up' in store.data.get_item('notice')
    assert store.data.get_item('chats.main.response.accepted')


def test_invalid_tool_arguments_never_call_image_provider(store, provider, monkeypatch):
    calls = []
    monkeypatch.setattr(module, 'get_images', lambda: calls.append('unexpected'))
    provider.client.messages.create = lambda **kwargs: NS(stop_reason='tool_use', content=[image_tool('')])
    send(store, 'Draw something')
    assert not calls
    assert store.data.get_item('turns') == 0
    assert store.data.get_item('chats.main.response.accepted') is False


def test_application_composes_core_chat_and_feedback_clears(store, provider, monkeypatch):
    from gramlot import ChatPageStore
    assert isinstance(store, ChatPageStore)
    updates = []
    from genro_tytx import from_tytx
    store.subscribe('observer', 'chats.main', lambda wire: updates.append(from_tytx(wire)))
    send(store, 'Hello')
    values = [m['value'] for m in updates if m.get('path') == 'feedback']
    assert values == ['Thinking with Anthropic…', 'Preparing the response…', '']
    assert store.data.get_item('chats.main.response.accepted') is True
    assert store.data.get_item('providerContext').nodes[-1].value == 'Hello'


def test_replayed_reset_does_not_clear_later_configuration(store):
    request = Bag(dict(id='reset-once', action='reset', text=None))
    store.data.set_item('chats.main.request', request)
    store.data.set_item('configuration.title', 'A new title')
    store.data.set_item('chats.main.request', Bag(dict(id='reset-once', action='reset', text=None)))
    assert store.data.get_item('configuration.title') == 'A new title'


def test_pdf_image_text_content_reaches_provider_and_is_kept_in_context(store, provider):
    import base64
    files=Bag()
    for i,(name,media,raw) in enumerate([
        ('brief.txt','text/plain',b'The code is MAPLE-27.'),
        ('picture.png','image/png',b'\x89PNG\r\n\x1a\n'),
        ('brief.pdf','application/pdf',b'%PDF-1.4 test')]):
        files.set_item(f'a_{i}',Bag(dict(name=name,mediaType=media,size=len(raw),data=base64.b64encode(raw).decode())))
    requests=[]
    def create(**kwargs):
        requests.append(kwargs)
        return NS(stop_reason='end_turn',content=[NS(type='text',text='Files received')])
    provider.client.messages.create=create
    store.data.set_item('chats.main.request',Bag(dict(id='files',action='send',text='Read these',attachments=files)))
    assert store.data.get_item('chats.main.response.accepted') is True
    blocks=requests[0]['messages'][0]['content']
    assert [b['type'] for b in blocks] == ['text','image','document','text']
    assert blocks[2]['source']['media_type'] == 'application/pdf'
    assert 'MAPLE-27' in blocks[0]['text']
    send(store,'What was in the files?')
    assert requests[1]['messages'][0]['content'] == blocks
    assert store.data.get_item('turns') == 2
