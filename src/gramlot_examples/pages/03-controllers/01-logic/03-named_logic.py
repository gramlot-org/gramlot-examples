from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="cart")
        form = pane.form(class_="card stack")
        form.html_label("Price", for_="price")
        form.input(type="number", value="^.price", live=True, id="price")

        result = pane.section(class_="card stack")
        facts = result.dl()
        for label, key in (("Final price (func='finalPrice')", "final"), ("Changes seen (func='countChange')", "changes"),
                           ("Last reason", "reason")):
            facts.dt(label)
            facts.dd(f"^.{key}", id=key)

        pane.dataFormula(".final", func="finalPrice", price="^.price", threshold=100, _init=True)
        pane.dataController(func="countChange", price="^.price")
