from gramlot import Page as BasePage
from gramlot_examples import PACKAGE, read_catalog

EXAMPLES = [example for family in read_catalog(PACKAGE / "catalog.json", PACKAGE / "pages", common=True)
            for example in family["examples"]]


class Page(BasePage):
    gallery_urls = {demo["key"]: f"../{family['folder']}/{demo['folder']}"
                   for family in read_catalog(PACKAGE / "catalog.json", PACKAGE / "pages", common=True)
                   for demo in family["examples"]}
    title = "Demo carousel and live preview"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        demos = [demo for demo in EXAMPLES if demo["key"] != "l08"]
        main_content = root.main(class_="example-page stack", datapath="stackDemo")
        for key, value in (("panel", 0), ("page", demos[0]["key"]), ("caption", demos[0]["title"]),
                           ("active", demos[0]["key"]), ("activeCaption", demos[0]["title"]), ("event", "")):
            main_content.dataSetter(f".{key}", value)
        for demo in demos:
            main_content.dataSetter(f".urls.{demo['key']}", self.gallery_urls[demo["key"]])
            main_content.dataSetter(f".titles.{demo['key']}", demo["title"])
            main_content.dataSetter(f".opened.{demo['key']}", None)
        main_content.dataController(
            "if (selected) { this.SET('.caption', this.GET('.titles.' + page)); } "
            "this.SET('.event', JSON.stringify(_subscription_kwargs));",
            subscribe_demoStack_selected=True)
        main_content.dataController(
            "this.SET('.opened.' + demo, this.GET('.urls.' + demo)); this.SET('.active', demo); "
            "this.SET('.activeCaption', this.GET('.titles.' + demo));",
            demo="^.page", _delay=350, _onStart=True)
        main_content.h1("Browse, pause and try the demo")
        main_content.p(f"Slide through {len(demos)} thumbnails in the drawer. Pause to open the full-size demo in the center. Close the drawer for more space.")
        border = main_content.borderContainer(id="carousel-layout", height="min(76vh, 680px)", min_height="420px",
                                              rounded=6, border="1px solid var(--gramlot-border-control, #aaa)")
        border.contentPane(region="top", height="36px", padding="8px 12px",
                           border_bottom="1px solid var(--gramlot-border, #ccc)",
                           background="var(--gramlot-surface-subtle, #eef1f5)").strong(
                               "^.activeCaption", id="stack-active-title", mask="Live demo: {}")
        drawer = border.contentPane(id="carousel-drawer", region="left", width="260px", splitter=True,
                                    minSize=180, maxSize=400, drawer=True, drawer_label="Demos", drawer_icon="▦",
                                    padding="12px", background="var(--gramlot-surface-subtle, #eef1f5)",
                                    border_right="1px solid var(--gramlot-border, #ccc)", overflow="auto")
        drawer.horizontalSlider(id="stack-panel", value="^.panel", lbl=f"Demo index (0–{len(demos) - 1})",
                                min=0, max=len(demos) - 1, step=1, live=True, width="100%", min_width=0)
        drawer.h2("^.caption", id="stack-caption", margin_top="12px")
        drawer.p("^.page", id="stack-page", mask="Demo: {}")
        thumbnails = drawer.stackContainer(id="stack-demo", nodeId="demoStack", selectedPage="^.page",
                                            selected="^.panel", height="300px", rounded=4,
                                            border="1px solid var(--gramlot-border-control, #aaa)")
        center = border.contentPane(region="center", background="var(--gramlot-surface, #fff)")
        full = center.stackContainer(id="stack-full", selectedPage="^.active", height="100%")
        for demo in demos:
            panel = thumbnails.contentPane(pageName=demo["key"], position="relative", overflow="hidden")
            panel.iframe(id=f"mini-{demo['key']}", src=self.gallery_urls[demo["key"]], title=demo["title"], loading="lazy",
                         position="absolute", top=0, left=0, width="200%", height="200%", border=0,
                         transform="scale(0.5)", max_width="none", style="transform-origin:top left")
            full.contentPane(pageName=demo["key"]).iframe(
                id=f"live-{demo['key']}", src=f"^.opened.{demo['key']}", title=f"Live: {demo['title']}",
                width="100%", height="100%", border=0, display="block")
        main_content.p("The center loads a demo only after a pause and keeps visited pages mounted. Thumbnail and full-size views have independent Data. This overview excludes itself.")
