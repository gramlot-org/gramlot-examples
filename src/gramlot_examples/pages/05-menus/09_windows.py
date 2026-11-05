from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.main(padding="20px", max_width="900px", margin="auto")
        choices = main_content.div(class_="grid")
        for title, caption, action, key in (
            ("Default dialog", "Open basic dialog", "openBasic", "open-basic"),
            ("Movable dialog", "Open movable dialog", "openModal", "open-modal"),
            ("Floating window", "Open floating window", "openFloating", "open-floating"),
        ):
            block = choices.section(class_="card stack")
            block.h2(title)
            block.button(caption, action=action, id=key)
        main_content.input(value="^windows.background", live=True, id="background-field", width="100%", margin="12px 0", lbl="Background field")
        main_content.p("^windows.notice", id="window-notice")
        self.contents(root.dialog(title="Basic modal dialog", open="^windows.basic", width="440px", height="310px", id="basic-window"), "basic")
        self.contents(root.dialog(title="Movable modal dialog", open="^windows.modal", collapsed="^windows.collapsed", movable=True, resizable=True, collapsible=True, maximizable=True, maximized="^windows.modal_maximized", beforeClose="beforeClose", width="440px", height="360px", id="modal-window"), "modal")
        self.contents(root.floatingPane(title="Floating tools", open="^windows.floating", maximizable=True, maximized="^windows.floating_maximized", beforeClose="beforeClose", width="360px", height="340px", id="floating-window"), "floating")

    def contents(self, window, kind):
        frame = window.frame
        bar = frame.top.menu(presentation="bar", iconSize=22, padding="4px")
        bar.menuline("documenti:save", parameters=dict(window=kind))
        bar.menuline(caption="Actions").menu().menuline("documenti:save", parameters=dict(window=kind))
        bar.spacer(flex=1)
        bar.menuline(group=True).span("Frame top", font_size="12px")
        content = frame.center.contentPane(frameTarget=True, selfsubscribe_save="save", padding="12px", overflow="auto")
        content.input(value="^windows.draft", live=True, width="100%", lbl="Window draft")
        if kind != "basic":
            row = content.div(margin="12px 0")
            row.input(type="checkbox", value="^windows.locked", id=kind+"-locked")
            row.html_label("Prevent closing", for_=kind+"-locked")
        content.p("^windows.notice")
        footer = frame.bottom.menu(presentation="bar", padding="4px")
        footer.menuline(group=True).span("Frame bottom", font_size="12px")
        footer.spacer(flex=1)
        footer.menuline(caption="Close", action="closeWindow")
