from gramlot import Page as BasePage, upload, VisualEditor, SourceImport


class Page(BasePage):
    devices = ("desktop", "tablet")
    data_root = ""
    editor_chat = False
    editor_python = None

    def main(self, root):
        document = self.editor_document(self.editor_python) if self.editor_python else None
        self.editor = VisualEditor(root, datapath="__editor", data_root=self.data_root, height="100dvh",
                                   code_document=None if self.editor_chat else document)
        if self.editor_chat:
            from gramlot_examples.trials.visual_editor_chat.composition import add_editor_chat
            add_editor_chat(self.editor, document)

    @upload
    def import_source(self, metadata):
        if not metadata["name"].lower().endswith(".grmlt"):
            raise ValueError("Expected a .grmlt file")
        return SourceImport()
