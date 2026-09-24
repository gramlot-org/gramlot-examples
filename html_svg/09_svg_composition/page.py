from gramlot import Page as BasePage


class Page(BasePage):
    title = "SVG composition"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        page = root.main(class_="example-page stack")
        page.h1("Compose a small SVG scene")
        page.p("Groups and loops arrange repeated Source nodes in a single viewport.")
        figure = page.figure(class_="card")
        drawing = figure.svg(viewBox="0 0 560 240", role="img", aria_labelledby="scene-title", class_="example-art")
        drawing.title("A row of houses and trees in a garden", id="scene-title")
        drawing.rect(x=0, y=0, width=560, height=240, fill="var(--gramlot-surface-subtle)")
        drawing.rect(x=0, y=177, width=560, height=63, fill="var(--gramlot-border)")
        for x in (115, 330):
            self.house(drawing, x)
        for x in (40, 260, 505):
            self.tree(drawing, x)
        for x, color in ((74, "var(--gramlot-action)"), (282, "var(--gramlot-warning)"), (465, "var(--gramlot-brand-blue)")):
            self.flower(drawing, x, color)
        figure.figcaption("House, tree and flower methods compose one scene through groups and loops.")

    def house(self, drawing, x):
        group = drawing.g(transform=f"translate({x} 0)")
        group.rect(x=0, y=92, width=125, height=85, fill="var(--gramlot-surface)", stroke="var(--gramlot-action)", stroke_width=3)
        group.path(d="M-10 92 L62 42 L135 92 Z", fill="var(--gramlot-action)")
        group.rect(x=47, y=127, width=30, height=50, fill="var(--gramlot-selected)")
        for window_x in (17, 91):
            group.rect(x=window_x, y=110, width=17, height=18, fill="var(--gramlot-brand-yellow)")

    def tree(self, drawing, x):
        group = drawing.g(transform=f"translate({x} 0)")
        group.rect(x=-4, y=103, width=8, height=74, fill="var(--gramlot-success)")
        for cx, cy in ((-14, 111), (12, 109), (0, 88)):
            group.circle(cx=cx, cy=cy, r=22, fill="var(--gramlot-success)")

    def flower(self, drawing, x, color):
        group = drawing.g(transform=f"translate({x} 0)")
        group.line(x1=0, y1=207, x2=0, y2=187, stroke="var(--gramlot-success)", stroke_width=3)
        for dx, dy in ((-7, 0), (7, 0), (0, -7), (0, 7)):
            group.circle(cx=dx, cy=184 + dy, r=6, fill=color)
        group.circle(cx=0, cy=184, r=4, fill="var(--gramlot-brand-yellow)")
