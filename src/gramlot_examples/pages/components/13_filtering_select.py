from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Filtering select'
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1('Filtering select')
        pane.p('Search a caption, store its code. Two fields share the same choice and the same list.')
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.filteringSelect(id="choice", value="^choice", values="^choices", lbl="Delivery", readonly="^locked", box_c_width="16rem", placeholder="Type part of a caption")
        fields.filteringSelect(id="choice-copy", value="^choice", values="^choices", lbl="Same choice", readonly="^locked", box_c_width="16rem")
        pane.dataSetter("choices", "standard:Standard,express:Express,pickup:Pick up")
        pane.dataSetter("choice", "express")
        pane.p("Selected code:")
        pane.p("^choice", id="choice-value")
        pane.dataSetter("locked", False)
