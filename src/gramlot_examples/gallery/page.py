"""Gallery content on Gramlot's reusable index page."""
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.tree import mygramlot as tree
from gramlot.collections.editors import mygramlot as editors
from gramlot import IndexPage, source, endpoint
from genro_bag import Bag
from gramlot_examples import build_gallery, navigation_directory
from gramlot_examples.gallery.guided_demo import guided_demo


NAVIGATION_ICON = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%223%22%20y%3D%224%22%20width%3D%2218%22%20height%3D%2216%22%20rx%3D%222%22%2F%3E%3Cpath%20d%3D%22M9%204v16M5.5%208h1M5.5%2012h1M5.5%2016h1%22%2F%3E%3C%2Fsvg%3E"
SETTINGS_ICON = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m10%203-.5%202-2%20.9-1.9-.6-2%203.4L5%2010v2l-1.4%201.3%202%203.4%201.9-.6%202%20.9.5%202h4l.5-2%202-.9%201.9.6%202-3.4L19%2012v-2l1.4-1.3-2-3.4-1.9.6-2-.9L14%203Z%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2211%22%20r%3D%223%22%2F%3E%3C%2Fsvg%3E"


INSPECTOR_ICON = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b8795%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%227%22%2F%3E%3Cpath%20d%3D%22m15%2015%206%206M7%208h6M10%208v5M7%2013h6%22%2F%3E%3Ccircle%20cx%3D%227%22%20cy%3D%228%22%20r%3D%22.7%22%2F%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%228%22%20r%3D%22.7%22%2F%3E%3Ccircle%20cx%3D%227%22%20cy%3D%2213%22%20r%3D%22.7%22%2F%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2213%22%20r%3D%22.7%22%2F%3E%3C%2Fsvg%3E"


class Page(IndexPage):
    gramlots = [inputs, layout, tree, editors]
    title = "Gramlot examples"
    installable = True
    app_icon = "/assets/branding/app-icon.png"
    css = (*IndexPage.css, "/themes/gramlot-index/theme.css", "/gallery/gallery.css")
    shell_id = "gallery"
    logoUrl = "/assets/branding/gramlot-logo-dark.svg"
    datapath = "galleryIndex"
    catalogs = ()
    serverless_download_url = None

    def main(self, root):
        frame = root.framePane(id="gallery-frame", height="100dvh", min_height=0)
        frame.left.setAttr({"id": "gallery-rail-region", "width": "42px", "padding": "45px 3px 3px",
                            "class": "gallery-rail-region"})
        rail = frame.left.menu(id="gallery-rail", presentation="bar", orientation="vertical",
                               labelPosition="tooltip", iconSize=24, width="100%", height="100%",
                               aria_label="Gallery tools")
        rail.menuline(caption="Navigation", tooltip="Show or hide navigation", iconSrc=NAVIGATION_ICON,
                      checked="^galleryIndex.navigationOpen", action="galleryToggleNavigation",
                      overflowable=False, id="gallery-navigation-button", width="36px", height="36px")
        rail.spacer(flex=1)
        rail.menuline(caption="Inspector", tooltip="Open inspector", iconSrc=INSPECTOR_ICON,
                      checked=False, disabled=True, overflowable=False,
                      id="gallery-inspector", width="36px", height="36px")
        rail.menuline(caption="Settings", tooltip="Show or hide settings", iconSrc=SETTINGS_ICON,
                      checked="^galleryIndex.settingsOpen", action="galleryToggleSettings",
                      overflowable=False, id="gallery-settings-button", width="36px", height="36px")
        super().main(frame.center)

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
        pane.set_attr({"drawer_minimize": True, "drawer_label": "", "drawer_display": "none"})
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
                "Use the Navigation toolbar button and the Code drawer label to show or hide their panels; drag their splitters to resize them. Each lesson has Example and Explanation tabs; switching them preserves the running example. "
                "Choose the theme, color combination and light/dark mode independently in Settings.")

    def group_panel(self, pane, group):
        pane.div((group["path"] / "README.md").read_text(), id=f"readme-{group['key']}")

    def footer(self, footer):
        settings = footer.div(class_="gallery-settings-content")
        fields = settings.formlet(columns=1, lbl_position="L", lbl_text_align="right",
                                  box_c_width="100%", gap="8px 12px", id="gallery-settings-form")
        fields.filteringSelect(validate_notnull=True, lbl="Theme", id="index-appearance", value="^galleryIndex.appearance",
                               values="base:Base,compact:Compact,mimi:mimi,joanna:joanna,mela:Mela")
        fields.filteringSelect(validate_notnull=True, lbl="Colors", id="index-palette", value="^galleryIndex.palette",
                               values="default:Theme default,compact:Blue & slate,mimi:Sage & green,joanna:Warm gray & blue")
        fields.filteringSelect(validate_notnull=True, lbl="Color mode", id="index-theme", value="^galleryIndex.theme",
                               values="light:Light,dark:Dark")
        fields.filteringSelect(validate_notnull=True, lbl="Toolbar", id="gallery-toolbar-position",
                               value="^galleryIndex.toolbarPosition", default="auto",
                               values="auto:Automatic,left:Left,bottom:Bottom")
        fields.filteringSelect(validate_notnull=True, lbl="Label position", id="gallery-label-position", value="^galleryIndex.labelPosition",
                               values="example:As in the example,TL:Top left,TC:Top center,TR:Top right,L:Left,R:Right,BL:Bottom left,BC:Bottom center,BR:Bottom right")
        fields.checkbox(lbl="Navigation", label="Keyboard shortcuts", id="keyboard-navigation",
                        value="^galleryIndex.keyboard")
        settings.p("Changes apply immediately. Colors do not change density; label position affects the example fields.")
        settings.p("Automatic uses the bottom in narrow, portrait windows and the left otherwise. Choose Left or Bottom to compare.")
        if self.installable:
            app = settings.details(class_="index-install")
            app.summary("Install app")
            app.html_button("Install", type="button", id="index-install-button", hidden=True)
            app.p("", id="index-install-status", role="status")
            app.p("Chrome: use Install page as app in the browser menu. "
                  "Safari on macOS Sonoma or later: File > Add to Dock.")
            app.p("Use HTTPS or localhost. For a static export, serve the directory; "
                  "direct file opening is not installable. Keep the server running for hosted pages.")

    def header(self, shell):
        header = shell.header(class_="gallery-toolbar")
        header.h1(self.title)
        header.span("", id="gallery-load-status", role="status", aria_live="polite")

    def behavior(self, shell):
        shell.set_attr({"height": "100%"})
        shell.dataController("this.SET('galleryIndex.navigationOpen', open)", subscribe_galleryNavigation_closable_change=True)
        shell.set_attr({"class": "frame-page index-shell gallery-containers"})
        shell.value.get_node("frame").set_attr({"id": "gallery-regions", "nodeId": "galleryRegions"})
        shell.section(id="gallery-inspector-panel", aria_label="Inspector")
        settings = shell.floatingPane(title="Settings", id="gallery-settings",
                                      open="^galleryIndex.settingsOpen", width="390px", height="420px")
        settings.frame.center.setAttr({"padding": "12px", "overflow": "auto"})
        self.footer(settings.frame.center)
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

    def source_document(self, key):
        """Read-only default; the serving integration supplies write authorization."""
        example = self.gallery_item(key)
        file = example["path"] / f"{example['folder']}.py"
        return dict(content=file.read_text(), revision=None, writable=False)

    def code_panel(self, parent, example):
        key = example["key"]
        document = self.source_document(key)
        pane = parent.contentPane(title="Python", pageName="python", id=f"code-panel-{key}")
        scope = "galleryIndex.sourceDocuments.s_" + key.encode("utf-8").hex()
        body = pane.div(datapath=scope, height="100%", display="flex", flex_direction="column")
        for name, value in dict(content=document["content"], saved=document["content"],
                                revision=document["revision"], readonly=not document["writable"],
                                busy=False, saveDisabled=True, revertDisabled=True,
                                status="" if document["writable"] else "Read only: remote editing is disabled.").items():
            body.dataSetter(f".{name}", value)
        toolbar = body.div(display="flex", gap="6px", padding="6px", flex_shrink=0,
                           class_="gallery-code-toolbar", hidden="^.readonly")
        toolbar.button("Save", class_="button--quiet", disabled="^.saveDisabled").dataController(
            func="galleryCodeSave", key=key)
        toolbar.button("Revert", class_="button--quiet", disabled="^.revertDisabled").dataController(
            func="galleryCodeRevert", key=key)
        body.div("^.status", role="status", padding="6px", white_space="pre-wrap", flex_shrink=0,
                 id=f"code-status-{key}")
        body.codeMirror(value="^.content", language="python", readonly="^.readonly", flex="1", min_height=0,
                        id=f"code-{key}", nodeId=f"galleryCodeEditor_{key}")
        body.dataController(func="galleryCodeMount", key=key, _onStart=True)
        body.dataController(func="galleryCodeSave", key=key, **{f"subscribe_galleryCodeEditor_{key}_save": True})
        logic_path = example["logic"]
        if logic_path is not None:
            parent.contentPane(title="logic.js", pageName="logic", id=f"logic-panel-{key}").pre(
                tabindex=0).code(logic_path.read_text(), class_="language-javascript", id=f"logic-{key}")
