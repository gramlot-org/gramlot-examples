"""A native HTML specimen built entirely with Gramlot Source."""

from gramlot import Page as BasePage


class Page(BasePage):
    title = "Native HTML catalogue"
    css = ("/themes/gramlot-base/theme.css", "/examples/00-runner/catalog/style.css")

    def main(self, root):
        shell = root.div(class_="example-page stack")
        header = shell.header(class_="stack")
        header.p("GRAMLOT · ELEMENT CATALOGUE", class_="muted")
        heading = header.hgroup()
        heading.h1("The native HTML canvas")
        heading.p("A living sample of semantic elements and controls rendered from Source.")
        nav = shell.nav(aria_label="Catalogue sections")
        for title, anchor in (("Text", "text"), ("Structure", "structure"),
                              ("Controls", "controls"), ("Data", "data"),
                              ("Media", "media")):
            nav.a(title, href=f"#{anchor}")
            nav.span("  ·  ", aria_hidden="true")

        main = shell.main(class_="stack")
        self.text(main)
        self.structure(main)
        self.controls(main)
        self.data(main)
        self.media(main)
        footer = shell.footer()
        footer.hr()
        footer.small("Source describes this page; the browser supplies native element behavior.")

    def text(self, main):
        section = main.section(id="text", class_="stack")
        section.h2("Text and meaning")
        cards = section.div(class_="grid")
        headings = cards.article(class_="card stack")
        headings.h3("Heading scale")
        headings.h4("A clear subsection")
        headings.h5("A smaller heading")
        headings.h6("The quietest heading")
        headings.p("One page heading sits above these levels.", class_="muted")

        inline = cards.article(class_="card stack")
        inline.h3("Inline vocabulary")
        sentence = inline.p("A ")
        sentence.strong("strong point")
        sentence.span(" can carry ")
        sentence.em("emphasis")
        sentence.span(", ")
        sentence.mark("a highlight")
        sentence.span(", and an ")
        sentence.a("ordinary link", href="#controls")
        sentence.span(".")
        terms = inline.p("Tags: ")
        terms.abbr("HTML", title="HyperText Markup Language")
        terms.span(" · ")
        terms.dfn("Source", title="A declared interface tree")
        terms.span(" · ")
        terms.code("page.main(root)")
        terms.span(" · ")
        terms.kbd("Tab")
        terms.span(" · ")
        terms.samp("ready")
        inline.pre("const page = source.main();\n// A preformatted snippet")
        inline.p("A plain bold word, an alternate voice, an annotated phrase, and underlined text follow:")
        flavors = inline.p()
        flavors.b("bold")
        flavors.span(" · ")
        flavors.i("alternate")
        flavors.span(" · ")
        flavors.u("annotated")
        flavors.span(" · ")
        flavors.s("no longer current")
        changes = inline.p("Changes: ")
        changes.del_("draft")
        changes.span(" → ")
        changes.ins("reviewed")
        notation = inline.p("Notation: ")
        notation.var("x")
        notation.sup("2")
        notation.span(" + H")
        notation.sub("2")
        notation.span("O · ")
        notation.gramlot_data("SKU-42", value="42")
        notation.span(" · ")
        notation.time("24 September 2026", datetime="2026-09-24")
        inline.small("Small print stays readable and secondary.")

        prose = cards.article(class_="card stack")
        prose.h3("Quotations and direction")
        quotation = prose.blockquote(cite="https://www.w3.org/TR/html52/")
        quotation.p("Meaningful structure makes a page easier to navigate.")
        quotation.footer().cite("A catalogue note")
        short = prose.p("A short ")
        short.q("inline quotation", cite="https://html.spec.whatwg.org/")
        short.span(" can live in a paragraph.")
        direction = prose.p("Mixed direction: ")
        direction.bdi("مرحبا")
        direction.span(" · ")
        direction.bdo("left to right", dir="ltr")
        prose.p("An intentional line break")
        line = prose.p("First line")
        line.br()
        line.span("Second line, with a long word break:")
        line.wbr()
        line.span("cataloguespecimen")

    def structure(self, main):
        section = main.section(id="structure", class_="stack")
        section.h2("Structure and disclosure")
        cards = section.div(class_="grid")
        article = cards.article(class_="card stack")
        article.h3("Article and aside")
        article.p("This article has its own subject and an adjacent note.")
        aside = article.aside(class_="surface-subtle")
        aside.h4("Side note")
        aside.p("Landmarks come from semantic elements, not CSS classes.")
        address = article.address()
        address.a("Gramlot project", href="https://github.com/gramlot-org/gramlot")

        lists = cards.section(class_="card stack")
        lists.h3("Lists")
        ordered = lists.ol()
        for item in ("Declare Source", "Render native HTML", "Inspect the result"):
            ordered.li(item)
        unordered = lists.ul()
        unordered.li("One item")
        unordered.li("Another item")
        menu = lists.menu()
        menu.li("Menu item A")
        menu.li("Menu item B")
        definitions = lists.dl()
        definitions.dt("Source")
        definitions.dd("The declared interface structure.")
        definitions.dt("Data")
        definitions.dd("State owned by Data Bags.")

        disclosure = cards.section(class_="card stack")
        disclosure.h3("Native disclosure")
        details = disclosure.details()
        details.summary("Open a concise explanation")
        details.p("The browser expands and collapses this content without application event code.")
        disclosure.p("A nonmodal dialog is shown open below.", class_="muted")
        dialog = disclosure.dialog(open=True, class_="catalog-dialog")
        dialog.h4("Dialog content")
        dialog.p("The open attribute keeps this nonmodal example visible.")

    def controls(self, main):
        section = main.section(id="controls", class_="stack")
        section.h2("Native controls")
        section.p("Try focus, typing, selection and Reset. Submission is disabled in this static catalogue.", class_="muted")
        form = section.form(class_="card stack")
        fields = form.div(class_="grid")

        identity = fields.fieldset(class_="stack")
        identity.legend("Text and identity")
        for label, key, kind, attrs in (
            ("Name", "name", "text", {"value": "Ada Lovelace", "required": True}),
            ("Email", "email", "email", {"placeholder": "name@example.org"}),
            ("Search", "query", "search", {"placeholder": "Search the catalogue"}),
            ("Website", "website", "url", {"placeholder": "https://example.org"}),
            ("Phone", "phone", "tel", {"placeholder": "+1 555 0100"}),
            ("Password", "password", "password", {"minlength": 8}),
        ):
            self.field(identity, label, key, kind, **attrs)
        self.field(identity, "Read-only reference", "reference", "text", value="CAT-01", readonly=True)
        self.field(identity, "Unavailable field", "unavailable", "text", value="Disabled", disabled=True)

        choices = fields.fieldset(class_="stack")
        choices.legend("Choices and ranges")
        for label, key, kind, attrs in (
            ("Quantity", "quantity", "number", {"value": 3, "min": 1, "max": 20}),
            ("Date", "date", "date", {}),
            ("Time", "time", "time", {}),
            ("Local date and time", "datetime", "datetime-local", {}),
            ("Month", "month", "month", {}),
            ("Week", "week", "week", {}),
            ("Color", "color", "color", {"value": "#456bc4"}),
            ("Range", "range", "range", {"value": 55, "min": 0, "max": 100}),
            ("Attachment", "attachment", "file", {}),
        ):
            self.field(choices, label, key, kind, **attrs)
        region_field = choices.div()
        region_field.gramlot_label("Region", for_="region")
        region = region_field.select(id="region", name="region")
        north = region.optgroup(label="Northern regions")
        north.option("Alps", value="alps")
        north.option("Lakes", value="lakes", selected=True)
        south = region.optgroup(label="Southern regions")
        south.option("Coast", value="coast")
        topics_field = choices.div()
        topics_field.gramlot_label("Topics (multiple)", for_="topics")
        topics = topics_field.select(id="topics", name="topics", multiple=True, size=3)
        for value in ("HTML", "SVG", "Source"):
            topics.option(value, value=value.lower(), selected=(value == "HTML"))

        states = fields.fieldset(class_="stack")
        states.legend("Flags and values")
        row = states.div()
        row.input(type="checkbox", id="updates", name="updates", checked=True)
        row.gramlot_label("Receive updates", for_="updates")
        for value in ("daily", "weekly"):
            row = states.div()
            row.input(type="radio", id=value, name="frequency", value=value, checked=(value == "weekly"))
            row.gramlot_label(value.title(), for_=value)
        language_field = states.div()
        language_field.gramlot_label("Favourite language", for_="language")
        language_field.input(type="text", id="language", name="language", list="languages")
        suggestions = states.datalist(id="languages")
        for value in ("Python", "JavaScript", "HTML"):
            suggestions.option(value)
        note_field = states.div()
        note_field.gramlot_label("Note", for_="note")
        note_field.textarea("A native multiline field.", id="note", name="note", rows=3)
        states.p("Measured value")
        states.meter("70%", value="0.7", min="0", max="1", low="0.3", high="0.8", optimum="0.9")
        states.p("Progress")
        states.progress("60%", value="60", max="100")
        result = states.p("Calculated output: ")
        result.output("42", name="result")

        actions = form.div()
        actions.button("Reset values", type="reset", class_="button--secondary")
        actions.span(" ")
        actions.button("Submit unavailable", type="submit", disabled=True)
        search = section.search(class_="card")
        search_field = search.div()
        search_field.gramlot_label("Search landmark", for_="landmark-query")
        search_field.input(type="search", id="landmark-query", placeholder="A separate native search landmark")

    def data(self, main):
        section = main.section(id="data", class_="stack")
        section.h2("Tabular data")
        wrapper = section.div(class_="card")
        table = wrapper.table()
        table.caption("Quarterly orders by region")
        columns = table.colgroup()
        columns.col()
        columns.col(span="3")
        heading = table.thead().tr()
        for label in ("Region", "Q1", "Q2", "Total"):
            heading.th(label, scope="col")
        body = table.tbody()
        for region, first, second in (("North", 12, 8), ("South", 9, 11), ("West", 15, 6)):
            row = body.tr()
            row.th(region, scope="row")
            for value in (first, second, first + second):
                row.td(str(value))
        total = table.tfoot().tr()
        total.th("All", scope="row")
        for value in (36, 25, 61):
            total.td(str(value))

    def media(self, main):
        section = main.section(id="media", class_="stack")
        section.h2("Images and SVG")
        cards = section.div(class_="grid")
        figure = cards.figure(class_="card stack")
        picture = figure.picture()
        picture.source(srcset="/assets/branding/gramlot-mark-dark.png", media="(prefers-color-scheme: dark)")
        picture.img(src="/assets/branding/gramlot-mark.png", alt="Gramlot curved blue and yellow symbol; blue arc and yellow disc link to notes below", width="160", height="160", usemap="#gramlot-symbol-map")
        image_map = figure.map(name="gramlot-symbol-map")
        image_map.area(shape="rect", coords="150,600,660,1120", href="#blue-note", alt="Blue arc note")
        image_map.area(shape="circle", coords="800,570,85", href="#yellow-note", alt="Yellow disc note")
        figure.p("The blue arc is the principal shape.", id="blue-note")
        figure.p("The detached yellow disc completes the mark.", id="yellow-note")
        figure.figcaption("The picture switches assets with the color scheme; the image map links its two shapes to notes.")
        vector = cards.figure(class_="card stack")
        icon = vector.svg(viewBox="0 0 120 80", role="img", aria_label="A blue circle and a yellow bar", width="120", height="80")
        icon.circle(cx="32", cy="40", r="22", fill="#456bc4")
        icon.rect(x="68", y="18", width="30", height="44", rx="6", fill="#ffc400")
        vector.figcaption("An inline SVG created through the SVG sub-builder.")

    @staticmethod
    def field(parent, label, key, kind, **attrs):
        field = parent.div()
        field.gramlot_label(label, for_=key)
        field.input(type=kind, id=key, name=key, **attrs)
