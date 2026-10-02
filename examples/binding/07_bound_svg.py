from gramlot import Page as BasePage


class Page(BasePage):
    title = "Bound SVG"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="drawing")
        pane.h1("Bound SVG")

        controls = pane.form(class_="card stack")
        controls.html_label("Radius", for_="radius")
        controls.input(type="range", min=5, max=80, value="^.radius", live=True, id="radius")
        controls.html_label("Circle fill", for_="fill")
        controls.input(type="color", value="^.fill", id="fill")
        controls.html_label("Bar width", for_="width")
        controls.input(type="range", min=10, max=260, value="^.width", live=True, id="width")
        controls.html_label("Bar fill", for_="bar")
        controls.input(type="color", value="^.bar", id="bar")

        figure = pane.figure(class_="card")
        art = figure.svg(viewBox="0 0 480 200", role="img", aria_label="A circle and a bar", class_="example-art")
        art.circle(cx=100, cy=100, r="^.radius", fill="^.fill", id="circle")
        art.rect(x=200, y=80, height=40, rx=6, width="^.width", fill="^.bar", id="bar-shape")
        art.text("^.radius", x=100, y=190, text_anchor="middle", fill="currentColor", id="radius-label")
        figure.figcaption("The circle and the bar read their geometry and paint from the Data.")

        pane.dataSetter(".radius", 40)
        pane.dataSetter(".fill", "#ffc400")
        pane.dataSetter(".width", 160)
        pane.dataSetter(".bar", "#456bc4")
