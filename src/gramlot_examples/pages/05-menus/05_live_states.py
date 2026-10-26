from gramlot import Page as BasePage
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot_examples.collections.menu_trial import mygramlot


class Page(BasePage):
    title = "Reactive menu states"
    gramlots = [inputs, layout, mygramlot]

    def main(self, root):
        main_content = root.main(padding="20px")
        main_content.h1("One state, two presentations")
        main_content.p("Use the checkboxes to change both menus. Open Document for the popup, or use the permanent row. Details toggles the shared checkmark and paragraph; disabled Save cannot run.")
        controls = main_content.div(display="flex", gap="20px", margin_bottom="16px")
        controls.checkbox(value="^document.locked", lbl="Disable Save")
        controls.checkbox(value="^document.hidden", lbl="Hide Export")
        controls.checkbox(value="^document.details", lbl="Show details")
        frame = main_content.framePane(height="360px")
        self.commands(frame.top.menu(presentation="bar").menuline(caption="Document", id="states-actions").menu())
        self.commands(frame.top.menu(presentation="bar", id="states-toolbar"))
        center = frame.center.contentPane(frameTarget=True, node_label="document_editor", padding="16px",
            selfsubscribe_save="save", selfsubscribe_toggleDetails="toggleDetails", selfsubscribe_export="exportDocument")
        center.h2("The application owns the state")
        center.p("Details are visible", hidden="^document.details:=!{}", id="states-details")
        center.p("^document.result", role="status")

    def commands(self, menu):
        menu.menuline("documenti:save", disabled="^document.locked", parameters=dict(id="^document.id"))
        menu.menuline("documenti:toggleDetails", checked="^document.details")
        menu.menuline("documenti:export", hidden="^document.hidden", parameters=dict(id=42, format="PDF"))
