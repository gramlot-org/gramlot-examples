import base64
from gramlot import Page as BasePage, upload
from gramlot.server import UploadTarget


class TemporaryImage(UploadTarget):
    """Return a temporary data URL; a real application chooses its own storage."""
    def __init__(self):
        super().__init__(max_bytes=4 * 1024 * 1024)
        self.chunks = []
        self.outcome = {"state": "pending"}

    def write(self, chunk):
        self.chunks.append(chunk)

    def finish(self):
        content = base64.b64encode(b"".join(self.chunks)).decode("ascii")
        self.chunks.clear()
        self.outcome = {"state": "completed", "result": "data:image/png;base64," + content}
        return self.outcome

    def abort(self):
        if self.outcome["state"] != "completed":
            self.chunks.clear()
            self.outcome = {"state": "unsaved"}
        return self.outcome

    def status(self):
        return self.outcome


class Page(BasePage):
    title = "Editable images"

    def main(self, root):
        main_content = root.main(datapath="imageDemo", padding="16px")
        main_content.dataController(func="attachBrowserCamera", _onStart=True)


        main_content.h2("Browser only")
        main_content.imageUploader(id="local-image", value="^.localImage", storepath=".localQueue")
        main_content.h2("Application upload")
        main_content.imageUploader(id="server-image", value="^.serverImage", storepath=".serverQueue", operation="save_image")

    @upload
    def save_image(self, metadata):
        return TemporaryImage()
