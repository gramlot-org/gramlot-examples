"""AI chat using the shared ChatPane and dataBinder request/feedback contract."""
import json
from uuid import uuid4
from genro_bag import Bag
from gramlot import Page as BasePage, ChatPageStore, GramlotBuilder
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.chat import mygramlot as chat
from gramlot_examples.trials.chat.composition import chat_frame
from gramlot_examples.trials.chat.anthropic_chat import ChatError, get_provider, user_content
from gramlot_examples.trials.chat.openai_images import get_images
from gramlot_examples.trials.chat.prompts import system_prompt


class Page(BasePage):
    title = 'Conversation lab'
    gramlots = [layout, chat]
    css = ['index.css']

    def main(self, root):
        chat_frame(root, datapath='chat', models=get_provider().models,
                   image_models=get_images().models, height='100dvh', id='chat-frame')


class PageStore(ChatPageStore):
    def main(self, root):
        super().main(root)
        root.dataSetter('configuration', Bag(dict(title='', instructions='', notes='')))
        root.dataSetter('settings', Bag(dict(model=next(iter(get_provider().models)),
                        effort='default', imageModel=next(iter(get_images().models)))))
        root.dataSetter('providerContext', Bag())
        root.dataSetter('turns', 0)
        root.dataSetter('notice', '')

    def chat_request(self, node, chat_id, request):
        previous = self.data.get_item(f'chats.{chat_id}.response')
        super().chat_request(node, chat_id, request)
        if self.data.get_item(f'chats.{chat_id}.response') is previous:
            return
        if isinstance(request, Bag) and request.get_item('action') == 'reset':
            self.data.set_item('configuration', Bag(dict(title='', instructions='', notes='')))
            self.data.set_item('providerContext', Bag())
            self.data.set_item('turns', 0)
            self.data.set_item('notice', '')

    def process_message(self, text):
        self.data.set_item('notice', '')
        try:
            return self._answer(text)
        except ChatError as error:
            self.data.set_item('notice', str(error))
            raise

    def _answer(self, text):
        if len(text) > 8000:
            raise ChatError('Enter a message between 1 and 8000 characters.')
        settings = self.data.get_item('settings')
        model, effort, image_model = (settings.get_item(key) for key in ('model', 'effort', 'imageModel'))
        try:
            system = system_prompt(self.data.get_item('configuration'))
        except ValueError as error:
            raise ChatError(str(error)) from None
        context = self.data.get_item('providerContext')
        attachments = self.request_attachments
        image, warning = None, ''

        def generate_image(prompt):
            self.feedback('Generating your image with OpenAI…')
            generated = get_images().generate(prompt, model=image_model)
            self.feedback('Image ready · completing the reply…')
            return generated

        command, _, prompt = text.strip().partition(' ')
        if command == '/image':
            if len(attachments):
                raise ChatError('Use a chat message to read attachments. /image creates a new image without editing attachments.')
            image = generate_image(prompt)
            response = f'Generated image: {prompt}'
        else:
            self.feedback('Thinking with Anthropic…')
            result = get_provider().answer(text, context, model=model, effort=effort,
                                          system=system, generate_image=generate_image, attachments=attachments)
            response, image, warning = result.text, result.image, result.warning
        if not isinstance(response, str):
            raise TypeError('The responder must return text')
        self.feedback('Preparing the response…')
        if image is not None:
            builder = GramlotBuilder()
            builder.root.div('=='+json.dumps(response), white_space='pre-wrap')
            builder.root.img(src='data:image/png;base64,'+image, alt='Generated image',
                             width='100%', max_width='640px', height='auto', border_radius='14px')
            answer = builder.source
        else:
            answer = response
        context.set_item('m_'+uuid4().hex, user_content(text, attachments), _attributes=dict(role='user'))
        context.set_item('m_'+uuid4().hex, response, _attributes=dict(role='assistant'))
        self.data.set_item('turns', self.data.get_item('turns') + 1)
        self.data.set_item('notice', warning)
        return answer
