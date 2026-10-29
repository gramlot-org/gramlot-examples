"""Direct Images API for the chat trial's explicit /image command."""
import base64
from functools import lru_cache
import os
import openai
from .anthropic_chat import ChatError

IMAGE_MODELS = {'gpt-image-2.5-sunburst': 'Sunburst 2.5', 'gpt-image-2.5-flare': 'Flare 2.5'}


class OpenAIImages:
    def __init__(self, client):
        self.client = client
        available = {model.id for model in client.models.list()}
        self.models = {key: name for key, name in IMAGE_MODELS.items() if key in available}
        if not self.models:
            raise ChatError('No supported GPT Image 2.5 models are available for this key.')

    def generate(self, prompt, *, model):
        if not isinstance(model, str) or model not in self.models:
            raise ChatError('Select an available image model.')
        if not prompt.strip():
            raise ChatError('Write a description after /image.')
        try:
            response = self.client.images.generate(model=model, prompt=prompt, n=1,
                                                   size='1024x1024', quality='low', output_format='png')
        except openai.AuthenticationError:
            raise ChatError('OpenAI rejected the server credential.') from None
        except openai.PermissionDeniedError:
            raise ChatError('OpenAI image access denied. Check project permissions and organization verification.') from None
        except openai.RateLimitError:
            raise ChatError('OpenAI image quota or rate limit reached. Check API billing and project limits.') from None
        except openai.APITimeoutError:
            raise ChatError('OpenAI timed out. No image was saved; the request may still have been billed.') from None
        except openai.APIError:
            raise ChatError('OpenAI could not generate this image. Check model access or try a different description.') from None
        if not response.data or not response.data[0].b64_json:
            raise ChatError('OpenAI returned no image.')
        image = response.data[0].b64_json
        if not base64.b64decode(image, validate=True).startswith(b'\x89PNG\r\n\x1a\n'):
            raise ChatError('OpenAI returned an unexpected image format.')
        return image


@lru_cache(maxsize=1)
def get_images():
    if not os.environ.get('OPENAI_API_KEY'):
        raise ChatError('Image generation needs OPENAI_API_KEY on the server.')
    return OpenAIImages(openai.OpenAI(timeout=120, max_retries=0))
