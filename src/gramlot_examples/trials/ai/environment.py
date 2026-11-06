"""Server environment of the AI lessons: credentials, allowed models and session limits.

Every value is read from the server process environment. Credentials are only
checked for presence here; the provider SDKs read them directly. Nothing read
here is written into Source, Data or logs.

- ``ANTHROPIC_API_KEY``, ``OPENAI_API_KEY``: provider credentials.
- ``GRAMLOT_AI_MODELS``: comma-separated Anthropic model IDs. When set, only
  these models (among the account's active models) are offered and accepted.
- ``GRAMLOT_AI_MAX_MESSAGES``, ``GRAMLOT_AI_MAX_IMAGES``: requests and generated
  images allowed in one page session. When ``GRAMLOT_AI_MODELS`` is set they
  default to 20 and 5; otherwise there is no limit unless they are set.
"""
import os

NOT_CONFIGURED = 'AI examples are not configured on this server.'
MODELS = 'GRAMLOT_AI_MODELS'
MAX_MESSAGES = 'GRAMLOT_AI_MAX_MESSAGES'
MAX_IMAGES = 'GRAMLOT_AI_MAX_IMAGES'
HOSTED_MAX_MESSAGES = 20
HOSTED_MAX_IMAGES = 5


class Unavailable(Exception):
    """A user-facing reason why an AI request cannot run on this server."""


def require(*names):
    """Raise ``Unavailable`` with the not-configured message when a variable is empty or absent."""
    if not all(os.environ.get(name) for name in names):
        raise Unavailable(NOT_CONFIGURED)


def allowed_models():
    """The model IDs listed in ``GRAMLOT_AI_MODELS``, or ``None`` when the variable is not set."""
    value = os.environ.get(MODELS)
    if value is None:
        return None
    models = tuple(item.strip() for item in value.split(',') if item.strip())
    if not models:
        raise ValueError(f'{MODELS} lists no model ID')
    return models


def session_limit(name, hosted_default):
    """The limit in variable ``name``; the hosted default when only ``GRAMLOT_AI_MODELS`` is set; else ``None``."""
    value = os.environ.get(name)
    if value is None:
        return hosted_default if os.environ.get(MODELS) is not None else None
    if not value.strip().isdigit():
        raise ValueError(f'{name} must be a non-negative integer')
    return int(value)


class SessionUsage:
    """The AI requests and generated images of one page session, checked against the limits."""

    def __init__(self):
        self.max_messages = session_limit(MAX_MESSAGES, HOSTED_MAX_MESSAGES)
        self.max_images = session_limit(MAX_IMAGES, HOSTED_MAX_IMAGES)
        self.messages = 0
        self.images = 0

    def count_message(self):
        """Count one request; raise ``Unavailable`` when the session has used all of them."""
        if self.max_messages is not None and self.messages >= self.max_messages:
            raise Unavailable(f'This page session has reached its limit of {self.max_messages} AI messages.')
        self.messages += 1

    def count_image(self):
        """Count one generated image; raise ``Unavailable`` when the session has used all of them."""
        if self.max_images is not None and self.images >= self.max_images:
            raise Unavailable(f'This page session has reached its limit of {self.max_images} generated images.')
        self.images += 1


def unavailable_notice(root, message):
    """Author the lesson's notice in place of the AI interface."""
    # The theme colours cover the page, whose own stylesheet can be dark.
    page = root.div(class_='ai-unavailable', min_height='100dvh', box_sizing='border-box', padding='32px',
                    background='var(--gramlot-surface)', color='var(--gramlot-ink)')
    pane = page.div(role='status', max_width='640px')
    pane.h2('AI lesson unavailable')
    pane.p(message)
    pane.p('The server administrator provides the API keys in the server environment. '
           'The other lessons of the gallery are not affected.')
    return pane
