from base64 import b64encode
from uuid import uuid4

from genro_bag import Bag
from gramlot import Page as BasePage, endpoint, upload
from gramlot.server import UploadTarget


# This demonstration keeps its application data only for the process lifetime.
_RECORDS = {}


class AttachmentTarget(UploadTarget):
    def __init__(self, record, metadata):
        super().__init__(max_bytes=1024 * 1024)
        self.record = record
        self.metadata = metadata
        self.data = bytearray()
        self.outcome = {"state": "pending"}

    def write(self, chunk):
        self.data.extend(chunk)

    def finish(self):
        attachment_id = "a_" + uuid4().hex
        self.record["attachments"][attachment_id] = {
            "name": self.metadata["name"], "mediaType": self.metadata["mediaType"],
            "fields": self.metadata["fields"], "content": bytes(self.data),
        }
        self.data.clear()
        self.outcome = {"state": "completed", "result": {"attachmentId": attachment_id}}
        return self.outcome

    def abort(self):
        if self.outcome["state"] != "completed":
            self.data.clear()
            self.outcome = {"state": "unsaved"}
        return self.outcome

    def status(self):
        return self.outcome


class Page(BasePage):
    def main(self, root):
        main_content = root.main(datapath="attachmentsDemo", padding="16px")

        main_content.dataFormula(".ready", "recordId != null", recordId="^.context.recordId", _init=True)
        main_content.button("Save record", id="save-record").dataRpc("save_record", result_path=".context.recordId")
        main_content.p("^.context.recordId", id="record-id")
        main_content.attachmentManager(id="attachment-manager", operation="attach_file", storepath=".queue",
                                       contextPath=".context", ready="^.ready", listMethod="list_attachments",
                                       readMethod="preview_attachment", removeMethod="remove_attachment")

    @endpoint
    def save_record(self):
        record = _RECORDS.setdefault(self.page_id, {"id": "r_" + uuid4().hex, "attachments": {}})
        return record["id"]

    @upload
    def attach_file(self, metadata):
        record = _RECORDS.get(self.page_id)
        if record is None:
            raise ValueError("Save the record before uploading")
        if metadata["context"]["recordId"] != record["id"]:
            raise ValueError("Record does not match upload context")
        return AttachmentTarget(record, metadata)

    @endpoint
    def list_attachments(self, context):
        result = Bag()
        record = self._record(context)
        if record:
            for key, item in record["attachments"].items():
                result.set_item(key, None, caption=item["name"], size=len(item["content"]))
        return result

    @endpoint
    def preview_attachment(self, context, selected):
        item = self._record(context)["attachments"].get(selected)
        if item is None:
            return Bag({"kind": "message", "text": "Select an attachment to preview it.", "src": ""})
        media_type = item["mediaType"].lower()
        if media_type in {"image/png", "image/jpeg", "image/gif", "image/webp"}:
            encoded = b64encode(item["content"]).decode("ascii")
            return Bag({"kind": "image", "text": "", "src": f"data:{media_type};base64,{encoded}"})
        if media_type.startswith("text/"):
            try:
                text = item["content"].decode("utf-8")
                return Bag({"kind": "text", "text": text, "src": ""})
            except UnicodeDecodeError:
                pass
        return Bag({"kind": "message", "text": "Preview unavailable.", "src": ""})

    @endpoint
    def remove_attachment(self, context, selected):
        record = self._record(context)
        if selected not in record["attachments"]:
            return False
        del record["attachments"][selected]
        return True

    def _record(self, context):
        record = _RECORDS.get(self.page_id)
        if record is None or context["recordId"] != record["id"]:
            raise ValueError("Record does not match attachment context")
        return record
