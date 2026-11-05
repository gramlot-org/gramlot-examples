from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.h1("Words with meaning")
        intro = root.p("A paragraph can contain ")
        intro.strong("strong emphasis")
        intro.span(", ")
        intro.em("gentle emphasis")
        intro.span(", and a ")
        intro.a("link to the HTML standard", href="https://html.spec.whatwg.org/", target="_blank", rel="noopener noreferrer")
        intro.span(".")
        root.p("Text is escaped by the Source renderer: <tag> is shown as text.", class_="muted")
        quote = root.blockquote()
        quote.p("Clarity grows from small, explicit choices.")
        quote.footer("A note from this example")
        root.h2("Code as text")
        root.p("The expression below is shown literally:")
        root.pre().code("root.h1('Hello')")
        root.h3("A local destination", id="destination")
        root.p("The link below targets this heading by its id.")
        root.a("Jump back to the heading", href="#destination")
