from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Filtering select'

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Filtering select')
        main_content.p('Search a caption, store its code. Two fields share the same choice and the same list.')
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only")
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.filteringSelect(id="choice", value="^choice", values="^choices", lbl="Delivery", readonly="^locked", box_c_width="16rem", placeholder="Type part of a caption")
        fields.filteringSelect(id="choice-copy", value="^choice", values="^choices", lbl="Same choice", readonly="^locked", box_c_width="16rem")
        main_content.dataSetter("choices", "standard:Standard,express:Express,pickup:Pick up")
        main_content.dataSetter("choice", "express")
        main_content.p("Selected code:")
        main_content.p("^choice", id="choice-value")
        main_content.dataSetter("locked", False)
