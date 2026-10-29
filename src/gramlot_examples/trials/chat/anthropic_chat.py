"""Example-local Anthropic client; conversation history remains in PageStore."""
from functools import lru_cache
from dataclasses import dataclass
import anthropic
import base64
import json

EFFORTS = ('low', 'medium', 'high', 'xhigh', 'max')


class ChatError(Exception):
    """A message safe to present to the user without provider diagnostics."""


@dataclass
class ChatReply:
    text: str
    image: str | None = None
    warning: str = ''


IMAGE_TOOL = dict(name='generate_image',
    description='Generate and display one new image when the user asks to draw or create an image. The app chooses the user-selected OpenAI model. No image editing or pixel inspection.',
    input_schema=dict(type='object', properties=dict(prompt=dict(type='string', description='A self-contained image description, up to 8000 characters.')),
                      required=['prompt'], additionalProperties=False))


class AnthropicChat:
    def __init__(self, client):
        self.client = client
        self.models = {}
        for model in client.models.list(limit=100):
            if model.lifecycle != 'active':
                continue
            effort = model.capabilities.effort
            self.models[model.id] = dict(
                name=model.display_name,
                efforts=tuple(level for level in EFFORTS if effort.supported and getattr(effort, level).supported),
            )
        if not self.models:
            raise ChatError('No active Anthropic models are available for this key.')

    def answer(self, text, messages, *, model, effort, system, generate_image, attachments):
        if not isinstance(model, str) or model not in self.models:
            raise ChatError('Select an available model.')
        if effort != 'default' and effort not in self.models[model]['efforts']:
            raise ChatError('The selected model does not support this effort level.')
        history = [dict(role=node.attr['role'], content=node.value) for node in messages.nodes]
        history.append(dict(role='user', content=user_content(text, attachments)))
        if len(json.dumps(history).encode('utf-8')) > 24*1024*1024:
            raise ChatError('This conversation exceeds the attachment context limit. Start a new conversation.')
        parameters = dict(model=model, max_tokens=4096, messages=history, system=system,
                          tools=[IMAGE_TOOL], tool_choice=dict(type='auto', disable_parallel_tool_use=True))
        if effort != 'default':
            parameters['output_config'] = dict(effort=effort)
        response = self._request(parameters)
        if response.stop_reason == 'tool_use':
            calls = [block for block in response.content if block.type == 'tool_use']
            if len(calls) != 1 or calls[0].name != 'generate_image':
                raise ChatError('The model requested an unsupported tool operation.')
            call = calls[0]
            if not isinstance(call.input, dict) or set(call.input) != {'prompt'}:
                raise ChatError('The image tool returned invalid arguments.')
            prompt = call.input['prompt']
            if not isinstance(prompt, str) or not prompt.strip() or len(prompt) > 8000:
                raise ChatError('The image description must contain between 1 and 8000 characters.')
            image = generate_image(prompt)
            history.extend([
                dict(role='assistant', content=[block.model_dump(mode='json', exclude_none=True) for block in response.content]),
                dict(role='user', content=[dict(type='tool_result', tool_use_id=call.id,
                    content='Success: the image was generated and embedded in the chat. Description: ' + prompt)])
            ])
            parameters['tool_choice'] = dict(type='none')
            # Image creation is already complete: a later text failure must not
            # discard the paid result or invite the user to generate it again.
            try:
                final = self._text(self._request(parameters))
                return ChatReply(final + '\n\nImage: ' + prompt, image=image)
            except ChatError:
                return ChatReply('Generated image: ' + prompt, image=image,
                                 warning='Image created. The assistant could not complete its text follow-up.')
        return ChatReply(self._text(response))

    def _request(self, parameters):
        try:
            return self.client.messages.create(**parameters)
        except anthropic.AuthenticationError:
            raise ChatError('Anthropic rejected the server credential.') from None
        except anthropic.RateLimitError:
            raise ChatError('Anthropic usage limit reached. Try again later.') from None
        except anthropic.APITimeoutError:
            raise ChatError('Anthropic timed out. Your draft and previous context are preserved.') from None
        except anthropic.APIError:
            raise ChatError('Anthropic could not complete this request. Check the model and account access.') from None

    def _text(self, response):
        if response.stop_reason != 'end_turn':
            raise ChatError('The model did not finish its answer within this trial\'s output limit. Try a shorter request or lower effort.')
        answer = '\n'.join(block.text for block in response.content if block.type == 'text')
        if not answer.strip():
            raise ChatError('The model returned no text. Your draft and previous context are preserved.')
        return answer


@lru_cache(maxsize=1)
def get_provider():
    """Use only the server process environment; never send credentials to Source."""
    return AnthropicChat(anthropic.Anthropic(timeout=60, max_retries=0))


def user_content(text, attachments):
    """Translate validated Gramlot attachments into provider message content."""
    if not len(attachments):
        return text
    blocks = []
    for node in attachments:
        file = node.value
        name, media, data = (file.get_item(key) for key in ('name', 'mediaType', 'data'))
        if media == 'text/plain':
            decoded = base64.b64decode(data, validate=True).decode('utf-8', errors='strict')
            blocks.append(dict(type='text', text=f'Attached file: {name}\n{decoded}'))
        else:
            source = dict(type='base64', media_type=media, data=data)
            if media == 'application/pdf':
                blocks.append(dict(type='document', source=source, title=name))
            else:
                blocks.append(dict(type='image', source=source))
    blocks.append(dict(type='text', text=text.strip() or 'Describe the attached files.'))
    return blocks
