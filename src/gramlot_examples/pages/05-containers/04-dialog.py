from urllib.parse import quote
from gramlot import Page as BasePage


STAGES = {'idea': 'M12 3a6 6 0 0 0-3 11v3h6v-3a6 6 0 0 0-3-11ZM9 21h6', 'review': 'M4 4h16v16H4ZM8 9h8M8 13h6', 'ready': 'm5 12 4 4L19 6'}


class Page(BasePage):
    title = 'Dialog: modal editing'
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        content = root.main(datapath="workspace", class_="example-content stack", max_width="48rem", padding="12px")
        content.h1('Dialog: modal editing')
        content.p('Open the dialog and try the background counter: it is blocked until you close the dialog. Edit the title, close and reopen: the draft is retained.')
        actions = content.div(display="flex", flex_wrap="wrap", gap="8px")
        actions.button("Open dialog", action="this.SET('.open', true)")
        actions.button("Background counter", action="this.SET('.clicks', (this.GET('.clicks') || 0) + 1)")
        card = content.section(class_="card stack")
        card.h2("The page behind the window")
        card.p("The left toolbar selects a stage; the top toolbar edits the title; Done closes the window. All three bars belong to the same framePane.")
        card.div("^.clicks", mask="Background clicks: {}", role="status")
        card.div("^.title", mask="Shared title: {}")
        window = content.dialog(title="Edit document", open="^.open", width="440px", height="300px",
                                  movable=True, resizable=True, collapsible=True, maximizable=True)
        window.frame.left.set_attr(dict(width="44px", background="var(--gramlot-surface-subtle)",
                                        border_right="1px solid var(--gramlot-border)"))
        stages = window.frame.left.menu(presentation="bar", orientation="vertical", labelPosition="tooltip", iconSize=20)
        for stage, drawing in STAGES.items():
            icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7c899c" stroke-width="1.8"><path d="' + drawing + '"/></svg>'
            stages.menuline(caption=stage.title(), tooltip=stage.title(), iconSrc="data:image/svg+xml," + quote(icon, safe=""),
                            checked=f"^.stage:={{}} === '{stage}'", action=f"this.SET('.stage', '{stage}')")
        toolbar = window.frame.top.menu(presentation="bar", padding="3px 6px",
                                       background="var(--gramlot-surface-subtle)")
        toolbar.menuline(caption="Uppercase title", action="this.SET('.title', this.GET('.title').toUpperCase())")
        fields = window.frame.center.formlet(padding="12px", columns=1, lbl_position="TL", box_c_width="100%")
        fields.textbox(lbl="Title", value="^.title", live=True)
        fields.filteringSelect(lbl="Stage", value="^.stage", values="idea:Idea,review:Review,ready:Ready")
        footer = window.frame.bottom.menu(presentation="bar", padding="3px 6px",
                                         background="var(--gramlot-surface-subtle)")
        footer.spacer(flex=1)
        footer.menuline(caption="Done", action="this.SET('.open', false)")
