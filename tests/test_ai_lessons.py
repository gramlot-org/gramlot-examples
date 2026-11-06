"""The ai catalogue lessons: allowed models, session limits, missing keys and no key in Source, Data or HTML.

Provider clients are replaced by local fakes; no paid API call is made.
"""
import asyncio
import importlib.util
import json
from pathlib import Path
from types import SimpleNamespace as NS
from uuid import uuid4
import pytest
pytest.importorskip("anthropic", reason="Install the chat extra to test optional AI providers")
pytest.importorskip("openai", reason="Install the chat extra to test optional AI providers")
from genro_bag import Bag
from gramlot import GramlotBuilder
from gramlot.collection import standard_collections
from gramlot.server import GramlotServer
import gramlot_examples
from gramlot_examples.gallery.collections import collections
from gramlot_examples.trials.ai.environment import NOT_CONFIGURED
from gramlot_examples.trials.chat import anthropic_chat, openai_images
from gramlot_examples.trials.chat.anthropic_chat import EFFORTS
from gramlot_examples.trials.visual_editor_chat import assistant

PAGES = Path(gramlot_examples.__file__).parent / 'trials/ai/pages/93-ai'
ANTHROPIC_SECRET = 'sk-ant-test-NEVER-IN-SOURCE-0123456789'
OPENAI_SECRET = 'sk-openai-test-NEVER-IN-SOURCE-0123456789'
VARIABLES = ('GRAMLOT_AI_MODELS', 'GRAMLOT_AI_MAX_MESSAGES', 'GRAMLOT_AI_MAX_IMAGES',
             'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GRAMLOT_DOCS_ROOT')


def load(name):
    spec = importlib.util.spec_from_file_location(f'ai_lesson_{name}', PAGES / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def clear_caches():
    for factory in (anthropic_chat.get_provider, openai_images.get_images, assistant.get_assistant):
        factory.cache_clear()


class Anthropic:
    """Local stand-in for anthropic.Anthropic: three active models and an echo."""
    instances = []

    def __init__(self, **options):
        self.calls = []
        effort = NS(supported=True, **{level: NS(supported=True) for level in EFFORTS})
        catalog = [NS(id=key, display_name=key.title(), lifecycle='active', capabilities=NS(effort=effort))
                   for key in ('claude-fable-5', 'claude-sonnet-5-5', 'claude-haiku-5-5')]
        self.models = NS(list=lambda **kwargs: catalog)
        self.messages = NS(create=self.create)
        Anthropic.instances.append(self)

    def create(self, **kwargs):
        self.calls.append(kwargs)
        return NS(stop_reason='end_turn', content=[NS(type='text', text='Reply')])


class OpenAI:
    def __init__(self, **options):
        self.calls = []
        self.models = NS(list=lambda: [NS(id=key) for key in openai_images.IMAGE_MODELS])
        self.images = NS(generate=self.generate)

    def generate(self, **kwargs):
        self.calls.append(kwargs)
        return NS(data=[NS(b64_json='iVBORw0KGgoAAAANSUhEUg==')])


@pytest.fixture
def environment(monkeypatch, tmp_path):
    for name in VARIABLES:
        monkeypatch.delenv(name, raising=False)
    monkeypatch.setattr(anthropic_chat.anthropic, 'Anthropic', Anthropic)
    monkeypatch.setattr(assistant.anthropic, 'Anthropic', Anthropic)
    monkeypatch.setattr(openai_images.openai, 'OpenAI', OpenAI)
    monkeypatch.setattr(assistant, 'DocumentationIndex', lambda core, examples: NS(index=lambda: {}))
    Anthropic.instances.clear()
    clear_caches()
    yield monkeypatch
    clear_caches()


def configured(monkeypatch, **variables):
    monkeypatch.setenv('ANTHROPIC_API_KEY', ANTHROPIC_SECRET)
    monkeypatch.setenv('OPENAI_API_KEY', OPENAI_SECRET)
    monkeypatch.setenv('GRAMLOT_DOCS_ROOT', '/unused/by/the/fake/index')
    for name, value in variables.items():
        monkeypatch.setenv(name, value)


def page_source(module):
    builder = GramlotBuilder(collections=[json.loads(c.verify()[c.grammar])
                                          for c in (*standard_collections(), *collections())])
    module.Page().main(builder.root)
    return builder.to_tytx()


def store_of(module):
    store = module.PageStore()
    store.start()
    store.subscribe('chat', 'chats.main', lambda wire: None)
    return store


def send(store, text, **settings):
    for key, value in settings.items():
        store.data.set_item(f'settings.{key}', value)
    store.data.set_item('chats.main.request', Bag(dict(id=uuid4().hex, action='send', text=text, attachments=Bag())))
    return store.data.get_item('chats.main.response.accepted')


# Allowed models

def test_chat_offers_and_accepts_only_allowed_models(environment):
    configured(environment, GRAMLOT_AI_MODELS='claude-sonnet-5-5,claude-haiku-5-5,claude-retired')
    module = load('01-chat')
    source = page_source(module)
    assert 'claude-sonnet-5-5' in source and 'claude-haiku-5-5' in source
    assert 'claude-fable-5' not in source
    store = store_of(module)
    try:
        client = Anthropic.instances[-1]
        assert send(store, 'Hello', model='claude-haiku-5-5') is True
        assert client.calls[-1]['model'] == 'claude-haiku-5-5'
        assert send(store, 'Hello', model='claude-fable-5') is False
        assert len(client.calls) == 1
        assert store.data.get_item('notice') == 'Select an available model.'
    finally:
        store.close()


def test_chat_without_the_variable_keeps_every_active_model(environment):
    configured(environment)
    source = page_source(load('01-chat'))
    assert all(model in source for model in ('claude-fable-5', 'claude-sonnet-5-5', 'claude-haiku-5-5'))


def test_allow_list_without_an_active_model_is_an_explicit_error(environment):
    configured(environment, GRAMLOT_AI_MODELS='claude-retired')
    with pytest.raises(anthropic_chat.ChatError, match='GRAMLOT_AI_MODELS'):
        anthropic_chat.get_provider()
    with pytest.raises(ValueError, match='GRAMLOT_AI_MODELS'):
        assistant.get_assistant()


def test_visual_editor_offers_and_accepts_only_allowed_models(environment):
    configured(environment, GRAMLOT_AI_MODELS='claude-haiku-5-5')
    module = load('02-visual_editor')
    source = page_source(module)
    assert 'claude-haiku-5-5' in source and 'claude-sonnet-5-5' not in source
    store = store_of(module)
    try:
        assert store.data.get_item('editing.model') == 'claude-haiku-5-5'
        store.data.set_item('editing.model', 'claude-fable-5')
        source_bag = GramlotBuilder()
        source_bag.root.div(node_label='pageRoot')
        store.data.set_item('editing.context', Bag(dict(run=1, source=source_bag.to_tytx(), selected='pageRoot', schema='{}')))
        assert send(store, 'Add a title') is False
        assert not Anthropic.instances[-1].calls
        assert store.usage.messages == 0
    finally:
        store.close()


def test_visual_editor_without_the_variable_keeps_every_active_model(environment):
    configured(environment)
    assert set(assistant.get_assistant().models) == {'claude-fable-5', 'claude-sonnet-5-5', 'claude-haiku-5-5'}


# Session limits

def test_chat_message_limit_is_enforced_server_side(environment):
    configured(environment, GRAMLOT_AI_MODELS='claude-haiku-5-5', GRAMLOT_AI_MAX_MESSAGES='2')
    store = store_of(load('01-chat'))
    try:
        assert send(store, 'One') and send(store, 'Two')
        assert send(store, 'Three') is False
        assert len(Anthropic.instances[-1].calls) == 2
        assert store.data.get_item('notice') == 'This page session has reached its limit of 2 AI messages.'
        store.data.set_item('chats.main.request', Bag(dict(id='reset', action='reset')))
        assert send(store, 'After reset') is False  # New conversation does not reset the session limit.
    finally:
        store.close()


def test_chat_image_limit_counts_command_and_tool_images(environment):
    configured(environment, GRAMLOT_AI_MODELS='claude-haiku-5-5', GRAMLOT_AI_MAX_IMAGES='1')
    store = store_of(load('01-chat'))
    try:
        assert send(store, '/image A lighthouse') is True
        assert send(store, '/image A second lighthouse') is False
        assert store.data.get_item('notice') == 'This page session has reached its limit of 1 generated images.'
        assert len(openai_images.get_images().client.calls) == 1
    finally:
        store.close()


def test_hosted_defaults_apply_when_only_the_model_list_is_set(environment):
    configured(environment, GRAMLOT_AI_MODELS='claude-haiku-5-5')
    store = store_of(load('01-chat'))
    try:
        assert (store.usage.max_messages, store.usage.max_images) == (20, 5)
    finally:
        store.close()


def test_visual_editor_limit_answers_without_calling_the_model(environment):
    configured(environment, GRAMLOT_AI_MAX_MESSAGES='0')
    store = store_of(load('02-visual_editor'))
    try:
        assert send(store, 'Add a title') is True
        reply = store.data.get_item('chats.main.messages').nodes[-1].value
        assert reply == 'This page session has reached its limit of 0 AI messages.'
        assert not Anthropic.instances[-1].calls
        assert store.data.get_item('editing.active') is False
    finally:
        store.close()


# Missing keys

@pytest.mark.parametrize('missing', ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY'])
def test_chat_without_a_key_shows_the_not_configured_message(environment, missing):
    configured(environment)
    environment.delenv(missing)
    module = load('01-chat')
    source = page_source(module)
    assert NOT_CONFIGURED in source and 'chat-model' not in source
    store = store_of(module)
    try:
        assert send(store, 'Hello') is False
        assert store.data.get_item('notice') == NOT_CONFIGURED
    finally:
        store.close()
    assert not Anthropic.instances or not Anthropic.instances[-1].calls


@pytest.mark.parametrize('missing', ['ANTHROPIC_API_KEY', 'GRAMLOT_DOCS_ROOT'])
def test_visual_editor_without_configuration_shows_the_not_configured_message(environment, missing):
    configured(environment)
    environment.delenv(missing)
    module = load('02-visual_editor')
    source = page_source(module)
    assert NOT_CONFIGURED in source and 'visual-editor-chat' not in source
    store = store_of(module)
    try:
        assert send(store, 'Add a title') is False
    finally:
        store.close()
    assert not Anthropic.instances


# Keys never reach the page

@pytest.mark.parametrize('name', ['01-chat', '02-visual_editor'])
def test_no_key_in_source_data_or_html(environment, name):
    configured(environment, GRAMLOT_AI_MODELS='claude-haiku-5-5')
    module = load(name)

    class Server(GramlotServer):
        def resolve_page(self, path):
            return module.Page

        def resolve_page_store(self, page_class):
            return module.PageStore

        def resolve_resources(self, path, cls):
            return {"css": [], "js": []}

    server = Server(collections=collections(), websocket_url='/gramlot/store', css_theme=False)
    bootstrap = asyncio.run(server.open_page('/', owner='alice'))
    store = server.page_store(bootstrap.page_id, owner='alice')
    try:
        store.subscribe('chat', 'chats.main', lambda wire: None)
        send(store, 'Hello')
        texts = [bootstrap.html, page_source(module),
                 store.data.to_tytx()]
        for text in texts:
            assert ANTHROPIC_SECRET not in text and OPENAI_SECRET not in text
            assert 'sk-ant' not in text and 'sk-openai' not in text
    finally:
        server.close_all()
