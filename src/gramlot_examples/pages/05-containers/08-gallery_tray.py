"""An empty tray: add independent live pages from the shared catalogue."""
from gramlot import Page as BasePage
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot_examples import PACKAGE, read_catalog

FAMILIES = read_catalog(PACKAGE / "catalog.json", PACKAGE / "pages", common=True)
# Do not embed this tray or the carousel, which can open this tray again.
EXCLUDED = {"gallery-tray", "l08"}


class Page(BasePage):
    title = "Gallery tray"
    gramlots = [inputs, layout]
    devices = ("desktop", "tablet", "phone")
    gallery_urls = {demo["key"]: f"../{family['folder']}/{demo['folder']}"
                    for family in FAMILIES for demo in family["examples"]}

    def main(self, root):
        main_content = root.main(datapath="galleryTray", class_="example-page stack",
                         padding="12px", max_width="none", width="100%")
        main_content.p("Choose an example and press Add. Each card opens a live page at 65% zoom. Drag its title, resize it, or try its controls.", margin="0")
        # Catalogue titles and host-specific URLs are generated, not sample records.
        main_content.dataSetter(".examples", {demo["key"]: dict(title=demo["title"], url=self.gallery_urls[demo["key"]])
                        for family in FAMILIES for demo in family["examples"] if demo["key"] not in EXCLUDED})
        frame = main_content.framePane(height="max(660px, calc(100dvh - 100px))",
                               border="1px solid var(--gramlot-border)", border_radius="8px")
        example_picker(frame.top)
        frame.center.set_attr(dict(overflow="auto"))
        frame.center.trayPane(nodeId="galleryTray", id="gallery-tray", storepath=".layout",
                              min_width="1100px", height="100%", min_height="700px", background="var(--gramlot-surface-subtle)")


def example_picker(region):
    bar = region.menu(presentation="bar", height="42px", border_bottom="1px solid var(--gramlot-border)")
    tools = bar.contentPane(display="flex", align_items="center", gap="8px", padding="0 8px")
    picker = tools.select(id="tray-example", value="^.choice", default="", aria_label="Example",
                          width="min(440px, 55vw)")
    picker.option("Choose an example…", value="")
    for family in FAMILIES:
        group = picker.optgroup(label=family["title"])
        for demo in family["examples"]:
            if demo["key"] not in EXCLUDED:
                group.option(demo["title"], value=demo["key"])
    tools.button("Add", id="tray-add", disabled="^.choice:=!{}").dataController(func="addExample")
    bar.spacer(flex=1)
    bar.contentPane().span("^.count", mask="{} cards", padding="0 10px")
