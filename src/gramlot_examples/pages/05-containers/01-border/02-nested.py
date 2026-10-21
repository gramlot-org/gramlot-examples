from gramlot import Page as BasePage


class Page(BasePage):
    title = "Nested borders and layout designs"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("One layout inside another")
        controls = main_content.formlet(max_width="24rem", columns=1)
        controls.filteringSelect(id="design", value="^design", lbl="Outer design",
                                 values="headline:Headline,sidebar:Sidebar", width="10rem")
        bc = main_content.borderContainer(id="nested-demo", height="440px", design="^design", max_width="64rem",
                                          border="1px solid var(--gramlot-border-control, #aaa)")
        bc.contentPane(region="top", border_bottom="1px solid var(--gramlot-border-control, #aaa)", height="48px", splitter=True, minSize=30, maxSize=100,
                       padding="10px", background="var(--gramlot-surface-subtle, #eef1f5)").p("Outer header")
        left = bc.contentPane(region="left", border_right="1px solid var(--gramlot-border-control, #aaa)", width="130px", drawer=True, splitter=False,
                              drawer_title="Side", padding="10px", background="var(--gramlot-surface-subtle, #eef1f5)")
        left.h3("Workspace")
        left.radioButtonText(value="^section", values="profile:Profile,history:History", cols=1)
        left.p("A fixed-width drawer: open and close without dragging.")
        nested = bc.borderContainer(region="center")
        nested.contentPane(region="top", border_bottom="1px solid var(--gramlot-border-control, #aaa)", height="40px", padding="10px", background="var(--gramlot-surface-subtle, #eef1f5)").p("Inner header")
        editor = nested.contentPane(region="center", padding="12px 40px", background="var(--gramlot-surface, #fff)")
        editor.textbox(value="^name", lbl="Customer", width="100%", max_width="24rem")
        editor.checkbox(value="^active", label="Active", mode="switch")
        editor.textBoxArea(id="nested-note", value="^note", lbl="Retained draft", rows=3, width="100%", max_width="24rem")
        nested.contentPane(region="bottom", border_top="1px solid var(--gramlot-border-control, #aaa)", height="80px", splitter=True, minSize=36, maxSize=180,
                           drawer=True, drawer_title="Output",
                           padding="10px", background="var(--gramlot-surface-subtle, #eef1f5)").p("^note")
        main_content.dataSetter("name", "Ada Lovelace")
        main_content.dataSetter("active", True)
        main_content.dataSetter("section", "profile")
        main_content.dataSetter("design", "headline")
        main_content.dataSetter("note", "Resize the inner bottom region, then change the outer design.")
