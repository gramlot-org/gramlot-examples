from gramlot import Page as BasePage


STEPS = ["Describe a page with Source", "Add native HTML elements", "Review the rendered document"]
TERMS = [("Source", "The declared structure of a page."), ("Data", "A separate home for application state.")]


class Page(BasePage):
    title = "Lists"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        page = root.main(class_="example-page stack")
        page.h1("Lists tell a sequence")
        page.p("Loops add one Source node for each item.")
        ordered = page.ol()
        for step in STEPS:
            ordered.li(step)
        page.h2("Two useful terms")
        definitions = page.dl()
        for term, description in TERMS:
            definitions.dt(term)
            definitions.dd(description)
        page.h2("A nested list")
        groups = page.ul()
        first = groups.li("Native elements")
        nested = first.ul()
        for item in ("headings", "lists", "links"):
            nested.li(item)
        groups.li("Native SVG")
