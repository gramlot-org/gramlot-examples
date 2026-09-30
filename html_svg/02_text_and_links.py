from gramlot import Page as BasePage


class Page(BasePage):
    title = "Text and links"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        page = root.main(class_="example-page stack")
        page.h1("Words with meaning")
        intro = page.p("A paragraph can contain ")
        intro.strong("strong emphasis")
        intro.span(", ")
        intro.em("gentle emphasis")
        intro.span(", and a ")
        intro.a("link to the HTML standard", href="https://html.spec.whatwg.org/", target="_blank", rel="noopener noreferrer")
        intro.span(".")
        page.p("Text is escaped by the Source renderer: <tag> is shown as text.", class_="muted")
        quote = page.blockquote()
        quote.p("Clarity grows from small, explicit choices.")
        quote.footer("A note from this example")
        page.h2("Code as text")
        page.p("The expression below is shown literally:")
        page.pre().code("root.h1('Hello')")
        page.h3("A local destination", id="destination")
        page.p("Headings give the link above a place to land.")
        page.a("Jump back to the heading", href="#destination")
