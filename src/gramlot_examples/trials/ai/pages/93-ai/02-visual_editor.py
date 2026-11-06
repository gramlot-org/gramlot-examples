"""The visual editor with a chat that edits its Source through an Anthropic model."""
from gramlot import Page as BasePage, upload, VisualEditor, SourceImport
from gramlot_examples.trials.ai.environment import Unavailable, unavailable_notice
from gramlot_examples.trials.visual_editor_chat.assistant import SourceAssistantStore as PageStore, get_assistant
from gramlot_examples.trials.visual_editor_chat.composition import add_editor_chat


class Page(BasePage):
    devices = ("desktop", "tablet")

    def main(self, root):
        try:
            get_assistant()
        except Unavailable as error:
            unavailable_notice(root, str(error))
            return
        self.editor = VisualEditor(root, datapath="__editor", data_root="", height="100dvh")
        add_editor_chat(self.editor)

    @upload
    def import_source(self, metadata):
        if not metadata["name"].lower().endswith(".grmlt"):
            raise ValueError("Expected a .grmlt file")
        return SourceImport()

