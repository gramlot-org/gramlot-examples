from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Callback select'
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1('Callback select')
        pane.p('Search 100 random samples generated once in this page. The callback reads a Data Bag, without a server request.')
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.callbackSelect(id="choice", value="^choice", callback="searchChoices", lbl="Sample", readonly="^locked", box_c_width="18rem", placeholder="Try Sample 02 or value 7")
        fields.callbackSelect(id="choice-copy", value="^choice", callback="searchChoices", lbl="Same sample", readonly="^locked", box_c_width="18rem")
        pane.p("100 stable codes; random values stay unchanged until the page reloads.")
        pane.dataController(func="createSamples", _onStart=True)
        pane.p("Selected code:")
        pane.p("^choice", id="choice-value")
        pane.dataSetter("locked", False)
