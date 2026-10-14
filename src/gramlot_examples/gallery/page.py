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
                "Enable Keyboard navigation in the footer to move through tabs by keyboard. "
                "Drag the dividers to resize the sidebar or the preview and code. "
                "Choose Base or Compact independently of the color mode.")

    def group_panel(self, pane, group):
        pane.div((group["path"] / "README.md").read_text(), id=f"readme-{group['key']}")

    def footer(self, footer):
        super().footer(footer)
        inspector = footer.button(type="button", id="gallery-inspector", class_="gallery-inspector",
                                  title="Inspect the gallery or selected example", aria_label="Inspector",
                                  aria_pressed="false", disabled=True)
        icon = inspector.svg(viewBox="0 0 24 24", width="18", height="18", aria_hidden="true")
        icon.rect(x="3", y="3", width="18", height="18", rx="2", fill="none", stroke="currentColor", stroke_width="1.5")
        icon.path(d="M9 3v18M12 8h6M12 12h6M12 16h4", fill="none", stroke="currentColor", stroke_width="1.5")
        inspector.span("Inspector")

    def behavior(self, shell):
        shell.script(src=self.galleryScript)

    def panel(self, parent, example):
        examples = example["path"]
        logic_path = example["logic"]
        key = example["key"]
        panel = parent.section(id=f"panel-{key}", class_="gallery-panel", role="tabpanel",
                               aria_labelledby=f"tab-{key}", hidden=True)
        explanation = panel.header(class_="gallery-explanation")
        explanation.div((examples / f"{example['folder']}.md").read_text(),
                        id=f"readme-{key}")
        source_path = examples / f"{example['folder']}.py"

        split = panel.div(class_="gallery-split", id=f"split-{key}",
                          style="--split-position: 65%")
        preview = split.div(class_="gallery-preview", id=f"preview-{key}")
        preview.iframe(title=f"{example['title']} preview", name=f"example-{key}",
                       id=f"frame-{key}")
        split.div(class_="gallery-divider", id=f"divider-{key}",
                  role="separator", aria_orientation="vertical", tabindex=0,
                  aria_label="Resize preview and code", aria_valuemin=20,
                  aria_valuemax=80, aria_valuenow=65)
        codepane = split.div(class_="gallery-codepane", id=f"codepane-{key}")
        tabs = codepane.div(class_="gallery-source-tabs", role="tablist", aria_label="Source files")
        tabs.button("Python", title=source_path.name, type="button", role="tab",
                    id=f"code-tab-{key}", aria_controls=f"code-panel-{key}",
                    aria_selected="true", tabindex=0)
        if logic_path is not None:
            tabs.button("logic.js", title=f"Logic from {logic_path.name}", type="button", role="tab", hidden=True,
                        id=f"logic-tab-{key}", aria_controls=f"logic-panel-{key}",
                        aria_selected="false", tabindex=-1)
        codepane.pre(id=f"code-panel-{key}", role="tabpanel", aria_labelledby=f"code-tab-{key}",
                     tabindex=0).code(source_path.read_text(), class_="language-python", id=f"code-{key}")
        # The source viewer shows only the final Logic class of the shared example module.
        if logic_path is not None:
            codepane.pre(id=f"logic-panel-{key}", role="tabpanel", aria_labelledby=f"logic-tab-{key}",
                         tabindex=0, hidden=True).code(logic_path.read_text(),
                                                      class_="language-javascript", id=f"logic-{key}")
