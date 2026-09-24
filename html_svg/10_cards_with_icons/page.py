from gramlot import Page as BasePage


CARDS = (
    ("Structure", "Source describes the page tree.", "structure"),
    ("Drawing", "SVG sits naturally beside HTML.", "drawing"),
    ("Reading", "Semantic elements give content a role.", "reading"),
)


class Page(BasePage):
    title = "Cards with SVG icons"
    css = ("/themes/gramlot-base/theme.css", "/examples/html_svg/10_cards_with_icons/style.css")

    def main(self, root):
        page = root.main(class_="example-page stack")
        page.h1("Three ideas, three icons")
        page.p("The cards are ordinary articles. Each icon is nested native SVG.")
        cards = page.section(class_="grid icon-cards", aria_label="Gramlot concepts")
        for title, description, kind in CARDS:
            card = cards.article(class_="card stack")
            icon = card.svg(viewBox="0 0 64 64", width=64, height=64, aria_hidden="true")
            self.icon(icon, kind)
            card.h2(title)
            card.p(description)

    def icon(self, icon, kind):
        icon.rect(x=2, y=2, width=60, height=60, rx=16, fill="var(--gramlot-surface-subtle)")
        if kind == "structure":
            for x, y in ((18, 18), (36, 18), (27, 38)):
                icon.rect(x=x, y=y, width=11, height=11, rx=2, fill="var(--gramlot-action)")
        elif kind == "drawing":
            icon.circle(cx=32, cy=32, r=17, fill="none", stroke="var(--gramlot-warning)", stroke_width=5)
            icon.circle(cx=32, cy=32, r=5, fill="var(--gramlot-warning)")
        else:
            icon.path(d="M17 18h30v28H17z M25 26h14 M25 32h14 M25 38h10", fill="none", stroke="var(--gramlot-success)", stroke_width=3, stroke_linecap="round")
