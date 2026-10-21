"""Gallery content on Gramlot's reusable index page."""
from gramlot import IndexPage, source, endpoint
from genro_bag import Bag
from gramlot_examples import build_gallery, navigation_directory
from gramlot_examples.gallery.guided_demo import guided_demo


class Page(IndexPage):
    title = "Gramlot examples"
    installable = True
    app_icon = "/assets/branding/app-icon.png"
    css = (*IndexPage.css, "/themes/gramlot-index/theme.css", "/gallery/gallery.css")
    shell_id = "gallery"
    logoUrl = "/assets/branding/gramlot-logo-dark.svg"
    datapath = "galleryIndex"
    catalogs = ()
    serverless_download_url = None

    @property
    def logo_url(self):
        return self.logoUrl

    @property
    def gallery(self):
        return build_gallery(self.catalogs)

    @property
    def groups(self):
        gallery = self.gallery
        return [{**family, "children": [
            {**item, "url": gallery["routes"][item["key"]]["url"], "path": family["path"],
             "logic": gallery["routes"][item["key"]]["logic"]}
            for item in family["examples"]]} for family in gallery["families"]]

    @property
    def navigation(self):
        return navigation_directory(catalogs=self.catalogs)

    def left(self, pane):
        pane.set_attr({"id": "index-sidebar", "class": "index-sidebar", "nodeId": "galleryNavigation"})
        pane.header().img(src=self.logo_url, alt=self.title, class_="index-logo")
        super().left(pane)
        pane.set_attr({"drawer_minimize": True})
        pane.value.get_node("tree").set_attr({"id": "gallery-navigation-tree", "class": "gallery-navigation-tree", "autoCollapse": True, "hideValues": True})

    def center(self, pane):
        pane.set_attr({"id": "gallery-center", "overflow": "hidden"})
        super().center(pane)
        pane.value.get_node("tabs").set_attr({"id": "index-pages", "class": "index-main", "hidden": True})
        pane.div(id="gallery-introduction", height="100%").iframe(src="pages/00-index", title="Example gallery", width="100%", height="100%", border=0)

    def right(self, pane):
        pane.set_attr({"id": "index-code", "nodeId": "galleryCode", "width": "420px",
                       "minSize": 220, "maxSize": 900, "splitter": True,
                       "drawer": "close", "drawer_label": "Code", "drawer_minimize": True,
                       "aria_label": "Example source code", "hidden": True})
        pane.div(id="gallery-code-pages", height="100%")

    def bottom(self, pane):
        pane.set_attr({"id": "gallery-settings", "height": "180px", "drawer": "close",
                       "drawer_label": "Settings", "drawer_icon": "⚙", "drawer_minimize": True,
                       "class": "index-footer", "aria_label": "Settings"})
        self.footer(pane)

    def top(self, pane):
        pane.set_attr({"height": "42px"})
        self.header(pane)

    @endpoint
    def navigation_section(self, directory):
        return navigation_directory(directory, self.catalogs)

    def introduction(self, intro):
        intro.h2("Example gallery")
        intro.p("This gallery shows each example page beside the code that creates it. "
                "The Python and JavaScript integrations have the same examples.")
        intro.p("Expand a section in the tree and choose an example. Its tab stays open so you can return to it. "
                "Use the arrow keys on a focused tab to switch pages. The navigation tree supports the arrow keys and Enter. "
                "Use the Navigation and Code drawer labels to show or hide their panels; drag their splitters to resize them. The drawer handles keep both panels within reach. Each lesson has Example and Explanation tabs; switching them preserves the running example. "
                "Choose Base, Compact, mimi or joanna independently of the color mode.")

    def group_panel(self, pane, group):
        pane.div((group["path"] / "README.md").read_text(), id=f"readme-{group['key']}")

    def footer(self, footer):
        settings = footer.div(class_="gallery-settings-content")
        heading = settings.div(class_="gallery-settings-heading")
        heading.h2("Settings", id="gallery-settings-title")
        theme = settings.div(class_="index-theme")
        theme.html_label("Theme", for_="index-appearance")
        appearance = theme.select(id="index-appearance", value="compact")
        appearance.option("Base", value="base", selected=False)
        appearance.option("Compact", value="compact", selected=True)
        appearance.option("mimi", value="mimi")
        appearance.option("joanna", value="joanna")
        color = settings.div(class_="index-theme")
        color.html_label("Color mode", for_="index-theme")
        choices = color.select(id="index-theme", value="light")
        choices.option("Light", value="light", selected=True)
        choices.option("Dark", value="dark", selected=False)
        keyboard = settings.div(class_="index-keyboard")
        label = keyboard.html_label(for_="keyboard-navigation")
        label.input(type="checkbox", id="keyboard-navigation", checked=False)
        label.span("Keyboard navigation")

        if self.installable:
            app = settings.details(class_="index-install")
            app.summary("Install app")
            app.html_button("Install", type="button", id="index-install-button", hidden=True)
            app.p("", id="index-install-status", role="status")
            app.p("Chrome: use Install page as app in the browser menu. "
                  "Safari on macOS Sonoma or later: File > Add to Dock.")
            app.p("Use HTTPS or localhost. For a static export, serve the directory; "
                  "direct file opening is not installable. Keep the server running for hosted pages.")

        labels = settings.div(class_="index-theme")
        labels.html_label("Label position", for_="gallery-label-position")
        position = labels.select(id="gallery-label-position", value="example")
        position.option("As in the example", value="example", selected=True)
        for code in ("TL", "TC", "TR", "L", "R", "BL", "BC", "BR"):
            position.option(code, value=code)
        settings.p("Label position applies to input components in the previews. "
                   "Choose As in the example to restore the lesson's layout.")

    def header(self, shell):
        header = shell.header(class_="gallery-toolbar")
        header.h1(self.title)
        header.span("", id="gallery-load-status", role="status", aria_live="polite")
        inspector = header.html_button(type="button", id="gallery-inspector", class_="gallery-inspector",
                                  title="Open inspector", aria_label="Inspector",
                                  aria_pressed="false", disabled=True)
        inspector.span("🔍", aria_hidden="true")
        inspector.span("Inspector")

    def behavior(self, shell):
        shell.set_attr({"class": "frame-page index-shell gallery-containers"})
        shell.value.get_node("frame").set_attr({"id": "gallery-regions", "nodeId": "galleryRegions"})
        shell.section(id="gallery-inspector-panel", aria_label="Inspector")
        shell.dataController(func="galleryInitialize", _onBuilt=True)
        shell.dataController(func="galleryMount", _onStart=True)

    def gallery_item(self, key):
        for family in self.groups:
            if family["key"] == key:
                return family
            for example in family["children"]:
                if example["key"] == key:
                    return example
        raise ValueError(f"Unknown gallery entry: {key}")

    @source
    def lesson(self, root, key, view="example", **kwargs):
        item = self.gallery_item(key)
        if view == "code" and "children" not in item:
            self.code_panel(root, item)
        elif view == "description" and "children" not in item:
            root.div((item["path"] / f"{item['folder']}.md").read_text(), id=f"readme-{key}")
        elif view == "example":
            if "children" in item:
                self.group_panel(root, item)
            else:
                self.example_panel(root, item)
        else:
            raise ValueError(f"Unknown gallery view: {key}/{view}")

    def panel(self, pane, node):
        key = node.attr.get("key")
        if "markdown" in node.attr:
            pane.div(node.attr["markdown"], class_="gallery-directory-markdown", padding="24px")
        elif node.attr.get("category") or key is None:
            pane.iframe(src=node.attr["url"], title=node.attr.get("title", node.label),
                        width="100%", height="100%", border=0)
        else:
            self.example_panel(pane, self.gallery_item(key))

    def example_panel(self, parent, example):
        key = example["key"]
        panel = parent.div(class_="gallery-panel-layout")
        header = panel.header(class_="gallery-explanation")
        header.h2(example["title"])
        header.p("In this example: " + example.get("description", ""))
        preview = panel.tabContainer(class_="gallery-preview", id=f"preview-{key}",
                                     tabMode="underline", height="100%", min_height=0,
                                     **({"nodeId": "galleryGuidePreview"} if key == "l04" else {}))
        stage = preview.contentPane(title="Example", pageName="example",
                                    class_="gallery-preview-stage", id=f"preview-stage-{key}")
        if key == "l04":
            layout = stage.borderContainer(height="100%", id="gallery-guide-layout")
            stage = layout.contentPane(region="center", overflow="hidden")
            guided_demo(layout)
        stage.iframe(title=f"{example['title']} preview", name=f"example-{key}", id=f"frame-{key}")
        explanation = preview.contentPane(title="Explanation", pageName="explanation",
                                          class_="gallery-lesson", overflow="auto", id=f"description-{key}")
        explanation.p("Loading explanation…", role="status")

    def code_panel(self, parent, example):
        key = example["key"]
        source_path = example["path"] / f"{example['folder']}.py"
        logic_path = example["logic"]
        codepane = parent
        codepane.contentPane(title="Python", pageName="python", id=f"code-panel-{key}").pre(
            tabindex=0).code(source_path.read_text(), class_="language-python", id=f"code-{key}")
        if logic_path is not None:
            codepane.contentPane(title="logic.js", pageName="logic", id=f"logic-panel-{key}").pre(
                tabindex=0).code(logic_path.read_text(), class_="language-javascript", id=f"logic-{key}")
