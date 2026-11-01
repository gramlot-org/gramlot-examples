from gramlot import Page as BasePage


class Page(BasePage):
    title = "Drawers: handles, content and retained Data"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", height="100dvh", box_sizing="border-box",
                                 display="flex", flex_direction="column", overflow="hidden")
        canvas = main_content.div(class_="layout-canvas")
        border = canvas.borderContainer(id="handles-demo", height="100%", min_height=0, flex="1", max_width="64rem",
                                              border="1px solid var(--gramlot-border-control, #aaa)", rounded=12)
        surface = "var(--gramlot-surface-subtle, #eef1f5)"
        search = border.contentPane(region="top", nodeId="drawerSearch", height="80px", splitter=True, drawer="^drawerSearch",
                           drawer_icon="⌕", drawer_label="Search", drawer_title="Search", drawer_minimize=True,
                           minSize=36,
                           padding="10px", background=surface, default_drawer=True)
        search.textbox(value="^search", lbl="Search customers", placeholder="Type a name", width="100%", max_width="20rem", default='')
        filters = border.contentPane(region="left", nodeId="drawerFilters", width="^filtersWidth", splitter=True, drawer="^drawerFilters",
                           drawer_label="Filters", drawer_title="Filters",
                           minSize=70, padding="10px", background=surface, default_drawer=True, default_width='180px')
        filters.h3("Filters")
        filters.checkbox(value="^active", label="Active only", mode="switch")
        filters.radioButtonText(value="^delivery", values="standard:Standard,express:Express,pickup:Pick up", cols=1)
        details = border.contentPane(region="right", nodeId="drawerDetails", width="180px", splitter=True, drawer="^drawerDetails",
                           drawer_label="Details", drawer_title="Details", drawer_minimize=True,
                           minSize=70, padding="10px", background=surface, default_drawer='close')
        details.h3("Customer details")
        details.textbox(value="^customer", lbl="Customer", width="100%")
        border.contentPane(region="bottom", nodeId="drawerOutput", height="64px", splitter=True, drawer="^drawerOutput",
                           drawer_label="Output", drawer_title="Output",
                           minSize=36, padding="10px", background=surface, default_drawer=True).p("^note", mask="Shared note: {}")
        center = border.contentPane(region="center", padding="16px", background="var(--gramlot-surface, #fff)")
        center.h2("Customer workspace")
        center.p("^customer", mask="Customer: {}")
        center.p("^delivery", mask="Delivery: {}")
        center.textbox(id="handles-note", value="^note", lbl="Retained value", width="100%", max_width="18rem")
        for title in ("Search", "Filters", "Details", "Output"):
            main_content.dataController("this.SET(path, open ? true : 'close')", path=f"drawer{title}",
                                        **{f"subscribe_drawer{title}_closable_change": True})
