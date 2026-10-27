from gramlot import Page as BasePage


class Page(BasePage):
    title = "Semantic page"

    def main(self, root):
        pane = root.div(class_="example-page stack")
        header = pane.header()
        header.p("GRAMLOT JOURNAL", class_="eyebrow")
        header.h1("A page with landmarks")
        nav = pane.nav(aria_label="Page sections")
        nav.a("Story", href="#story")
        nav.span(" · ")
        nav.a("Notes", href="#notes")
        main_content = pane.main()
        article = main_content.article(id="story", class_="stack")
        article.h2("The article")
        article.p("Header, navigation, main, article and footer each describe a role.")
        aside = main_content.aside(id="notes", class_="card")
        aside.h2("A side note")
        aside.p("The markup stays meaningful even without decoration.")
        pane.footer().small("Built with Gramlot Source.")
