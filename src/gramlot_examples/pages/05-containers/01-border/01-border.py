from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Border regions and splitters"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("Space for content")
        main_content.p("Drag a separator or use its arrow keys. Resize Filters and Details while editing the customer.")
        bc = main_content.borderContainer(id="border-demo", height="440px", max_width="64rem",
                                          border="1px solid var(--gramlot-border-control, #aaa)")
        bc.contentPane(region="top", border_bottom="1px solid var(--gramlot-border-control, #aaa)", height="40px", background="var(--gramlot-surface-subtle, #eef1f5)",
                       padding="8px").strong("Customer workspace")
        left = bc.contentPane(region="left", border_right="1px solid var(--gramlot-border-control, #aaa)", width="160px", splitter=True, minSize=100, maxSize=300,
                              padding="12px", background="var(--gramlot-surface-subtle, #eef1f5)")
        left.textbox(value="^filter", lbl="Filter", width="100%", default='')
        right = bc.contentPane(region="right", border_left="1px solid var(--gramlot-border-control, #aaa)", width="220px", splitter=True, minSize=120, maxSize=400,
                               padding="12px", background="var(--gramlot-surface-subtle, #eef1f5)")
        right.h3("Customer summary")
        right.p("^customer.name", mask="Customer: {}")
        right.checkbox(value="^customer.active", label="Active customer", mode="switch")
        right.p("^customer.notes")
        center = bc.contentPane(region="center", background="var(--gramlot-surface, #fff)", padding="16px 48px")
        fields = center.formlet(columns=1, max_width="22rem", gap="12px")
        fields.textbox(id="customer-name", value="^customer.name", lbl="Name (2–8 characters)", validate_len="2:8", width="100%")
        fields.textBoxArea(value="^customer.notes", lbl="Notes", rows=3, width="100%")
        center.p("Accepted name:")
        center.p("^customer.name", id="accepted-name")
        center.p("Try an invalid one-character name, then resize the panes. The draft stays in the field.")
