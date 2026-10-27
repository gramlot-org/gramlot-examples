from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from urllib.parse import quote
from gramlot import Page as BasePage


def icon(drawing):
    return 'data:image/svg+xml,' + quote('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7b8795" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + drawing + '</svg>', safe='')


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Compare desktop and touch themes"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        content = root.main(class_="example-page stack", max_width="760px")
        content.h1("Mela: desktop and touch")
        content.p("In Gallery Settings choose Theme → Mela and Colors → Theme default. Switch between Light and Dark, then narrow the window to compare compact desktop controls with touch-sized fields. Changing the theme keeps your entries.")
        content.p("Try Document for the hierarchical menu. Open the dialog to test modality, or the floating window to keep using this content. Both windows share the same draft fields.")
        panel = content.framePane(height="320px", border="1px solid var(--gramlot-border)", border_radius="var(--gramlot-radius)", overflow="hidden")
        self.toolbar(panel.top)
        self.fields(panel.center)
        panel.bottom.div("^mela.notice", role="status", padding="6px 12px", default="Ready", id="mela-status")
        actions = content.div(display="flex", flex_wrap="wrap", gap="8px")
        actions.button("Open dialog…", id="mela-open-dialog").dataController("this.SET('mela.dialogOpen', true)")
        actions.button("Open floating…", id="mela-open-floating").dataController("this.SET('mela.floatingOpen', true)")
        for kind in ("dialog", "floatingPane"):
            is_dialog = kind == "dialog"
            window = getattr(root, kind)(title="Document preview", open="^mela.dialogOpen" if is_dialog else "^mela.floatingOpen",
                                         width="480px", height="360px", movable=True, resizable=True, maximizable=True,
                                         id="mela-dialog" if is_dialog else "mela-floating")
            self.toolbar(window.frame.top)
            self.fields(window.frame.center)
            footer = window.frame.bottom.menu(presentation="bar", padding="4px 8px", background="var(--gramlot-surface-subtle)")
            footer.spacer(flex=1)
            close = footer.menuline(caption="Done")
            close.dataController("this.SET('mela.dialogOpen', false)" if is_dialog else "this.SET('mela.floatingOpen', false)")

    def toolbar(self, parent):
        bar = parent.menu(presentation="bar", iconSize=20, padding="3px 6px",
                          background="var(--gramlot-surface-subtle)", border_bottom="1px solid var(--gramlot-border)")
        bar.menuline(caption="Preview", iconSrc=icon('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>')).dataController("this.SET('mela.notice', 'Preview requested')")
        bar.spacer(flex=1)
        menu = bar.menuline(caption="Document").menu()
        menu.menuline(caption="Save draft", iconSrc=icon('<path d="m5 12 4 4L19 6"/>')).dataController("this.SET('mela.notice', 'Draft kept in local Data')")
        menu.menuline("-")
        submenu = menu.menuline(caption="Export").menu()
        submenu.menuline(caption="PDF", disabled=True)
        submenu.menuline(caption="Text preview").dataController("this.SET('mela.notice', 'Text preview requested')")

    def fields(self, pane):
        pane.setAttr({"padding": "12px", "overflow": "auto"})
        fields = pane.formlet(columns=1, lbl_position="TL", box_c_width="100%", gap="10px")
        fields.textbox(lbl="Title", value="^mela.title", placeholder="Enter a document title")
        fields.filteringSelect(lbl="Visibility", value="^mela.visibility", values="private:Private,team:Team", default="private")
        fields.checkbox(lbl="Options", label="Show details", value="^mela.details", default=True)
