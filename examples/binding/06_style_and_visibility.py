from gramlot import Page as BasePage

CHOICES = (
    ("Class", "tone", ("card", "card status status--success", "card status status--warning")),
    ("Font size", "size", ("1rem", "1.5rem", "2rem")),
    ("Corners (rounded)", "radius", ("0", "8px", "24px")),
)


class Page(BasePage):
    title = "Style and visibility"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="look")
        pane.h1("Style and visibility")

        controls = pane.form(class_="card stack")
        for label, key in (("visible", "show"), ("hidden", "hide")):
            row = controls.div()
            row.input(type="checkbox", value=f"^.{key}", id=key)
            row.html_label(label, for_=key)
        for label, key in (("Text color", "color"), ("Background color", "background")):
            controls.html_label(label, for_=key)
            controls.input(type="color", value=f"^.{key}", id=key)
        for label, key, options in CHOICES:
            controls.html_label(label, for_=key)
            select = controls.select(value=f"^.{key}", id=key)
            for option in options:
                select.option(option, value=option)
        controls.html_label("style", for_="style")
        controls.input(value="^.style", id="style")

        stage = pane.div(class_="stack")
        stage.p("The box keeps its place when it is not visible.", class_="muted")
        stage.div("A styled box", id="box", class_="^.tone", style="^.style",
                  color="^.color", background_color="^.background", font_size="^.size",
                  rounded="^.radius", padding="1rem", visible="^.show", hidden="^.hide")
        stage.p("This line follows the box.", class_="muted")

        pane.dataSetter(".show", True)
        pane.dataSetter(".hide", False)
        pane.dataSetter(".color", "#ffffff")
        pane.dataSetter(".background", "#456bc4")
        pane.dataSetter(".tone", "card")
        pane.dataSetter(".size", "1.5rem")
        pane.dataSetter(".radius", "8px")
        pane.dataSetter(".style", "border: 4px dashed #ffc400")
