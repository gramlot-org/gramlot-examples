"""AI-specific controls composed around the shared Gramlot ChatPane."""
import json
from genro_bag import Bag
from gramlot import ChatPane
from gramlot_examples.trials.chat.anthropic_chat import EFFORTS
from gramlot_examples.trials.chat.prompts import BASE_PROMPT


def chat_frame(parent, *, datapath, models, image_models, **attributes):
    ui = ChatPane(parent, datapath=datapath, **attributes)
    frame = ui.frame
    frame.dataSetter('.settings', Bag(dict(model=next(iter(models)), effort='default', imageModel=next(iter(image_models)))))
    frame.dataBinder('.settings', 'settings')
    frame.dataController(func='modelChanged', model='^.settings.model')
    frame.dataSetter('.configuration', Bag(dict(title='', instructions='', notes='')))
    frame.dataSetter('.basePrompt', BASE_PROMPT)
    frame.dataBinder('.configuration', 'configuration')
    frame.dataSetter('.notice', '')
    frame.dataBinder('.notice', 'notice')
    frame.dataSetter('.turns', 0)
    frame.dataBinder('.turns', 'turns')
    frame.dataSetter('.contextOpen', False)
    frame.top.set_attr(height='52px')
    bar = frame.top.div(class_='chat-header', display='flex', align_items='center', gap='12px')
    bar.strong('Conversation lab', flex=1)
    bar.button('New conversation', disabled='^.pending').dataController(func='chatReset')
    bar.button('⚙', aria_label='Chat settings').dataController(func='toggleContext')
    frame.right.set_attr(width='340px', drawer="^.contextOpen:={} ? true : 'close'", drawer_label='Settings',
                         drawer_icon='⚙', drawer_onclick="this.SET('.contextOpen', show);")
    context = frame.right.contentPane(padding='22px', overflow='auto', class_='chat-context')
    context.h3('Chat settings')
    context.p('Applied to the next message when you leave a field. New conversation resets these settings.')
    context.html_label('Chat title', for_='chat-title')
    context.input(value='^.configuration.title', id='chat-title', aria_label='Chat title', maxlength=160, disabled='^.pending')
    context.html_label('Instructions for this chat', for_='chat-instructions')
    context.textarea(value='^.configuration.instructions', id='chat-instructions', aria_label='Instructions for this chat',
                     height='150px', maxlength=12000, disabled='^.pending', placeholder='Role, tone, objectives and preferences…')
    context.html_label('Background notes', for_='chat-notes')
    context.textarea(value='^.configuration.notes', id='chat-notes', aria_label='Background notes',
                     height='100px', maxlength=8000, disabled='^.pending', placeholder='Useful information for this conversation…')
    common = context.details()
    common.summary('Common application prompt · read only')
    common.textarea(value='^.basePrompt', readonly=True, aria_label='Common application prompt', height='260px')
    context.p('Completed turns: ').span('^.turns', id='turn-count')
    context.p('The server sends all completed turns and their attachments with each message. New conversation clears the history.')
    context.h4('Attachments')
    context.p('Use + for images, PDF and UTF-8 text/code. Up to 5 files; 2 MiB per file, 1 MiB for text, 4 MiB total. Attachments are sent to Claude when you send the message.')
    context.h4('Images')
    context.p('Ask naturally to draw or generate an image. The assistant uses the selected image model. /image is also available.')
    context.p('Output: 1024 × 1024 PNG, draft quality. Claude receives the description, not the image pixels.')
    context.h4('Temperature')
    context.input(type='number', id='chat-temperature', aria_label='Temperature', disabled=True,
                  placeholder='Unavailable', title='The current Anthropic API does not accept temperature.')
    context.p('Unavailable in the current Anthropic API.')
    context.p('This local trial waits for the complete answer. History lasts for this page only.')


    ui.composer.set_attr(class_='chat-composer')
    ui.composer.top.set_attr(height='^.notice:={} ? "26px" : "2px"')
    ui.composer.top.div('^.notice', role='status', class_='chat-feedback', padding='6px 16px', hidden='^.notice:=!{}')
    ui.composer.bottom.set_attr(height='44px')
    tools = ui.toolbar
    tools.set_attr(class_='chat-settings')
    model_group = tools.div(class_='model-choice')
    model_group.html_label('Chat', for_='chat-model')
    choice = model_group.select(value='^.settings.model', id='chat-model', aria_label='Chat model', disabled='^.pending')
    for model, info in models.items():
        choice.option(info['name'], value=model)
    image_group = tools.div(class_='model-choice')
    image_group.html_label('Image', for_='image-model')
    images = image_group.select(value='^.settings.imageModel', id='image-model', aria_label='Image model', disabled='^.pending')
    for model, name in image_models.items():
        images.option(name, value=model)
    effort_group = tools.div(class_='model-choice')
    effort_group.html_label('Effort', for_='chat-effort')
    effort = effort_group.select(value='^.settings.effort', id='chat-effort', aria_label='Effort', disabled='^.pending')
    effort.option('Auto', value='default')
    for level in EFFORTS:
        supported = json.dumps([key for key, info in models.items() if level in info['efforts']])
        effort.option(level, value=level, disabled=f'^.settings.model:=!{supported}.includes({{}})')

    tools.button(icon='×', aria_label='Clear draft', title='Clear draft', class_='button--quiet', disabled='^.pending').dataController(func='clearDraft')
    return frame
