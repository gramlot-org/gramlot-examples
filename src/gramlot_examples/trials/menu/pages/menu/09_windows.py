from gramlot import Page as BasePage
from gramlot.collections.layout import mygramlot as layout
from gramlot_examples.collections.menu_trial import mygramlot


class Page(BasePage):
    title = "FramePane, dialog and floating windows"
    gramlots = [layout, mygramlot]
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(padding="20px", max_width="900px", margin="auto")
        pane.h1("FramePane, dialog and floating")
        pane.p("All three windows contain a real framePane: a top toolbar, central editable content and a bottom action bar. The title bar belongs to the window and stays separate from the frame's toolbar.")
        pane.dataSetter("windows", dict(basic=False, modal=False, floating=False, collapsed=False, modal_maximized=False, floating_maximized=False, locked=False, draft="Edit me; close and reopen to check retention.", notice="No action yet", background="The page remains usable behind a floating window."))
        pane.h2("1. Dialog defaults")
        pane.p("Open the basic dialog: the background is blocked. Its title has Close only; movement, resize and collapse are disabled by default. Escape closes it and focus returns to the opener.")
        pane.button("Open basic dialog", action="openBasic", id="open-basic")
        pane.h2("2. Movable modal dialog")
        pane.p("This dialog enables move, resize, collapse and maximize. First move or resize it; then click □ to fill the viewport and ❐ to recover its previous position and size. Move and resize pause while maximized. Collapse keeps the page blocked and remembers maximize; ＋ expands it again. The internal checkbox can veto X, Escape and the footer Close action.")
        pane.button("Open movable dialog", action="openModal", id="open-modal")
        pane.h2("3. Floating window")
        pane.p("The same chrome is nonmodal here. Move, resize and collapse are enabled by default. Maximize is explicitly enabled here too: □ fills the viewport and ❐ restores its geometry. Collapse a maximized floating window and edit the field below: the page remains usable. Expand with ＋ to return to maximized size. Title and resize handle also accept arrow keys (10 px; Shift gives 1 px).")
        pane.button("Open floating window", action="openFloating", id="open-floating")
        pane.input(value="^windows.background", live=True, id="background-field", width="100%", margin="12px 0", aria_label="Background field")
        pane.p("^windows.notice", id="window-notice")
        pane.p("The draft and window geometry survive close/reopen during this page session. No document is saved to a server. Maximize retains the draft and normal geometry; reload persistence is outside this trial.")
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
        content.p("Frame center: this draft is shared Data.")
        content.input(value="^windows.draft", live=True, width="100%", aria_label="Window draft")
        if kind != "basic":
            row = content.div(margin="12px 0")
            row.input(type="checkbox", value="^windows.locked", id=kind+"-locked")
            row.html_label("Prevent closing", for_=kind+"-locked")
        content.p("^windows.notice")
        footer = frame.bottom.menu(presentation="bar", padding="4px")
        footer.menuline(group=True).span("Frame bottom", font_size="12px")
        footer.spacer(flex=1)
        footer.menuline(caption="Close", action="closeWindow")
