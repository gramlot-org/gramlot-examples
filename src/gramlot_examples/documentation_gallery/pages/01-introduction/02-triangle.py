from gramlot import Page as BasePage


class Page(BasePage):
    title = "A triangle"

    def main(self, root):
        panel = root.div(class_="single-demo")
        fields = panel.div(class_="single-fields")
        fields.input(type="number", value="^triangle.base", lbl="Base",
                     default=8, min=0, max=10)
        fields.input(type="number", value="^triangle.height", lbl="Height",
                     default=6, min=0, max=10)
        fields.input(type="color", value="^triangle.color", lbl="Color",
                     default="#3366cc")
        fields.dataFormula("triangle.area", "base * height / 2",
                           base="^triangle.base", height="^triangle.height", _init=True)
        fields.div("^triangle.area", lbl="Area", lbl_variant="card", class_="single-area")
        drawing = panel.svg(viewBox="-1 -1 12 12", role="img",
                            aria_label="Triangle", class_="single-svg")
        drawing.polygon(points="^triangle.base:0,0 {},0 0,{height}",
                        height="^triangle.height", fill="^triangle.color",
                        transform="translate(0 10) scale(1 -1)")
