from gramlot import Page as BasePage


class Page(BasePage):
    title = "SVG shapes with binding"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="shapes")
        pane.h1("SVG shape vocabulary, bound")
        pane.p("The six shapes of HTML / SVG example 08. Their size, stroke, color and label come from the Data.")
        controls = pane.form(class_="card stack")
        for label, key, low, high in (("Rectangle width", "width", 20, 95), ("Circle radius", "radius", 10, 45),
                                      ("Ellipse height", "ry", 10, 45), ("Stroke width", "stroke", 1, 14)):
            controls.html_label(label, for_=key)
            controls.input(type="range", min=low, max=high, value=f"^.{key}", live=True, id=key)
        controls.html_label("Triangle color", for_="triangle")
        controls.input(type="color", value="^.triangle", id="triangle")
        controls.html_label("Label", for_="label")
        controls.input(value="^.label", live=True, id="label")

        figure = pane.figure(class_="card")
        art = figure.svg(viewBox="0 0 480 200", role="img", aria_labelledby="shapes-title", class_="example-art")
        art.title("Six geometric shapes", id="shapes-title")
        art.rect(x=15, y=20, width="^.width", height=75, rx=14, fill="var(--gramlot-action)", id="rect")
        art.circle(cx=172, cy=58, r="^.radius", fill="var(--gramlot-warning)", id="circle")
        art.ellipse(cx=263, cy=58, rx=26, ry="^.ry", fill="var(--gramlot-selected)", id="ellipse")
        art.line(x1=294, y1=20, x2=315, y2=98, stroke="currentColor", stroke_width="^.stroke", stroke_linecap="round")
        art.polyline(points="325,95 345,25 365,70 385,25 405,95", fill="none", stroke="var(--gramlot-success)",
                     stroke_width="^.stroke", stroke_linejoin="round", id="polyline")
        art.polygon(points="430,95 450,20 470,95", fill="^.triangle", id="polygon")
        art.text("^.label", x=18, y=150, fill="currentColor", font_size=17, id="caption")
        figure.figcaption("The shape attributes are pointers into the Data.")

        pane.dataSetter(".width", 95)
        pane.dataSetter(".radius", 38)
        pane.dataSetter(".ry", 38)
        pane.dataSetter(".stroke", 7)
        pane.dataSetter(".triangle", "#456bc4")
        pane.dataSetter(".label", "rectangle · circle · ellipse · line · polyline · polygon")
