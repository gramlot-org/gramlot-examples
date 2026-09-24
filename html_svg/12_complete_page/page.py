from gramlot import Page as BasePage


SESSIONS = (
    ("09:00", "A first Source tree", "Mira", "Describe a page with semantic HTML."),
    ("10:30", "Drawing with SVG", "Theo", "Build a small scene from native shapes."),
    ("13:00", "Putting it together", "Mira & Theo", "Compose cards, a schedule and a summary."),
)
SPEAKERS = (("Mira", "Page authoring"), ("Theo", "SVG composition"))
QUESTIONS = (("Do I need a service?", "This local example has no remote data."),
             ("Is the map interactive?", "No. It is a schematic SVG illustration."))


class Page(BasePage):
    title = "A complete example page"
    css = ("/themes/gramlot-base/theme.css", "/examples/html_svg/12_complete_page/style.css")

    def main(self, root):
        shell = root.div(class_="example-page complete-page")
        self.header(shell)
        main = shell.main(class_="stack")
        self.hero(main)
        self.highlights(main)
        self.schedule(main)
        self.speakers(main)
        self.map(main)
        self.faq(main)
        shell.footer().small("Gramlot native HTML/SVG examples · Static content")

    def header(self, shell):
        header = shell.header(class_="complete-header")
        header.p("GRAMLOT FIELD NOTES", class_="eyebrow")
        header.h1("A day of small interfaces")
        header.p("A composed page built from native HTML and SVG Source.")
        nav = header.nav(aria_label="Page sections")
        for label, target in (("Highlights", "highlights"), ("Schedule", "schedule"),
                              ("Speakers", "speakers"), ("Map", "map"), ("FAQ", "faq")):
            nav.a(label, href=f"#{target}")

    def hero(self, main):
        hero = main.section(class_="card complete-hero", aria_label="Illustration")
        drawing = hero.svg(viewBox="0 0 720 180", role="img", aria_labelledby="complete-art-title", class_="example-art")
        drawing.title("Three connected steps", id="complete-art-title")
        drawing.line(x1=125, y1=90, x2=595, y2=90, stroke="var(--gramlot-border)", stroke_width=8)
        for x, label, color in ((125, "WRITE", "var(--gramlot-action)"),
                                (360, "COMPOSE", "var(--gramlot-warning)"),
                                (595, "REVIEW", "var(--gramlot-success)")):
            group = drawing.g(transform=f"translate({x} 90)")
            group.circle(cx=0, cy=0, r=47, fill=color)
            group.text(label, x=0, y=6, text_anchor="middle", font_size=15,
                       font_weight="bold", fill="var(--gramlot-background)")
        hero.p("Three lessons. One Source tree. A page you can read without scripts beyond the Gramlot runtime.")

    def highlights(self, main):
        section = main.section(id="highlights", class_="stack")
        section.h2("Highlights")
        cards = section.div(class_="grid complete-grid")
        for number, title, description in (("01", "Write", "Use page methods to describe content."),
                                            ("02", "Compose", "Nest native elements and SVG."),
                                            ("03", "Review", "Inspect the result in either language.")):
            card = cards.article(class_="card stack")
            card.p(number, class_="eyebrow")
            card.h3(title)
            card.p(description)

    def schedule(self, main):
        section = main.section(id="schedule", class_="stack")
        section.h2("Schedule")
        table = section.table()
        table.caption("Three short sessions")
        heading = table.thead().tr()
        for title in ("Time", "Session", "Speaker", "Focus"):
            heading.th(title, scope="col")
        body = table.tbody()
        for time, title, speaker, focus in SESSIONS:
            row = body.tr()
            row.th(time, scope="row")
            for text in (title, speaker, focus):
                row.td(text)

    def speakers(self, main):
        section = main.section(id="speakers", class_="stack")
        section.h2("Speakers")
        cards = section.div(class_="grid complete-grid")
        for name, specialty in SPEAKERS:
            card = cards.article(class_="card")
            card.h3(name)
            card.p(specialty)

    def map(self, main):
        section = main.section(id="map", class_="stack")
        section.h2("A schematic venue map")
        figure = section.figure(class_="card")
        drawing = figure.svg(viewBox="0 0 600 210", role="img", aria_labelledby="venue-title", class_="example-art")
        drawing.title("Entrance, studio and hall connected by a path", id="venue-title")
        drawing.path(d="M80 110 H300 V65 H510", fill="none", stroke="var(--gramlot-action)", stroke_width=8)
        for x, y, label in ((80, 110, "Entrance"), (300, 65, "Studio"), (510, 65, "Hall")):
            stop = drawing.g(transform=f"translate({x} {y})")
            stop.circle(cx=0, cy=0, r=15, fill="var(--gramlot-warning)")
            stop.text(label, x=0, y=37, text_anchor="middle", font_size=17, fill="currentColor")
        figure.figcaption("A diagram made of paths, circles and labels; it is not navigation.")

    def faq(self, main):
        section = main.section(id="faq", class_="stack")
        section.h2("Frequently asked questions")
        for question, answer in QUESTIONS:
            details = section.details(class_="card")
            details.summary(question)
            details.p(answer)
