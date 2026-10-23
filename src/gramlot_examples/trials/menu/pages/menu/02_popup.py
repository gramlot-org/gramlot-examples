from gramlot import Page as BasePage
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot_examples.collections.menu_trial import mygramlot


class Page(BasePage):
    title = "One hierarchical menu, four presentations"
    gramlots = [inputs, layout, mygramlot]
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(padding="20px")
        pane.h1("One hierarchical menu, four presentations")
        pane.p("Each example below uses the same menu definition: Save, Details, Undo and Export → PDF / Other formats → CSV. Icons, separators and state belong to the menu in every presentation.")
        pane.dataSetter("document", dict(id=42, locked=True, details=True, result="Choose a menu command"))
        controls = pane.div(display="flex", gap="24px", flex_wrap="wrap", margin_bottom="14px")
        controls.checkbox(value="^document.locked", label="Disable Save in every menu", lbl="Shared disabled state")
        controls.checkbox(value="^document.details", label="Details checked in every menu", lbl="Shared checked state")
        cards = pane.div(display="grid", grid_template_columns="repeat(auto-fit, minmax(min(100%, 33rem), 1fr))", gap="18px")
        self.example(cards, "popup", "1. Popup menu",
            "Click inside the document area to open the menu. Export opens to the side; Other formats adds a second submenu. Choosing a command closes the popup.")
        self.example(cards, "horizontal", "2. Horizontal menu bar",
            "The first level stays visible in a row. Click Export to open its submenu. Uncheck Disable Save above to enable Save here and in the other examples.")
        self.example(cards, "vertical", "3. Vertical menu bar",
            "The same first level stays visible in a column. Export opens beside the bar. Details has a live checkmark; Undo is disabled because this example has no undo history.")
        self.example(cards, "context", "4. Context menu",
            "Right-click inside the document area, or focus it and press Shift+F10. The same menu opens at the pointer. Escape closes it; selecting a command updates the result.")
        pane.h2("Opening with modifiers")
        pane.p("In this extra area only Shift+click opens the same menu. Ordinary click and Shift+Ctrl+click do not match. modifiers='*' means no modifier keys; modifiers='Shift' means exactly Shift.")
        frame = pane.framePane(height="145px", border="1px solid var(--gramlot-border-control)")
        area = self.document(frame, "modified")
        area.p("Shift+click here", font_weight="bold")
        self.document_menu(area.menu(modifiers="Shift"))

    def example(self, parent, mode, title, explanation):
        card = parent.div(padding="14px", border="1px solid var(--gramlot-border-control)", border_radius="8px")
        card.h2(title, margin_top="0", font_size="1.15rem")
        card.p(explanation, min_height="4.5em")
        frame = card.framePane(height="230px", background="var(--gramlot-field-background)")
        area = self.document(frame, mode)
        if mode == "horizontal":
            menu = frame.top.menu(presentation="bar", orientation="horizontal", padding="6px", id="horizontal-menu")
        elif mode == "vertical":
            frame.left.set_attr(dict(width="170px"))
            menu = frame.left.menu(presentation="bar", orientation="vertical", padding="6px", width="100%", id="vertical-menu")
        elif mode == "popup":
            area.p("Click anywhere in this document", font_weight="bold")
            menu = area.menu(modifiers="*", id="popup-menu")
        else:
            area.p("Right-click this document", font_weight="bold")
            menu = area.menu(id="context-menu")
        self.document_menu(menu)

    def document(self, frame, name):
        area = frame.center.contentPane(frameTarget=True, node_label=name + "_document",
            id=name + "-document", tabindex=0, padding="14px",
            selfsubscribe_save="save", selfsubscribe_toggleDetails="toggleDetails",
            selfsubscribe_export="exportDocument")
        area.h3("Document 42", margin_top="0")
        area.p("Details are visible", hidden="^document.details:=!{}")
        area.p("^document.result", role="status", overflow_wrap="anywhere")
        return area

    def document_menu(self, menu):
        menu.menuline("documenti:save", disabled="^document.locked", parameters=dict(id="^document.id"))
        menu.menuline("documenti:toggleDetails", checked="^document.details")
        menu.menuline("documenti:undo", disabled=True)
        menu.menuline("-")
        export = menu.menuline(caption="Export", icon="↓").menu()
        export.menuline("documenti:export", caption="PDF", parameters=dict(id="^document.id", format="PDF"))
        export.menuline("-")
        other = export.menuline(caption="Other formats", icon="▤").menu()
        other.menuline("documenti:export", caption="CSV", parameters=dict(id="^document.id", format="CSV"))
