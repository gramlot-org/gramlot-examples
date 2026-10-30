from gramlot import Page as BasePage
from gramlot_examples import PACKAGE, read_catalog

EXAMPLES = [example for family in read_catalog(PACKAGE / "catalog.json", PACKAGE / "pages", common=True)
            for example in family["examples"]]


class Page(BasePage):
    gallery_urls = {demo["key"]: f"../{family['folder']}/{demo['folder']}"
                   for family in read_catalog(PACKAGE / "catalog.json", PACKAGE / "pages", common=True)
                   for demo in family["examples"]}
    title = "Switch pages in a single stack"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        demos = [demo for demo in EXAMPLES if demo["key"] != "l08"]
        main_content = root.main(class_="example-page stack", datapath="stackDemo")
        for key, value in (("active", demos[0]["key"]), ("activeCaption", demos[0]["title"])):
            main_content.dataSetter(f".{key}", value)
        # These URLs are supplied by the host, not static example records.
        main_content.dataSetter(".urls", {demo["key"]: self.gallery_urls[demo["key"]] for demo in demos})
        main_content.dataSetter(".titles", {demo["key"]: demo["title"] for demo in demos})
        main_content.dataController(
            "const demo = keys[panel]; this.SET('.opened.' + demo, this.GET('.urls.' + demo)); "
            "this.SET('.active', demo); this.SET('.activeCaption', this.GET('.titles.' + demo));",
            panel="^.panel", keys=[demo["key"] for demo in demos], _delay=350, _onStart=True)
        main_content.h1("Browse, pause and try the demo")
        main_content.p(f"Use the slider to choose among {len(demos)} demos. Pause briefly to open your choice in the single central view.")
        border = main_content.borderContainer(id="carousel-layout", height="min(76vh, 680px)", min_height="320px",
                                              rounded=6, border="1px solid var(--gramlot-border-control, #aaa)")
        controls = border.contentPane(region="top", height="76px", padding="6px 12px",
                                      border_bottom="1px solid var(--gramlot-border, #ccc)",
                                      background="var(--gramlot-surface-subtle, #eef1f5)")
        controls.strong("^.activeCaption", id="stack-active-title", display="block", margin_bottom="4px")
        controls.horizontalSlider(id="stack-panel", value="^.panel", default=0,
                                  lbl=f"Demo index (0–{len(demos) - 1})", lbl_position="L",
                                  min=0, max=len(demos) - 1, step=1, live=True, width="100%", min_width=0)
        center = border.contentPane(region="center", background="var(--gramlot-surface, #fff)")
        full = center.stackContainer(id="stack-full", selectedPage="^.active", height="100%")
        for demo in demos:
            full.contentPane(pageName=demo["key"]).iframe(
                id=f"live-{demo['key']}", src=f"^.opened.{demo['key']}", title=demo["title"],
                width="100%", height="100%", border=0, display="block")
        main_content.p("Visited demos keep their edits. Demos you skip quickly are never loaded. This overview excludes itself.")
