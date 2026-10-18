"""Gallery content on Gramlot's reusable index page."""
from gramlot import IndexPage
from gramlot_examples import build_gallery
from gramlot_examples.gallery.guided_demo import guided_demo


class Page(IndexPage):
    title = "Gramlot examples"
    installable = True
    app_icon = "/assets/branding/app-icon.png"
    css = (*IndexPage.css, "/gallery/gallery.css")
    shell_id = "gallery"
    logoUrl = "/assets/branding/gramlot-logo-dark.svg"
    galleryScript = "/gallery/dist/gallery.js"
    catalogs = ()
    serverless_download_url = None

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

    def main(self, root):
        families = self.navigation
        shell = root.div(class_="index-shell gallery-containers", id=self.shell_id)
        self.header(shell)
        regions = shell.borderContainer(id="gallery-regions", node_id="galleryRegions",
                                        data_index_regions=True, height="100%", min_height=0)
        sidebar = regions.contentPane(region="left", width="240px", minSize=160, maxSize=420,
                                      splitter=True, drawer=True, drawer_icon="☰", drawer_label="Navigation",
                                      drawer_minimize=True, node_id="galleryNavigation",
                                      class_="index-sidebar", id="index-sidebar")
        brand = sidebar.header()
        brand.img(src=self.logo_url, alt=self.title, class_="index-logo")
        navigation = sidebar.nav(aria_label="Pages").ul(class_="index-list")
        for family in families:
            category = navigation.li().details(open=family is families[0])
            category.summary(tabindex=-1).a(family["title"], id=f"open-{family['key']}",
                href=f"#panel-{family['key']}", class_="index-family", tabindex=-1)
            items = category.ul(class_="index-list")
            for example in family["children"]:
                items.li().a(example["title"], id=f"open-{example['key']}", href=example["url"], tabindex=-1)
        center = regions.contentPane(region="center", id="gallery-center", overflow="hidden")
        shell.dataSetter("galleryIndex.active", "intro")
        panels = center.tabContainer(id="index-pages", class_="index-main", height="100%",
                                     selectedPage="^galleryIndex.active", tabMode="tabs")
        self.introduction(panels.contentPane(id="panel-intro", title="Introduction", pageName="intro",
                                             class_="index-intro"))
        for family in families:
            self.group_panel(panels.contentPane(id=f"panel-{family['key']}", title=family["title"],
                pageName=family["key"], class_="index-category", hidden=True), family)
            for example in family["children"]:
                self.panel(panels, example)
        code = regions.contentPane(region="right", width="420px", minSize=220, maxSize=900,
                                   splitter=True, drawer=True, drawer_icon="⌘", drawer_label="Code",
                                   drawer_minimize=True, node_id="galleryCode", id="index-code",
                                   aria_label="Example source code", hidden=True)
        for family in families:
            for example in family["children"]:
                self.code_panel(code, example)
        self.footer(shell.footer(class_="index-footer"))
        self.behavior(shell)

    def introduction(self, intro):
        intro.h2("Example gallery")
        intro.p("This gallery shows each example page beside the code that creates it. "
                "The Python and JavaScript integrations have the same examples.")
        intro.p("Choose an example from the list. Its tab stays open so you can return to it. "
                "Use the arrow keys on a focused tab to switch pages. In Settings (⚙), enable Keyboard navigation to include the navigation links in the Tab sequence. "
                "Use the top bar to show or hide Navigation and Code; drag their splitters to resize them. The drawer handles keep both panels within reach. Each lesson has Example and Explanation tabs; switching them preserves the running example. "
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
        header.html_button("☰", type="button", id="gallery-mobile-menu", class_="gallery-mobile-only",
                           aria_label="Navigation", aria_controls="index-sidebar", aria_expanded="false")
        header.h1(self.title)
        header.html_button("Code ⟨/⟩", type="button", id="index-code-toggle",
                      aria_controls="index-code", aria_expanded="false", disabled=True)

        views = header.div(class_="gallery-mobile-views gallery-mobile-only", role="group", aria_label="Gallery view")
        for view, caption in (("example", "Example"), ("code", "Code"), ("inspector", "Inspector")):
            views.html_button(caption, type="button", id=f"gallery-view-{view}",
                              aria_pressed="true" if view == "example" else "false")

    def behavior(self, shell):
        shell.html_button("", type="button", id="gallery-mobile-backdrop", hidden=True,
                          aria_label="Close navigation", tabindex=-1)
        shell.section(id="gallery-inspector-panel", aria_label="Inspector")
        shell.script(src=self.galleryScript)

    def panel(self, parent, example):
        examples = example["path"]
        key = example["key"]
        panel = parent.contentPane(id=f"panel-{key}", title=example["title"], pageName=key,
                                   class_="gallery-panel", hidden=True)
        panel = panel.div(class_="gallery-panel-layout")
        header = panel.header(class_="gallery-explanation")
        header.h2(example["title"])
        header.p("In this example: " + example.get("description", ""))
        preview = panel.tabContainer(class_="gallery-preview", id=f"preview-{key}",
                                     tabMode="underline", height="100%", min_height=0,
                                     **({"node_id": "galleryGuidePreview"} if key == "l04" else {}))
        stage = preview.contentPane(title="Example", pageName="example",
                                    class_="gallery-preview-stage", id=f"preview-stage-{key}")
        if key == "l04":
            layout = stage.borderContainer(height="100%", id="gallery-guide-layout")
            stage = layout.contentPane(region="center", overflow="hidden")
            guided_demo(layout)
        stage.iframe(title=f"{example['title']} preview", name=f"example-{key}", id=f"frame-{key}")
        explanation = preview.contentPane(title="Explanation", pageName="explanation",
                                          class_="gallery-lesson", overflow="auto")
        explanation.div((examples / f"{example['folder']}.md").read_text(), id=f"readme-{key}")

    def code_panel(self, parent, example):
        key = example["key"]
        source_path = example["path"] / f"{example['folder']}.py"
        logic_path = example["logic"]
        codepane = parent.tabContainer(class_="gallery-codepane gallery-source-tabs", id=f"codepane-{key}", hidden=True,
                                       height="100%", tabMode="underline")
        codepane.contentPane(title="Python", pageName="python", id=f"code-panel-{key}").pre(
            tabindex=0).code(source_path.read_text(), class_="language-python", id=f"code-{key}")
        if logic_path is not None:
            codepane.contentPane(title="logic.js", pageName="logic", id=f"logic-panel-{key}").pre(
                tabindex=0).code(logic_path.read_text(), class_="language-javascript", id=f"logic-{key}")
