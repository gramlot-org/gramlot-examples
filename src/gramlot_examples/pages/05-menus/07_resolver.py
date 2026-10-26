from genro_bag import Bag
from gramlot import Page as BasePage, endpoint
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot_examples.collections.menu_trial import mygramlot


class Page(BasePage):
    title = "Resolver menus and nested Bags"
    gramlots = [inputs, layout, mygramlot]

    def main(self, root):
        main_content = root.main(padding="20px")
        main_content.h1("A submenu supplied by a resolver")
        main_content.p("Open Document → Export, or Export in the visible bar: the server supplies the submenu. Change Document ID and reopen it; ID 0 is empty. Enable Resolver error to try failure and retry. Disable exports and Details are live bindings.")
        controls = main_content.div(display="flex", flex_wrap="wrap", gap="16px")
        controls.numberTextBox(value="^document.id", lbl="Document ID", width="8rem")
        controls.checkbox(value="^document.locked", lbl="Disable exports")
        controls.checkbox(value="^document.hidden", lbl="Hide current document")
        controls.checkbox(value="^document.fail", lbl="Resolver error")
        frame = main_content.framePane(height="390px")
        self.commands(frame.top.menu(presentation="bar").menuline(caption="Document").menu())
        self.commands(frame.top.menu(presentation="bar", id="resolver-toolbar"))
        center = frame.center.contentPane(frameTarget=True, node_label="document_editor", padding="16px",
            selfsubscribe_export="exportDocument", selfsubscribe_toggleDetails="toggleDetails")
        center.h2("Resolver result and live state")
        center.p("^document.result", role="status", id="resolver-result")
        center.p("Details enabled", hidden="^document.details:=!{}")
        center.p("Change Document ID and reopen Export. ID 0 returns an empty Bag. Resolver error enables the Retry state.")

    def commands(self, menu):
        menu.menuline(caption="Export").menu(resolver="export_menu",
            resolver_document_id="^document.id", resolver_fail="^document.fail", cacheTime=30)

    @endpoint
    def export_menu(self, document_id, fail=False):
        if fail:
            raise ValueError("Intentional lesson error: turn off Resolver error and reopen Export")
        result = Bag()
        if document_id == 0:
            return result
        result.setItem("current", None, kind="command", command="documenti:export",
            caption=f"Current document {document_id}", parameters=dict(id=document_id, format="PDF"),
            disabled="^document.locked", hidden="^document.hidden")
        result.setItem("details", None, kind="command", command="documenti:toggleDetails", checked="^document.details")
        result.setItem("separator", None, kind="separator")
        formats = Bag()
        for format in ("PDF", "CSV"):
            formats.setItem(format.lower(), None, kind="command", command="documenti:export",
                caption=format, parameters=dict(id=document_id, format=format), disabled="^document.locked")
        result.setItem("formats", formats, kind="submenu", caption="Other formats")
        result.setItem("recent", None, kind="submenu", caption="Recent documents",
            resolver="recent_menu", resolver_document_id=document_id, cacheTime=30)
        return result

    @endpoint
    def recent_menu(self, document_id):
        result = Bag()
        result.setItem("previous", None, kind="command", command="documenti:export",
            caption=f"Previous document {document_id - 1}", parameters=dict(id=document_id - 1, format="PDF"))
        return result
