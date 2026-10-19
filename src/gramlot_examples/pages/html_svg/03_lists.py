from gramlot import Page as BasePage


STEPS = ["Describe a page with Source", "Add HTML elements", "Review the rendered document"]
TERMS = [("Source", "The declared structure of a page."), ("Data", "A separate home for application state.")]


class Page(BasePage):
    title = "Lists"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("Lists tell a sequence")
        main_content.p("Loops add one Source node for each item.")
        ordered = main_content.ol()
        for step in STEPS:
            ordered.li(step)
        main_content.h2("Two useful terms")
        definitions = main_content.dl()
        for term, description in TERMS:
            definitions.dt(term)
            definitions.dd(description)
        main_content.h2("A nested list")
        groups = main_content.ul()
        first = groups.li("HTML elements")
        nested = first.ul()
        for item in ("headings", "lists", "links"):
            nested.li(item)
        groups.li("SVG")
