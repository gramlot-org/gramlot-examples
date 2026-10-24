from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Border events and controllers"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="events")
        main_content.dataController(
            "this.SET('.drawerCount', count + 1); "
            "this.SET('.drawerMessage', region + ': ' + (open ? 'open' : 'closed')); "
            "this.SET('.drawerPayload', JSON.stringify(_subscription_kwargs));",
            count="=.drawerCount", subscribe_eventFilters_closable_change=True)
        main_content.dataController(
            "this.SET('.resizeCount', count + 1); "
            "this.SET('.resizeMessage', region + ': ' + previousSize + ' → ' + size); "
            "this.SET('.resizePayload', JSON.stringify(_subscription_kwargs));",
            count="=.resizeCount", subscribe_eventWorkspace_splitter_resize=True)

        main_content.h1("Observe a drawer and a splitter")
        main_content.p("Toggle Filters, drag a separator, or focus a separator and use its arrow keys. The controllers below receive the published payloads.")
        main_content.checkbox(id="events-hide", value="^.hideFilters", label="Hide Filters from Data", default=False)
        border = main_content.borderContainer(id="events-border", nodeId="eventWorkspace",
                                              height="360px", max_width="48rem", rounded=10,
                                              border="1px solid var(--gramlot-border-control, #aaa)")
        filters = border.contentPane(nodeId="eventFilters", region="left", width="130px",
                                     minSize=90, maxSize=230, splitter=True, drawer=True,
                                     drawer_label="Filters", hidden="^.hideFilters", padding="12px",
                                     background="var(--gramlot-surface-subtle, #eef1f5)",
                                     border_right="1px solid var(--gramlot-border-control, #aaa)")
        filters.p("This pane publishes closable_change.")
        filters.textbox(id="events-name", value="^.name", lbl="Name (2–20)",
                        validate_len="2:20", width="100%")
        center = border.contentPane(region="center", padding="16px",
                                    background="var(--gramlot-surface, #fff)")
        center.textBoxArea(id="events-note", value="^.note", lbl="Retained draft",
                           rows=3, width="100%", max_width="18rem")
        center.p("Live resizing keeps these widgets mounted. The resize counter changes only when the gesture finishes.")
        border.contentPane(region="bottom", height="52px", minSize=36, maxSize=120,
                           splitter=True, padding="12px",
                           border_top="1px solid var(--gramlot-border-control, #aaa)",
                           background="var(--gramlot-surface-subtle, #eef1f5)").p("Resize this bottom region too.")
        report = main_content.section(class_="card stack", max_width="48rem")
        report.h2("Received by dataController")
        report.p("^.drawerCount", id="events-drawer-count", mask="Visibility events: {}")
        report.p("^.drawerMessage")
        report.pre("^.drawerPayload", id="events-drawer-payload", white_space="pre-wrap", overflow_wrap="anywhere")
        report.p("^.resizeCount", id="events-resize-count", mask="Completed resizes: {}")
        report.p("^.resizeMessage")
        report.pre("^.resizePayload", id="events-resize-payload", white_space="pre-wrap", overflow_wrap="anywhere")
        main_content.p("No events are emitted at startup. The Data checkbox changes visibility too; it does not change the drawer's own open/closed preference.")
