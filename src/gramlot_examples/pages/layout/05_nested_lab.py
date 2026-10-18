from datetime import date
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Nested regions playground"
    devices = ("desktop", "tablet", "phone")
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("Five containers, one live workspace")
        pane.p("Move the sliders, drag separators and close drawers. The same widgets and their values stay in place.")
        settings = pane.section(display="flex", flex_wrap="wrap", gap="12px", align_items="end")
        settings.filteringSelect(id="lab-design", value="^design", lbl="Outer design", width="10rem",
                                 values="headline:Headline,sidebar:Sidebar")
        settings.checkbox(id="lab-minimize", value="^minimize", lbl="Drawer captions", label="Minimize")
        settings.horizontalSlider(id="lab-radius", value="^radius", lbl="Corner radius", min=0, max=28, live=True, width="12rem")
        sliders = pane.section(display="flex", flex_wrap="wrap", gap="12px")
        sizes = (("outer.top", "Header height", 40, 110, 58),
                 ("outer.bottom", "Footer height", 35, 130, 46),
                 ("outer.left", "Navigation width", 90, 240, 150),
                 ("outer.right", "Details width", 90, 240, 170),
                 ("workspace.left", "Tools width", 70, 200, 105),
                 ("workspace.bottom", "Preview height", 50, 180, 90),
                 ("editor.bottom", "Notes height", 60, 180, 100))
        for path, caption, minimum, maximum, initial in sizes:
            sliders.horizontalSlider(id="size-" + path.replace(".", "-"), value="^regions." + path,
                                     lbl=f"^regions.{path}:{caption} · {{}} px", min=minimum, max=maximum, step=1, live=True, width="12rem")
            pane.dataSetter("regions." + path, initial)
        surface = "var(--gramlot-surface, #fff)"
        edge = "1px solid var(--gramlot-border-control, #8192aa)"
        fills = {"nav": "color-mix(in srgb, var(--gramlot-surface, #fff) 90%, #4488cc)",
                 "tools": "color-mix(in srgb, var(--gramlot-surface, #fff) 90%, #32a880)",
                 "details": "color-mix(in srgb, var(--gramlot-surface, #fff) 90%, #bb8844)",
                 "preview": "color-mix(in srgb, var(--gramlot-surface, #fff) 90%, #9977bb)"}
        drawer = dict(splitter=True, drawer=True, drawer_minimize="^minimize")
        outer = pane.borderContainer(id="lab-outer", height="700px", max_width="78rem", design="^design",
                                    rounded="^radius", border=edge, background=surface)
        header = outer.contentPane(region="top", height="^regions.outer.top:{}px", minSize=40, maxSize=110,
                                   drawer_label="Header", padding="10px", background=fills["nav"], **drawer)
        header.strong("Customer workspace · ")
        header.span("^customer")
        footer = outer.contentPane(region="bottom", height="^regions.outer.bottom:{}px", minSize=35, maxSize=130,
                                   drawer_label="Status", padding="10px", background=fills["preview"], **drawer)
        footer.span("^customer", mask="Customer: {}")
        footer.span("^delivery", mask=" · Delivery: {}")
        nav = outer.borderContainer(id="lab-navigation", region="left", width="^regions.outer.left:{}px",
                                    minSize=90, maxSize=240, drawer_label="Navigation", background=fills["nav"], **drawer)
        nav.contentPane(region="top", height="40px", padding="10px").strong("Navigation")
        navbody = nav.contentPane(region="center", padding="12px")
        navbody.textbox(id="lab-search", value="^search", lbl="Search", width="100%")
        navbody.radioButtonText(value="^section", lbl="Section", values="profile:Profile,orders:Orders,history:History", cols=1)
        nav.contentPane(region="bottom", height="54px", padding="10px").span("^section", mask="Section: {}")
        details = outer.borderContainer(id="lab-details", region="right", width="^regions.outer.right:{}px",
                                        minSize=90, maxSize=240, drawer_label="Details", background=fills["details"], **drawer)
        details.contentPane(region="top", height="40px", padding="10px").strong("Details")
        detailfields = details.contentPane(region="center", padding="12px").formlet(columns=1)
        detailfields.checkbox(value="^active", lbl="Active", mode="switch")
        detailfields.textbox(value="^customer", lbl="Same customer", width="100%")
        detailfields.dateTextBox(id="lab-date", value="^appointment", lbl="Appointment", width="100%")
        details.contentPane(region="bottom", height="60px", padding="10px").p("An independent nested container.")
        work = outer.borderContainer(id="lab-workspace", region="center", rounded="^radius", border=edge)
        tools = work.contentPane(region="left", width="^regions.workspace.left:{}px", minSize=70, maxSize=200,
                                 drawer_label="Tools", padding="10px", background=fills["tools"], **drawer)
        tools.strong("Tools")
        tools.checkbox(value="^active", lbl="Enabled", mode="switch")
        tools.checkbox(value="^readonly", lbl="Editor", label="Read only")
        preview = work.contentPane(region="bottom", height="^regions.workspace.bottom:{}px", minSize=50, maxSize=180,
                                   drawer_label="Preview", padding="12px", background=fills["preview"], **drawer)
        preview.strong("Shared note")
        preview.p("^note")
        editor = work.borderContainer(id="lab-editor", region="center", rounded="^radius", border=edge, background=surface)
        editor.contentPane(region="top", height="40px", padding="10px").strong("Editor · third nesting level")
        fields = editor.contentPane(region="center", padding="16px 24px").formlet(columns=1, max_width="22rem")
        fields.textbox(id="lab-customer", value="^customer", lbl="Customer (2–24 characters)",
                       validate_len="2:24", readonly="^readonly", width="100%")
        fields.filteringSelect(id="lab-delivery", value="^delivery", lbl="Delivery", width="100%",
                               values="standard:Standard,express:Express,pickup:Pick up")
        fields.numberTextBox(id="lab-quantity", value="^quantity", lbl="Quantity", width="100%")
        notes = editor.contentPane(region="bottom", height="^regions.editor.bottom:{}px", minSize=60, maxSize=180,
                                   drawer_label="Notes", padding="10px 24px", background=fills["tools"], **drawer)
        notes.textBoxArea(id="lab-note", value="^note", lbl="Retained draft", rows=2, live=True, width="100%")
        for key, value in (("design", "headline"), ("minimize", True), ("radius", 12),
                           ("customer", "Ada Lovelace"), ("search", ""), ("section", "profile"),
                           ("active", True), ("readonly", False), ("delivery", "standard"),
                           ("quantity", 3), ("appointment", date(2026, 10, 18)),
                           ("note", "Resize any region: this note stays here.")):
            pane.dataSetter(key, value)
