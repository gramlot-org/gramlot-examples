from gramlot import Page as BasePage


class Page(BasePage):
    title = "Load choices with a browser callback"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        options = main_content.details(max_width="24rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.callbackSelect(id="choice", value="^choice", callback="searchChoices", lbl="Sample", readonly="^locked", box_c_width="18rem", placeholder="Try Sample 02 or value 7")
        fields.callbackSelect(id="choice-copy", value="^choice", callback="searchChoices", lbl="Same sample", readonly="^locked", box_c_width="18rem")
        main_content.dataController(func="createSamples", _onStart=True)
        main_content.p("Selected code:")
        main_content.p("^choice", id="choice-value")
