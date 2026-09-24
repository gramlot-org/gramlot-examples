from gramlot import Page as BasePage


class Page(BasePage):
    title = "SVG shapes"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        page = root.main(class_="example-page stack")
        page.h1("SVG shape vocabulary")
        page.p("One SVG viewport contains six native shapes and a text label.")
        figure = page.figure(class_="card")
        art = figure.svg(viewBox="0 0 480 200", role="img", aria_labelledby="shapes-title", class_="example-art")
        art.title("Six geometric shapes", id="shapes-title")
        art.rect(x=15, y=20, width=95, height=75, rx=14, fill="var(--gramlot-action)")
        art.circle(cx=172, cy=58, r=38, fill="var(--gramlot-warning)")
        art.ellipse(cx=263, cy=58, rx=26, ry=38, fill="var(--gramlot-selected)")
        art.line(x1=294, y1=20, x2=315, y2=98, stroke="currentColor", stroke_width=8, stroke_linecap="round")
        art.polyline(points="325,95 345,25 365,70 385,25 405,95", fill="none", stroke="var(--gramlot-success)", stroke_width=7, stroke_linejoin="round")
        art.polygon(points="430,95 450,20 470,95", fill="var(--gramlot-brand-blue)")
        art.text("rectangle · circle · ellipse · line · polyline · polygon", x=18, y=150, fill="currentColor", font_size=17)
        figure.figcaption("The shape attributes are part of the Source tree.")
