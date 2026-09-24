from gramlot import Page as BasePage


class Page(BasePage):
    title = "Native disclosure and measures"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        page = root.main(class_="example-page stack")
        page.h1("Built-in disclosure and measures")
        page.p("Open the questions with the browser's native details control.")
        for question, answer in (
            ("What is Source?", "A declarative tree describing the page."),
            ("Can a page contain SVG?", "Yes. The SVG dialect nests under an HTML Source node."),
        ):
            details = page.details(class_="card")
            details.summary(question)
            details.p(answer)
        measures = page.section(class_="card stack")
        measures.h2("Measured values")
        measures.gramlot_label("Preparation: 70%", for_="preparation")
        measures.progress(id="preparation", value=70, max=100)
        measures.gramlot_label("Quality score: 8 of 10", for_="quality")
        measures.meter(id="quality", min=0, max=10, low=4, high=8, optimum=10, value=8)
        measures.p("These numbers are fixed page content; no live progress is implied.", class_="muted")
