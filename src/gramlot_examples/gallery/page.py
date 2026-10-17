"""Gallery content on Gramlot's reusable index page."""
from gramlot import IndexPage
from gramlot_examples import build_gallery


class Page(IndexPage):
    title = "Gramlot examples"
    installable = True
    app_icon = "/assets/branding/app-icon.png"
    css = (*IndexPage.css, "/gallery/gallery.css")
    shell_id = "gallery"
    logoUrl = "/assets/branding/gramlot-logo-dark.svg"
    galleryScript = "/gallery/dist/gallery.js"
    catalogs = ()

    @property
    def logo_url(self):
        return self.logoUrl

    @property
    def gallery(self):
        return build_gallery(self.catalogs)

    @property
    def navigation(self):
        gallery = self.gallery
        return [{**family, "children": [
            {**item, "url": item["key"], "path": family["path"],
             "logic": gallery["routes"][item["key"]]["logic"]}
            for item in family["examples"]]} for family in gallery["families"]]

    def introduction(self, intro):
        intro.h2("Example gallery")
        intro.p("This gallery shows each example page beside the code that creates it. "
                "The Python and JavaScript integrations have the same examples.")
        intro.p("Choose an example from the list. Its tab stays open so you can return to it. "
                "Open Settings (⚙) in the footer and enable Keyboard navigation to move through tabs by keyboard. "
                "Use the top bar to show or hide Navigation and Code; drag their dividers to resize them. "
                "Choose Base, Compact, mimi or joanna independently of the color mode.")

    def group_panel(self, pane, group):
        pane.div((group["path"] / "README.md").read_text(), id=f"readme-{group['key']}")

    def footer(self, footer):
        footer.html_button("⚙", type="button", id="gallery-settings-toggle", class_="gallery-settings-toggle",
                      title="Settings", aria_label="Settings", popovertarget="gallery-settings")
        settings = footer.div(id="gallery-settings", popover="auto", aria_labelledby="gallery-settings-title")
        heading = settings.div(class_="gallery-settings-heading")
        heading.h2("Settings", id="gallery-settings-title")
        heading.html_button("×", type="button", aria_label="Close settings", popovertarget="gallery-settings",
                       popovertargetaction="hide")
        super().footer(settings)
        labels = settings.div(class_="index-theme")
        labels.html_label("Label position", for_="gallery-label-position")
        position = labels.select(id="gallery-label-position", value="example")
        position.option("As in the example", value="example", selected=True)
        for code in ("TL", "TC", "TR", "L", "R", "BL", "BC", "BR"):
            position.option(code, value=code)
        settings.p("Label position applies to input components in the previews. "
                   "Choose As in the example to restore the lesson's layout.")
        inspector = footer.html_button(type="button", id="gallery-inspector", class_="gallery-inspector",
                                  title="Open inspector", aria_label="Inspector",
                                  aria_pressed="false", disabled=True)
        inspector.span("🔍", aria_hidden="true")

    def header(self, shell):
        header = shell.header(class_="gallery-toolbar")
        header.html_button("☰ Navigation", type="button", id="index-navigation-toggle",
                      aria_controls="index-sidebar", aria_expanded="true")
        header.h1(self.title)
        header.html_button("Code ⟨/⟩", type="button", id="index-code-toggle",
                      aria_controls="index-code", aria_expanded="false", disabled=True)

    def behavior(self, shell):
        shell.div(class_="index-divider", id="index-code-divider", hidden=True,
                  title="Drag to resize code", role="separator", aria_orientation="vertical",
                  tabindex=0, aria_label="Resize code", aria_controls="index-code",
                  aria_valuemin=200, aria_valuemax=800, aria_valuenow=420)
        code = shell.aside(id="index-code", aria_label="Example source code", hidden=True)
        for family in self.navigation:
            for example in family["children"]:
                self.code_panel(code, example)
        shell.script(src=self.galleryScript)

    def panel(self, parent, example):
        examples = example["path"]
        key = example["key"]
        panel = parent.section(id=f"panel-{key}", class_="gallery-panel", role="tabpanel",
                               aria_labelledby=f"tab-{key}", hidden=True)
        explanation = panel.header(class_="gallery-explanation")
        explanation.div((examples / f"{example['folder']}.md").read_text(),
                        id=f"readme-{key}")
        preview = panel.div(class_="gallery-preview", id=f"preview-{key}")
        modes = preview.div(class_="gallery-preview-modes", role="group", aria_label="Preview mode")
        for mode, caption in (("normal", "Normale"), ("mobile", "Mobile")):
            modes.html_button(caption, type="button", id=f"preview-{mode}-{key}",
                         aria_pressed="true" if mode == "normal" else "false")
        stage = preview.div(class_="gallery-preview-stage", id=f"preview-stage-{key}")
        stage.iframe(title=f"{example['title']} preview", name=f"example-{key}",
                       id=f"frame-{key}")

    def code_panel(self, parent, example):
        key = example["key"]
        source_path = example["path"] / f"{example['folder']}.py"
        logic_path = example["logic"]
        codepane = parent.div(class_="gallery-codepane", id=f"codepane-{key}", hidden=True)
        tabs = codepane.div(class_="gallery-source-tabs", role="tablist", aria_label="Source files")
        tabs.html_button("Python", title=source_path.name, type="button", role="tab",
                    id=f"code-tab-{key}", aria_controls=f"code-panel-{key}",
                    aria_selected="true", tabindex=0)
        if logic_path is not None:
            tabs.html_button("logic.js", title=f"Logic from {logic_path.name}", type="button", role="tab", hidden=True,
                        id=f"logic-tab-{key}", aria_controls=f"logic-panel-{key}",
                        aria_selected="false", tabindex=-1)
        codepane.pre(id=f"code-panel-{key}", role="tabpanel", aria_labelledby=f"code-tab-{key}",
                     tabindex=0).code(source_path.read_text(), class_="language-python", id=f"code-{key}")
        # The source viewer shows only the final Logic class of the shared example module.
        if logic_path is not None:
            codepane.pre(id=f"logic-panel-{key}", role="tabpanel", aria_labelledby=f"logic-tab-{key}",
                         tabindex=0, hidden=True).code(logic_path.read_text(),
                                                      class_="language-javascript", id=f"logic-{key}")
