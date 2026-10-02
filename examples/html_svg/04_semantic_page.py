from gramlot import Page as BasePage


class Page(BasePage):
    title = "A semantic page"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        page = root.div(class_="example-page stack")
        header = page.header()
        header.p("GRAMLOT JOURNAL", class_="eyebrow")
        header.h1("A page with landmarks")
        nav = page.nav(aria_label="Page sections")
        nav.a("Story", href="#story")
        nav.span(" · ")
        nav.a("Notes", href="#notes")
        main = page.main()
        article = main.article(id="story", class_="stack")
        article.h2("The article")
        article.p("Header, navigation, main, article and footer each describe a role.")
        aside = main.aside(id="notes", class_="card")
        aside.h2("A side note")
        aside.p("The markup stays meaningful even without decoration.")
        page.footer().small("Built with native Source elements.")
