from genro_bag import Bag
from gramlot import Page as BasePage, endpoint
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot_examples.collections.menu_trial import mygramlot


class Page(BasePage):
    title = "Complete document workspace"
    gramlots = [inputs, layout, mygramlot]
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(padding="20px", height="620px")
        pane.h1("6. One menu, two presentations")
        pane.p("Provisional trial: edit the document, use the visible menu bar or open Document, and open Export to load a submenu.")
        pane.dataSetter("document", dict(id=42, title="Working document", query="", locked=False, details=False, hide_export=False, fail=False, result="No command yet"))
        frame = pane.framePane(node_label="document", height="480px")
        controls = frame.top.contentPane(node_label="controls", padding="8px", display="flex", gap="12px", flex_wrap="wrap")
        controls.numberTextBox(value="^document.id", lbl="Document ID", width="9rem")
        controls.checkbox(value="^document.locked", lbl="Disable Save", margin_right="16px")
        controls.checkbox(value="^document.hide_export", lbl="Hide Export", margin_right="16px")
        controls.checkbox(value="^document.fail", lbl="Resolver error")
        self.document_menu(frame.top.menu(presentation="bar").menuline(caption="Document", id="menu-actions").menu())
        bar = frame.top.menu(presentation="bar", orientation="horizontal", node_label="toolbar", id="menu-toolbar")
        self.document_menu(bar)
        bar.spacer(size=12)
        bar.contentPane(node_label="search").input(value="^document.query", placeholder="A normal embedded input", aria_label="Search")
        bar.spacer(flex=1)
        nested = bar.contentPane(node_label="extra").menu(presentation="bar", orientation="vertical")
        nested.menuline("documenti:save", caption="Save after confirmation", ask="Save this document?", parameters=dict(id="^document.id"))
        nested.menuline("documenti:save", caption="Save after 1 second", _delay=1000, parameters=dict(id="^document.id"))
        editor = frame.center.contentPane(frameTarget=True, node_label="editor", padding="16px",
            selfsubscribe_save="save", selfsubscribe_undo="undo", selfsubscribe_toggleDetails="toggleDetails", selfsubscribe_export="exportDocument")
        editor.h2("Document content")
        editor.textbox(value="^document.title", lbl="Title", width="26rem")
        editor.p("Details are visible", hidden="^document.details:=!{}", id="menu-details")
        editor.p("^document.result", id="menu-result", role="status")
        frame.bottom.menu(presentation="bar").menuline("documenti:undo")

    def document_menu(self, menu):
        menu.menuline("documenti:save", disabled="^document.locked", parameters=dict(id="^document.id"))
        menu.menuline("documenti:undo")
        menu.menuline("-")
        menu.menuline("documenti:toggleDetails", checked="^document.details")
        menu.menuline(caption="Export", node_label="export", hidden="^document.hide_export").menu(
            resolver="export_menu", resolver_document_id="^document.id", resolver_fail="^document.fail", cacheTime=30)

    @endpoint
    def export_menu(self, document_id, fail=False):
        if fail:
            raise ValueError("Trial resolver failure: turn off Resolver error, then retry")
        result = Bag()
        for format in ("PDF", "CSV"):
            result.setItem(format.lower(), None, kind="command", command="documenti:export",
                caption=f"{format} — document {document_id}", parameters=dict(id=document_id, format=format), disabled="^document.locked")
        return result
