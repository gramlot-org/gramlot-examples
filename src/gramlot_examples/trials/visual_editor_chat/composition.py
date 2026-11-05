"""Application-specific chat beside the reusable, provider-independent editor."""
from gramlot import ChatPane
from .assistant import get_assistant


def add_editor_chat(editor, document=None):
    pane = editor.pane
    anchor = f"#{pane.attr['visualEditorId']}Editor"
    pane.dataSetter('.chatOpen', True)
    editor.tool_button(editor.rail.menuline(group=True), 'Chat',
                       "this.SET('.chatOpen', !this.GET('.chatOpen'))",
                       'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M21%2011.5a8.5%208.5%200%200%201-8.5%208.5H4l-3%202V11.5a8.5%208.5%200%200%201%2017-0%22%20transform%3D%22translate%282%20-1%29%20scale%28.9%29%22/%3E%3Cpath%20d%3D%22M7%209h10M7%2013h7%22/%3E%3C/svg%3E',
                       title="^.chatOpen:={} ? 'Hide chat' : 'Show chat'")
    pane.dataBinder('.assistant', 'editing')
    pane.dataController(func='assistantApply', operations='^.assistant.operations')
    pane.dataController(func='assistantState', active='^.assistant.active')
    right = editor.frame.right
    right.set_attr(dict(width="^.codeOpen:={} === true ? 'min(720px, calc(100vw - 42px))' : 'min(340px, 35vw)'",
                        hidden='^.chatOpen:=!{}', splitter=True, minSize=320, title='Chat', detachable=True, class_='visual-editor-chat'))
    ui = ChatPane(right, datapath='.chat', height='100%', width='100%', min_width=0, flex=1, design='sidebar', id='visual-editor-chat')
    ui.frame.top.set_attr(height='28px', display='flex', flex_direction='row', align_items='center')
    ui.composer.top.set_attr(height='22px')
    ui.composer.top.div(f'^{anchor}.assistantStatus', role='status', font_size='11px', padding='2px 12px', overflow='hidden', white_space='nowrap', text_overflow='ellipsis')
    mode = ui.toolbar.select(value=f'^{anchor}.editingMode', aria_label='Editing target', width='76px', min_width=0, title='Editing target')
    mode.option('Source', value='source')
    if document is not None:
        editor.code_document(document, frame=ui.frame)
        ui.frame.right.set_attr(width='calc(100% - 320px)')
        mode.option('Code', value='code')
    models = ui.toolbar.select(value=f'^{anchor}.assistant.model', aria_label='Editing model', width='100px', min_width=0, title='Editing model')
    for key, title in get_assistant().models.items():
        models.option(title.removeprefix('Claude '), value=key, title=title)
    return ui
