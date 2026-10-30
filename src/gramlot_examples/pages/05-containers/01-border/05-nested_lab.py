from gramlot import Page as BasePage


class Page(BasePage):
    title = "Nested regions playground"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("Five containers, one live workspace")
        main_content.p("Move the sliders, drag separators and close drawers. The same widgets and their values stay in place.")
        options = main_content.details()
        options.summary("Options · sizes, design and drawer captions")
        self.size_controls(options)

        self.workspace(main_content)


    def size_controls(self, main_content):
        settings = main_content.section(display="flex", flex_wrap="wrap", gap="12px", align_items="end")
        settings.filteringSelect(id="lab-design", value="^design", lbl="Outer design", width="10rem",
                                 values="headline:Headline,sidebar:Sidebar", default='headline')
        settings.checkbox(id="lab-minimize", value="^minimize", lbl="Drawer captions", label="Minimize", default=True)
        settings.horizontalSlider(id="lab-radius", value="^radius", lbl="Corner radius", min=0, max=28, live=True, width="12rem", default=12)
        sliders = main_content.section(display="flex", flex_wrap="wrap", gap="12px")
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

    def workspace(self, main_content):
        surface = "var(--gramlot-surface, #fff)"
        edge = "1px solid var(--gramlot-border-control, #8192aa)"
        fills = {"nav": "color-mix(in srgb, var(--gramlot-surface, #fff) 90%, #4488cc)",
                 "tools": "color-mix(in srgb, var(--gramlot-surface, #fff) 90%, #32a880)",
                 "details": "color-mix(in srgb, var(--gramlot-surface, #fff) 90%, #bb8844)",
                 "preview": "color-mix(in srgb, var(--gramlot-surface, #fff) 90%, #9977bb)"}
        drawer = dict(splitter=True, drawer=True, drawer_minimize="^minimize")
        main_content.p("On narrow screens, scroll the workspace sideways to keep every region readable.", class_="layout-pan-hint")
        canvas = main_content.div(class_="layout-canvas")
        outer = canvas.borderContainer(id="lab-outer", height="700px", max_width="78rem", design="^design",
                                    rounded="^radius", border=edge, background=surface)
        header = outer.contentPane(region="top", height="^regions.outer.top", minSize=40, maxSize=110,
                                   drawer_label="Header", padding="10px", background=fills["nav"], **drawer, default_height=58)
        header.strong("Customer workspace · ")
        header.span("^customer")
        footer = outer.contentPane(region="bottom", height="^regions.outer.bottom", minSize=35, maxSize=130,
                                   drawer_label="Status", padding="10px", background=fills["preview"], **drawer, default_height=46)
        footer.span("^customer", mask="Customer: {}")
        footer.span("^delivery", mask=" · Delivery: {}")
        nav = outer.borderContainer(id="lab-navigation", region="left", width="^regions.outer.left",
                                    minSize=90, maxSize=240, drawer_label="Navigation", background=fills["nav"], **drawer, default_width=150)
        nav.contentPane(region="top", height="40px", padding="10px").strong("Navigation")
        navbody = nav.contentPane(region="center", padding="12px")
        navbody.textbox(id="lab-search", value="^search", lbl="Search", width="100%", default='')
        navbody.radioButtonText(value="^section", lbl="Section", values="profile:Profile,orders:Orders,history:History", cols=1, default='profile')
        nav.contentPane(region="bottom", height="54px", padding="10px").span("^section", mask="Section: {}")
        details = outer.borderContainer(id="lab-details", region="right", width="^regions.outer.right",
                                        minSize=90, maxSize=240, drawer_label="Details", background=fills["details"], **drawer, default_width=170)
        details.contentPane(region="top", height="40px", padding="10px").strong("Details")
        detailfields = details.contentPane(region="center", padding="12px").formlet(columns=1)
        detailfields.checkbox(value="^active", lbl="Active", mode="switch")
        detailfields.textbox(value="^customer", lbl="Same customer", width="100%")
        detailfields.dateTextBox(id="lab-date", value="^appointment", lbl="Appointment", width="100%")
        details.contentPane(region="bottom", height="60px", padding="10px").p("An independent nested container.")
        work = outer.borderContainer(id="lab-workspace", region="center", rounded="^radius", border=edge)
        tools = work.contentPane(region="left", width="^regions.workspace.left", minSize=70, maxSize=200,
                                 drawer_label="Tools", padding="10px", background=fills["tools"], **drawer, default_width=105)
        tools.strong("Tools")
        tools.checkbox(value="^active", lbl="Enabled", mode="switch")
        tools.checkbox(value="^readonly", lbl="Editor", label="Read only", default=False)
        preview = work.contentPane(region="bottom", height="^regions.workspace.bottom", minSize=50, maxSize=180,
                                   drawer_label="Preview", padding="12px", background=fills["preview"], **drawer, default_height=90)
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
        notes = editor.contentPane(region="bottom", height="^regions.editor.bottom", minSize=60, maxSize=180,
                                   drawer_label="Notes", padding="10px 24px", background=fills["tools"], **drawer, default_height=100)
        notes.textBoxArea(id="lab-note", value="^note", lbl="Retained draft", rows=2, live=True, width="100%")
