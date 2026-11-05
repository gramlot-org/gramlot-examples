from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.main(padding="24px", max_width="1200px", margin="auto")
        self.button_styles(main_content)
        self.ordered_overflow(main_content)
        self.moving_input(main_content)
        self.retained_groups(main_content)
        self.vertical_overflow(main_content)

    def button_styles(self, main_content):
        main_content.h2("Three toolbar button styles")
        previews = main_content.div(display="grid", grid_template_columns="repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap="14px", margin_bottom="24px")
        for mode, title in (("beside", "Icon + label"), ("below", "Small label below"), ("tooltip", "Icon + tooltip")):
            card = previews.div(border="1px solid var(--gramlot-border)", border_radius="8px", padding="12px", min_width="0")
            card.h3(title, margin="0 0 12px")
            preview_frame = card.framePane(height="140px")
            preview_bar = preview_frame.top.menu(presentation="bar", labelPosition=mode, iconSize=28, id=f"style-{mode}")
            preview_bar.menuline("documenti:save", parameters=dict(id=42), disabled="^document.locked", id=f"style-{mode}-save")
            preview_bar.menuline("documenti:undo")
            preview_bar.menuline("documenti:toggleDetails", checked="^document.details")
            self.recipient(preview_frame, f"style_{mode}_editor")

    def ordered_overflow(self, main_content):
        main_content.h2("1. Make the toolbar narrower")
        self.width_controls(main_content)
        shell = main_content.div(width="^toolbar.width:={} + 'px'", max_width="100%", border="1px solid var(--gramlot-border)", border_radius="8px", overflow="hidden", id="responsive-frame")
        frame = shell.framePane(height="245px")
        frame.top.setAttr(dict(background="var(--gramlot-field-background)", padding="6px"))
        self.ordered_bar(frame)
        self.recipient(frame, "document_editor")
        main_content.div().strong("Query: ")
        main_content.p("^document.query", id="query-result", min_height="22px", margin="0 0 20px")

    def width_controls(self, main_content):
        controls = main_content.div(display="flex", align_items="center", gap="12px", flex_wrap="wrap", margin="12px 0")
        controls.input(type="range", min=280, max=1080, step=20, value="^toolbar.width", live=True, id="toolbar-width", lbl="Toolbar width", width="280px")
        controls.span("^toolbar.width", min_width="40px")
        controls.span("px")
        controls.input(type="checkbox", value="^document.locked", id="toolbar-lock", lbl="Disable Save")

    def ordered_bar(self, frame):
        bar = frame.top.menu(presentation="bar", id="responsive-toolbar")
        title = bar.menuline(group=True, id="title-group")
        title.span("Documents", font_weight="600", padding="0 8px")
        title.span("42", opacity="0.65")
        bar.spacer(size=12)
        editing = bar.menuline(group=True, id="editing-group")
        editing.menuline("documenti:save", labelPosition="tooltip", tooltip="Save document", parameters=dict(id=42), disabled="^document.locked", id="toolbar-save")
        editing.menuline("documenti:undo", labelPosition="tooltip", tooltip="Undo", id="toolbar-undo")
        bar.menuline("documenti:toggleDetails", checked="^document.details", id="toolbar-details")
        self.export_group(bar, "export-group")
        bar.spacer(flex=1)
        search = bar.menuline(group=True, id="search-group")
        search.span("⌕", font_size="22px", aria_hidden=True)
        search.input(value="^document.query", live=True, placeholder="Search documents", lbl="Search documents", width="190px", id="toolbar-search")

    def moving_input(self, main_content):
        main_content.h2("2. An input can move into the menu too")
        second_shell = main_content.div(width="^toolbar.width:={} + 'px'", max_width="100%", border="1px solid var(--gramlot-border)", border_radius="8px", padding="6px", box_sizing="border-box")
        second_frame = second_shell.framePane(height="150px")
        second = second_frame.top.menu(presentation="bar", id="input-toolbar")
        fixed = second.menuline(group=True)
        fixed.span("Recent documents", font_weight="600", padding="0 8px", white_space="nowrap")
        fixed.menuline("documenti:save", parameters=dict(id=42))
        second.spacer(flex=1)
        moving = second.menuline(group=True, id="moving-search-group")
        moving.input(value="^document.query", live=True, placeholder="Same query", lbl="Movable search", width="220px", id="moving-search")
        self.recipient(second_frame, "secondary_editor")

    def retained_groups(self, main_content):
        main_content.h2("3. Groups move together in declaration order")
        scroll_shell = main_content.div(width="400px", max_width="100%", border="1px solid var(--gramlot-border)", border_radius="8px", padding="6px", box_sizing="border-box")
        scroll_frame = scroll_shell.framePane(height="130px")
        retained = scroll_frame.top.menu(presentation="bar", id="scroll-toolbar")
        for index, caption in enumerate(("Inbox", "Archive", "Shared documents")):
            group = retained.menuline(group=True)
            group.menuline("documenti:save", caption=caption, parameters=dict(id=index), white_space="nowrap")
            group.menuline("documenti:undo", labelPosition="tooltip", tooltip="Undo")
        retained.menuline(group=True).input(value="^document.query", live=True, placeholder="Search", lbl="Retained search", width="190px")
        self.recipient(scroll_frame, "retained_editor")

    def vertical_overflow(self, main_content):
        main_content.h2("4. The same policy on a vertical toolbar")
        main_content.input(type="range", min=80, max=300, step=20, value="^toolbar.height", live=True, lbl="Vertical toolbar height", id="toolbar-height", width="260px")
        vertical_frame = main_content.framePane(height="330px", border="1px solid var(--gramlot-border)", border_radius="8px", margin_top="10px")
        vertical_frame.left.setAttr(dict(width="190px", padding="6px"))
        vertical = vertical_frame.left.menu(presentation="bar", orientation="vertical", height="^toolbar.height:={} + 'px'", width="178px", id="vertical-toolbar")
        vertical.menuline(group=True).strong("Folders", padding="8px")
        for index, caption in enumerate(("Inbox", "Archive", "Shared")):
            group = vertical.menuline(group=True, id=f"folder-group-{index}")
            group.menuline("documenti:save", caption=caption, parameters=dict(id=index))
            group.menuline("documenti:undo", caption="Undo")
        self.recipient(vertical_frame, "vertical_editor")

    def export_group(self, bar, identity):
        group = bar.menuline(group=True, id=identity)
        group.menuline("documenti:save", caption="Copy", icon="⧉", parameters=dict(id=42))
        export = group.menuline(caption="Export", icon="↓").menu()
        export.menuline("documenti:export", caption="PDF", parameters=dict(id=42, format="PDF"))
        export.menuline("-")
        export.menuline("documenti:export", caption="CSV", parameters=dict(id=42, format="CSV"))

    def recipient(self, frame, name):
        center = frame.center.contentPane(frameTarget=True, node_label=name,
            selfsubscribe_save="save", selfsubscribe_undo="undo", selfsubscribe_toggleDetails="toggleDetails", selfsubscribe_export="exportDocument", padding="16px")
        center.p("^document.result", role="status", margin="0 0 8px")
        center.p("Document details are visible", hidden="^document.details:=!{}", margin="0", opacity="0.7")
