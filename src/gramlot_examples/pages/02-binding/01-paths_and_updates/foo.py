from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        pane = root.div(class_="example-page stack")
        customer = pane.section(datapath="customer", class_="card stack")
        customer.html_label("Customer name", for_="customer-name")
        customer.input(value="^.name", live=True, id="customer-name")
        customer.p("^.name", id="customer-preview", color="^ui.accent")
        customer.p("^.city", id="customer-city")
        pane.html_label("Accent", for_="accent")
        pane.input(type="color", value="^ui.accent", default="#2563eb", id="accent")

        draft = pane.section(datapath="draft", class_="card stack")
        draft.h2("Try an empty form")
        draft.html_label("Draft name", for_="draft-name")
        draft.input(value="^.name", default="", live=True, id="draft-name")
        draft.html_label("Draft city", for_="draft-city")
        draft.input(value="^.city", default="", live=True, id="draft-city")
        actions = draft.div(class_="actions")
        actions.button("Play · fill sample", id="fill-sample", type="button").dataController(func="playSample")
        actions.button("Clear draft", id="clear-draft", type="button").dataController(func="clearSample")
        draft.dataController(
            "this.SET('draft.city', sample.getItem('city')); this.SET('ui.playSample', null);",
            sample="^ui.playSample", _if="sample", _delay=300)
        draft.p("^.name", id="draft-preview")
