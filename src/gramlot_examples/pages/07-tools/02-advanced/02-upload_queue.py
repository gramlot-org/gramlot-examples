from gramlot import Page as BasePage, upload
from gramlot.server import UploadTarget


class InspectUpload(UploadTarget):
    """Inspect a bounded file without retaining its contents."""

    def __init__(self, fields):
        super().__init__(max_bytes=1024 * 1024)
        self.fields = fields
        self.size = 0
        self.outcome = {"state": "pending"}

    def write(self, chunk):
        self.size += len(chunk)

    def finish(self):
        self.outcome = {"state": "completed", "result": {"size": self.size, "fields": self.fields}}
        return self.outcome

    def abort(self):
        if self.outcome["state"] != "completed":
            self.outcome = {"state": "unsaved"}
        return self.outcome

    def status(self):
        return self.outcome


class Page(BasePage):
    title = "Upload queue and metadata"

    def main(self, root):
        main_content = root.main(datapath="uploadDemo", padding="16px")
        main_content.h1("Upload queue and metadata")
        main_content.p("Choose files, select each one, edit its fields, then upload. This demonstration does not save files.")

        main_content.uploader(id="upload-demo", operation="inspect_file", storepath=".queue",
                      selectedPath="^.selected", multiple=True, autoUpload=False, onComplete="uploadCompleted")
        main_content.dataFormula(".editPath", "selected ? 'uploadDemo.queue.' + selected : 'uploadDemo.empty'",
                         selected="^.selected", _init=True)
        main_content.p("^.lastCompleted")
        editor = main_content.div(datapath="^.editPath")
        editor.h2("Selected file metadata")
        editor.textbox(id="upload-title", value="^.metadata.title", lbl="Title", live=True,
                       disabled="^.status:={} !== 'queued'")
        editor.textbox(id="upload-description", value="^.metadata.description", lbl="Description", live=True,
                       disabled="^.status:={} !== 'queued'")

    @upload
    def inspect_file(self, metadata):
        fields = metadata["fields"]
        if any(not isinstance(fields.get(name, ""), str) for name in ("title", "description")):
            raise ValueError("Metadata fields must be text")
        return InspectUpload(fields)
