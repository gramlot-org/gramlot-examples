"""One Source specimen shared by the three appearance preview pages."""
from urllib.parse import quote
from gramlot import Page as BasePage
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.inputs import mygramlot as inputs
from gramlot_examples.collections.menu_trial import mygramlot


def icon(path):
    return "data:image/svg+xml," + quote('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7c899c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="'+path+'"/></svg>', safe="")


class PreviewPage(BasePage):
    gramlots = [layout, inputs, mygramlot]
    profile = "Compact"
    density = "28px controls / 13px text"

    def main(self, root):
        root.dataSetter("preview", dict(open=False, floating=False, details=True, locked=False,
                                       name="North studio", reference="PO-1048", status="Ready", notice="Ready to edit", selected="record"))
        page = root.main(class_="example-page stack", max_width="1000px", gap="var(--gramlot-space-4)")
        page.h1(self.profile + " · workspace")
        page.p(self.density + ". Compare forms, menus, tables and windows.", class_="muted")
        links = page.nav(display="flex", gap="var(--gramlot-space-3)", flex_wrap="wrap", aria_label="Compare appearance profiles")
        for caption, path in (("Joanna · 32px", "11_joanna"), ("Compact · 28px", "12_compact"), ("Mimi · 24px", "13_mimi")):
            links.a(caption, href="/pages/menu/"+path, target="_top")
        page.p("Profile links open a standalone preview. Gallery Settings let you combine theme, colors and light/dark independently. Save is local only.", class_="muted")
        page.a("Open gallery · Settings", href="/", target="_top")
        frame = page.framePane(height="360px", border="1px solid var(--gramlot-border)", border_radius="var(--gramlot-radius-lg)", overflow="hidden")
        bar = frame.top.menu(presentation="bar", iconSize=18, padding="2px 4px", background="var(--gramlot-surface-subtle)", border_bottom="1px solid var(--gramlot-border)", id="theme-toolbar")
        bar.menuline("documenti:save", iconSrc=icon("M5 3h12l4 4v14H3V3h2ZM7 3v6h9V3M7 21v-8h10v8"), disabled="^preview.locked")
        bar.menuline("documenti:undo", iconSrc=icon("M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6"))
        bar.spacer(flex=1)
        menu = bar.menuline(caption="View").menu()
        menu.menuline("documenti:toggleDetails", caption="Details", checked="^preview.details")
        menu.menuline("-")
        menu.menuline("documenti:save", disabled="^preview.locked", iconSrc=icon("M5 3h12l4 4v14H3V3h2ZM7 3v6h9V3M7 21v-8h10v8"))
        center = frame.center.contentPane(frameTarget=True, selfsubscribe_save="save", selfsubscribe_undo="reset", selfsubscribe_toggleDetails="toggleDetails", overflow="auto", padding="var(--gramlot-space-4)")
        tabs = center.tabContainer(height="100%", selectedPage="^preview.selected", id="theme-tabs")
        record = tabs.contentPane(title="Record", pageName="record", padding="var(--gramlot-space-3)", overflow="auto")
        grid = record.div(display="grid", grid_template_columns="repeat(auto-fit,minmax(min(100%,220px),1fr))", gap="var(--gramlot-space-3)", align_items="start")
        native = grid.div()
        native.html_label("Customer · native input", for_="theme-native", display="block")
        native.input(value="^preview.name", live=True, id="theme-native")
        component = grid.div()
        component.textbox(value="^preview.reference", lbl="Reference · component", live=True, width="100%", id="theme-component")
        state = grid.div()
        state.html_label("Status", for_="theme-status", display="block")
        select = state.select(value="^preview.status", id="theme-status")
        for value in ("Ready", "In progress", "Done"):
            select.option(value, value=value)
        locked = grid.div()
        locked.html_label("Read only", for_="theme-readonly", display="block")
        locked.input(value="Assigned automatically", readonly=True, id="theme-readonly")
        record.checkbox(value="^preview.locked", label="Disable Save", margin_top="var(--gramlot-space-3)")
        detail = record.div(hidden="^preview.details:=!{}", margin_top="var(--gramlot-space-3)")
        detail.html_label("Notes", for_="theme-notes", display="block")
        detail.textarea(value="^preview.notes", placeholder="Add a short note…", rows=2, id="theme-notes")
        validation = record.div(margin_top="var(--gramlot-space-3)")
        validation.html_label("Validation state", for_="theme-invalid", display="block")
        validation.input(value="Check this value", aria_invalid="true", aria_describedby="theme-error", id="theme-invalid")
        validation.p("Example error: enter a valid reference.", color="var(--gramlot-error)", id="theme-error", margin="3px 0 0")
        rows = tabs.contentPane(title="Items", pageName="items", padding="var(--gramlot-space-3)", overflow="auto")
        table = rows.table(min_width="420px")
        head = table.thead().tr()
        for label in ("Reference", "Description", "Status"): head.th(label)
        body = table.tbody()
        for ref, text, state in (("PO-1048", "Workspace review", "Ready"), ("PO-1049", "Toolbar alignment", "In progress"), ("PO-1050", "Focus and contrast", "Ready"), ("PO-1051", "Compact form", "Done")):
            row = body.tr()
            for value in (ref, text, state): row.td(value)
        footer = frame.bottom.menu(presentation="bar", padding="2px 4px", iconSize=18, background="var(--gramlot-surface-subtle)", border_top="1px solid var(--gramlot-border)")
        footer.menuline(group=True).span("^preview.notice", class_="muted")
        footer.spacer(flex=1)
        footer.menuline(caption="Open dialog", action="openDialog", overflowable=False)
        footer.menuline(caption="Floating", action="openFloating", overflowable=False)
        self.window(root.dialog(title=self.profile+" · Edit record", open="^preview.open", width="440px", height="200px", movable=True, resizable=True, collapsible=True, maximizable=True), "preview.open")
        self.window(root.floatingPane(title=self.profile+" · Tools", open="^preview.floating", width="320px", height="200px", maximizable=True), "preview.floating")

    def window(self, window, path):
        frame = window.frame
        toolbar = frame.top.menu(presentation="bar", iconSize=18, padding="2px 4px", background="var(--gramlot-surface-subtle)", border_bottom="1px solid var(--gramlot-border)")
        toolbar.menuline("documenti:undo", caption="Reset", iconSrc=icon("M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6"))
        center = frame.center.contentPane(frameTarget=True, selfsubscribe_save="save", selfsubscribe_undo="reset", padding="var(--gramlot-space-4)", overflow="auto")
        center.textbox(value="^preview.name", lbl="Customer", live=True, width="100%")
        center.p("^preview.notice", role="status", margin_top="var(--gramlot-space-3)")
        footer = frame.bottom.menu(presentation="bar", iconSize=18, padding="2px 4px", background="var(--gramlot-surface-subtle)", border_top="1px solid var(--gramlot-border)")
        footer.spacer(flex=1)
        footer.menuline(caption="Close", action="closeWindow", parameters=dict(path=path))
        footer.menuline("documenti:save", disabled="^preview.locked", iconSrc=icon("M5 3h12l4 4v14H3V3h2ZM7 3v6h9V3M7 21v-8h10v8"))
