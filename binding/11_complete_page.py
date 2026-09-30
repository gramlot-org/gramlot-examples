from gramlot import Page as BasePage


SESSIONS = (
    ("09:00", "A first Source tree", "Mira", "mira", "Describe a page with semantic HTML."),
    ("10:30", "Drawing with SVG", "Theo", "theo", "Build a small scene from native shapes."),
    ("13:00", "Putting it together", "Mira & Theo", None, "Compose cards, a schedule and a summary."),
)
SPEAKERS = (("mira", "Mira", "Page authoring"), ("theo", "Theo", "SVG composition"))
STOPS = (("entrance", 80, 110, "Entrance"), ("studio", 300, 65, "Studio"), ("hall", 510, 65, "Hall"))
QUESTIONS = (("Do I need a service?", "This local example has no remote data."),
             ("Is the map interactive?", "The highlighted stop follows the radio buttons above it."))


class Page(BasePage):
    title = "A complete page with binding"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        shell = root.div(class_="example-page complete-page", datapath="event")
        self.header(shell)
        main_content = shell.html_main(class_="stack")
        self.hero(main_content)
        self.schedule(main_content)
        self.speakers(main_content)
        self.map(main_content)
        self.faq(main_content)
        shell.footer().small("^.footer")
        shell.dataSetter(".title", "A day of small interfaces")
        shell.dataSetter(".footer", "Gramlot binding examples · Data-driven content")
        shell.dataSetter(".show", {"mira": True, "theo": True})
        shell.dataSetter(".stop", {"entrance": False, "studio": True, "hall": False})
        shell.dataSetter(".faq_open", False)

    def header(self, shell):
        header = shell.header(class_="complete-header")
        header.p("GRAMLOT FIELD NOTES", class_="eyebrow")
        header.h1("^.title", id="title")
        header.html_label("Event title", for_="title-field")
        header.input(value="^.title", live=True, id="title-field")
        nav = header.nav(aria_label="Page sections")
        for label, target in (("Schedule", "schedule"), ("Speakers", "speakers"), ("Map", "map"), ("FAQ", "faq")):
            nav.a(label, href=f"#{target}")

    def hero(self, main_content):
        hero = main_content.section(class_="card complete-hero", aria_label="Illustration")
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
        hero.p("^.title")

    def schedule(self, main_content):
        section = main_content.section(id="schedule", class_="stack")
        section.h2("Schedule")
        filters = section.div()
        for key, name, _ in SPEAKERS:
            filters.input(type="checkbox", value=f"^.show.{key}", id=f"show-{key}")
            filters.html_label(f"Sessions of {name}", for_=f"show-{key}")
        table = section.table()
        table.caption("Three short sessions")
        heading = table.thead().tr()
        for title in ("Time", "Session", "Speaker", "Focus"):
            heading.th(title, scope="col")
        body = table.tbody()
        for index, (time, title, speaker, key, focus) in enumerate(SESSIONS):
            row = body.tr(visible=f"^.show.{key}", id=f"session-{index}") if key else body.tr(id=f"session-{index}")
            row.th(time, scope="row")
            for text in (title, speaker, focus):
                row.td(text)

    def speakers(self, main_content):
        section = main_content.section(id="speakers", class_="stack")
        section.h2("Speakers")
        cards = section.div(class_="grid complete-grid")
        for key, name, specialty in SPEAKERS:
            card = cards.article(class_="card", visible=f"^.show.{key}")
            card.h3(name)
            card.p(specialty)

    def map(self, main_content):
        section = main_content.section(id="map", class_="stack")
        section.h2("A schematic venue map")
        choice = section.div()
        for key, _, _, label in STOPS:
            choice.input(type="radio", group="stop", value=f"^.stop.{key}", id=f"stop-{key}")
            choice.html_label(label, for_=f"stop-{key}")
        figure = section.figure(class_="card")
        drawing = figure.svg(viewBox="0 0 600 210", role="img", aria_labelledby="venue-title", class_="example-art")
        drawing.title("Entrance, studio and hall connected by a path", id="venue-title")
        drawing.path(d="M80 110 H300 V65 H510", fill="none", stroke="var(--gramlot-action)", stroke_width=8)
        for key, x, y, label in STOPS:
            stop = drawing.g(transform=f"translate({x} {y})")
            stop.circle(cx=0, cy=0, r=25, fill="none", stroke="var(--gramlot-success)", stroke_width=5,
                        visible=f"^.stop.{key}", id=f"ring-{key}")
            stop.circle(cx=0, cy=0, r=15, fill="var(--gramlot-warning)")
            stop.text(label, x=0, y=45, text_anchor="middle", font_size=17, fill="currentColor")
        figure.figcaption("The ring marks the stop chosen above the map.")

    def faq(self, main_content):
        section = main_content.section(id="faq", class_="stack")
        section.h2("Frequently asked questions")
        toggle = section.div()
        toggle.input(type="checkbox", value="^.faq_open", id="faq-open")
        toggle.html_label("Open all answers", for_="faq-open")
        for question, answer in QUESTIONS:
            details = section.details(class_="card", open="^.faq_open")
            details.summary(question)
            details.p(answer)
