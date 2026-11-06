"""Server environment of the AI lessons: allowed models, session limits and missing keys."""
import pytest
from gramlot import GramlotBuilder
from gramlot_examples.trials.ai import environment
from gramlot_examples.trials.ai.environment import (NOT_CONFIGURED, SessionUsage, Unavailable, allowed_models,
                                                     require, unavailable_notice)

VARIABLES = ('GRAMLOT_AI_MODELS', 'GRAMLOT_AI_MAX_MESSAGES', 'GRAMLOT_AI_MAX_IMAGES',
             'ANTHROPIC_API_KEY', 'OPENAI_API_KEY')


@pytest.fixture(autouse=True)
def clean(monkeypatch):
    for name in VARIABLES:
        monkeypatch.delenv(name, raising=False)


def test_allowed_models_absent_listed_and_empty(monkeypatch):
    assert allowed_models() is None
    monkeypatch.setenv('GRAMLOT_AI_MODELS', ' claude-sonnet-5-5 , claude-haiku-5-5,')
    assert allowed_models() == ('claude-sonnet-5-5', 'claude-haiku-5-5')
    monkeypatch.setenv('GRAMLOT_AI_MODELS', ' , ')
    with pytest.raises(ValueError, match='GRAMLOT_AI_MODELS'):
        allowed_models()


def test_limits_are_off_locally_and_default_when_hosted(monkeypatch):
    usage = SessionUsage()
    assert (usage.max_messages, usage.max_images) == (None, None)
    for _ in range(100):
        usage.count_message()
        usage.count_image()
    monkeypatch.setenv('GRAMLOT_AI_MODELS', 'claude-haiku-5-5')
    usage = SessionUsage()
    assert (usage.max_messages, usage.max_images) == (20, 5)
    monkeypatch.setenv('GRAMLOT_AI_MAX_MESSAGES', '2')
    monkeypatch.setenv('GRAMLOT_AI_MAX_IMAGES', '0')
    usage = SessionUsage()
    usage.count_message()
    usage.count_message()
    with pytest.raises(Unavailable, match='limit of 2 AI messages'):
        usage.count_message()
    with pytest.raises(Unavailable, match='limit of 0 generated images'):
        usage.count_image()
    assert (usage.messages, usage.images) == (2, 0)


def test_limit_variables_apply_without_the_model_list_and_reject_invalid_values(monkeypatch):
    monkeypatch.setenv('GRAMLOT_AI_MAX_IMAGES', '3')
    assert (SessionUsage().max_messages, SessionUsage().max_images) == (None, 3)
    for value in ('-1', 'ten', ''):
        monkeypatch.setenv('GRAMLOT_AI_MAX_MESSAGES', value)
        with pytest.raises(ValueError, match='GRAMLOT_AI_MAX_MESSAGES'):
            SessionUsage()


def test_missing_or_empty_key_is_not_configured(monkeypatch):
    with pytest.raises(Unavailable) as missing:
        require('ANTHROPIC_API_KEY')
    assert str(missing.value) == NOT_CONFIGURED == 'AI examples are not configured on this server.'
    monkeypatch.setenv('ANTHROPIC_API_KEY', '')
    with pytest.raises(Unavailable):
        require('ANTHROPIC_API_KEY')
    monkeypatch.setenv('ANTHROPIC_API_KEY', 'set')
    require('ANTHROPIC_API_KEY')


def test_notice_is_ordinary_source():
    builder = GramlotBuilder()
    unavailable_notice(builder.root, NOT_CONFIGURED)
    assert NOT_CONFIGURED in builder.to_tytx()
    assert environment.HOSTED_MAX_MESSAGES == 20 and environment.HOSTED_MAX_IMAGES == 5
