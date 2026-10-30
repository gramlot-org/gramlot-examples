from gramlot import Page as BasePage


class Page(BasePage):
    title = "Classic menu bar and hierarchy"

    def main(self, root):
        main_content = root.main(padding="20px", max_width="900px", margin="auto")
        main_content.h1("Classic menu bar")
        main_content.p("Click File, Edit or View. The first level shows menu names; each opens a compact popup. In File → Export → Image, the next levels open sideways. These are nested menu and menuline declarations.")
        frame = main_content.framePane(height="260px", border="1px solid #64748b", border_radius="8px")
        bar = frame.top.menu(presentation="bar", iconSize=20, id="classic-menu-bar")
        self.file_menu(bar)
        self.edit_menu(bar)
        self.view_menu(bar)
        center = frame.center.contentPane(frameTarget=True, padding="16px")
        center.p("Last chosen command")
        center.h3("^navigation.selected", id="chosen-command")
        main_content.h2("What to observe")
        main_content.p("A selected toolbar button uses only its highlighted background. Popup menus retain a check mark for checked entries: View → Show details toggles it. Disabled commands remain visible but cannot run. The actions here only update the message above.")
        self.entry_style(main_content)

    def file_menu(self, bar):
        file = bar.menuline(caption="File", id="file-menu-trigger", overflowable=False).menu(id="file-popup")
        self.item(file, "New document", "📄")
        self.item(file, "Open…", "📂")
        file.menuline("-")
        self.item(file, "Save", "💾")
        export = file.menuline(caption="Export", icon="📤", id="export-trigger").menu(id="export-popup")
        self.item(export, "PDF", "📕")
        image = export.menuline(caption="Image", icon="🖼️", id="image-trigger").menu(id="image-popup")
        self.item(image, "PNG", "🖼️")
        self.item(image, "SVG", "🖼️")

    def edit_menu(self, bar):
        edit = bar.menuline(caption="Edit", overflowable=False).menu()
        self.item(edit, "Undo", "↩️", disabled=True)
        self.item(edit, "Copy", "📋")

    def view_menu(self, bar):
        view = bar.menuline(caption="View", overflowable=False).menu()
        view.menuline(caption="Show details", icon="🔎", checked="^navigation.details", action="toggleDetails")
        view.menuline("-")
        self.item(view, "Full screen", "🖥️", disabled=True)

    def entry_style(self, main_content):
        main_content.h2("Customize one entry")
        main_content.p("caption names the entry; class_, color, width and height style its outer button. icon and iconSize configure its graphic separately. SVG uses iconSrc instead. This blue example is 140 × 52 px with a 24 px emoji icon.")
        sample = main_content.menu(presentation="bar", iconSize=24)
        self.item(sample, "Save a copy", "💾", class_="save-copy", color="#93c5fd", width="140px", height="52px")
        main_content.a("Back to the vertical icon toolbar", href="/pages/05-menus/03_vertical_toolbar")

    def item(self, menu, caption, icon, **attributes):
        return menu.menuline(caption=caption, icon=icon, action="selectSection", parameters=dict(section=caption), **attributes)
