from urllib.parse import quote

from gramlot import Page as BasePage


# Example-owned vector images, rendered by the existing iconSrc contract.
def svg_icon(drawing):
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" '
           'fill="none" stroke="#7c899c" stroke-width="1.8" '
           'stroke-linecap="round" stroke-linejoin="round">' + drawing + '</svg>')
    return "data:image/svg+xml," + quote(svg, safe="")


ICONS = {
    "save": svg_icon('<path d="M5 3h12l4 4v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 3v6h9V3M7 21v-8h10v8M13 5v2"/>'),
    "reset": svg_icon('<path d="M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6"/>'),
    "cancel": svg_icon('<circle cx="12" cy="12" r="9"/><path d="m8.5 8.5 7 7m0-7-7 7"/>'),
    "details": svg_icon('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m4-11h4m-4 6h4"/>'),
}


class Page(BasePage):
    title = "Complete floating editor"
    css = ("/themes/gramlot-compact/theme.css",)

    def main(self, root):
        main_content = root.main(padding="20px", max_width="900px", margin="auto")
        main_content.h1("A complete floating editor")
        main_content.p("Edit a document inside a nonmodal floating window containing a real framePane. The left icon bar and top toolbar control the same draft; the bottom bar keeps Cancel and Save at the right. Only Save updates the saved document shown below.")
        self.instructions(main_content)
        main_content.button("Open floating editor", action="openEditor", id="open-editor")
        main_content.html_label("Background note", for_="background-note", display="block", margin_top="var(--gramlot-space-3)")
        main_content.input(value="^editor.background", live=True, id="background-note", width="100%")
        main_content.p("^editor.background", role="status", id="background-result")
        main_content.p("In Gallery Settings, combine Theme, Colors and Color mode. The same settings apply to the dialog example; changing them preserves the open editor and its draft.")
        self.saved_document(main_content)
        window = root.floatingPane(title="Floating document editor", open="^editor.open", beforeClose="discardOnClose",
                             movable=True, resizable=True, collapsible=True, collapsed="^editor.collapsed",
                             maximizable=True, maximized="^editor.maximized", width="620px", height="380px",
                             id="editor-window")
        frame = window.frame
        self.side_tools(frame)
        self.top_toolbar(frame)
        self.draft_fields(frame)
        self.footer(frame)

    def instructions(self, main_content):
        steps = main_content.ol()
        steps.li("Open the editor and change the title or notes. Save copies the draft to the saved document and closes the floating window. This is local page Data, not a server or disk save.")
        steps.li("Open it again, make another change and choose Cancel: the saved document must stay unchanged. X and Escape also discard the current draft.")
        steps.li("Reset draft restores the last saved values without closing. Details toggles an extra field and its menu checkmark. Document opens a hierarchical menu using the same commands.")
        steps.li("Drag, resize, maximize and collapse the floating window. Its toolbars stay in their frame regions; the center scrolls when space is limited. The page remains usable: move or collapse the window and edit the Background note below. Compare with Complete dialog editor, which blocks its page.")

    def saved_document(self, main_content):
        summary = main_content.section(margin_top="20px", padding="16px", border="1px solid var(--gramlot-border-control)", border_radius="8px")
        summary.h2("Saved document")
        summary.h3("^editor.saved.title", id="saved-title")
        summary.p("^editor.saved.author", id="saved-author")
        summary.p("^editor.saved.notes", id="saved-notes", white_space="pre-wrap")
        main_content.p("^editor.notice", role="status", id="editor-result")

    def side_tools(self, frame):
        frame.left.set_attr(dict(width="44px", background="var(--gramlot-surface-subtle)", border_right="1px solid var(--gramlot-border)"))
        tools = frame.left.menu(presentation="bar", orientation="vertical", labelPosition="tooltip", iconSize=20)
        tools.menuline("documenti:toggleDetails", caption="Details", iconSrc=ICONS["details"], checked="^editor.details")
        tools.menuline("documenti:undo", caption="Reset draft", iconSrc=ICONS["reset"], parameters=dict(close=False))
        tools.spacer(flex=1)
        tools.menuline("documenti:save", iconSrc=ICONS["save"])

    def top_toolbar(self, frame):
        toolbar = frame.top.menu(presentation="bar", padding="2px 6px", iconSize=18, background="var(--gramlot-surface-subtle)", border_bottom="1px solid var(--gramlot-border-control)", id="editor-toolbar")
        self.draft_commands(toolbar)
        toolbar.spacer(flex=1)
        commands = toolbar.menuline(caption="Document").menu()
        self.draft_commands(commands)

    def draft_commands(self, menu):
        menu.menuline("documenti:undo", caption="Reset draft", iconSrc=ICONS["reset"], parameters=dict(close=False))
        menu.menuline("documenti:toggleDetails", caption="Details", iconSrc=ICONS["details"], checked="^editor.details")

    def draft_fields(self, frame):
        center = frame.center.contentPane(frameTarget=True, node_label="document_editor", padding="var(--gramlot-space-4)", overflow="auto",
                                          selfsubscribe_save="save", selfsubscribe_undo="undo",
                                          selfsubscribe_toggleDetails="toggleDetails")
        center.p("Draft — changes are committed only by Save.", margin_top="0")
        center.html_label("Title (required)", for_="editor-title", display="block", margin_bottom="4px")
        center.input(value="^editor.draft.title", live=True, id="editor-title", width="100%", box_sizing="border-box")
        center.html_label("Notes", for_="editor-notes", display="block", margin_top="var(--gramlot-space-3)", margin_bottom="4px")
        center.textarea(value="^editor.draft.notes", live=True, rows=4, id="editor-notes", width="100%", box_sizing="border-box")
        details = center.div(hidden="^editor.details:=!{}", margin_top="var(--gramlot-space-3)")
        details.html_label("Author", for_="editor-author", display="block", margin_bottom="4px")
        details.input(value="^editor.draft.author", live=True, id="editor-author", width="100%", box_sizing="border-box")
        center.p("^editor.error", role="alert", id="editor-error", color="var(--gramlot-error, #b22)")

    def footer(self, frame):
        footer = frame.bottom.menu(presentation="bar", padding="2px 8px", iconSize=18, background="var(--gramlot-surface-subtle)", border_top="1px solid var(--gramlot-border-control)", id="editor-footer")
        footer.spacer(flex=1)
        actions = footer.menuline(group=True, overflowable=False)
        actions.menuline("documenti:undo", caption="Cancel", iconSrc=ICONS["cancel"], parameters=dict(close=True), id="editor-cancel")
        actions.menuline("documenti:save", caption="Save", iconSrc=ICONS["save"], id="editor-save")
