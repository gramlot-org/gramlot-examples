from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Search a list and select a value"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Filtering select')
        main_content.p('Search a caption, store its code. Two fields share the same choice and the same list.')
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.filteringSelect(id="choice", value="^choice", values="^choices", lbl="Delivery", readonly="^locked", box_c_width="16rem", placeholder="Type part of a caption")
        fields.filteringSelect(id="choice-copy", value="^choice", values="^choices", lbl="Same choice", readonly="^locked", box_c_width="16rem")
        main_content.p("Selected code:")
        main_content.p("^choice", id="choice-value")
