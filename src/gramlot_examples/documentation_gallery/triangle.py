def triangle(pane, base, height, color):
    pane.input(type="number", value="^.base", lbl="Base",
               default=base, min=0, max=10, step=1)
    pane.input(type="number", value="^.height", lbl="Height",
               default=height, min=0, max=10, step=1)
    pane.input(type="color", value="^.color", lbl="Color", default=color)

    pane.dataFormula(
        ".area", "base * height / 2",
        base="^.base", height="^.height", _init=True,
    )
    pane.div("^.area", lbl="Area", lbl_variant="card", class_="result")

    drawing = pane.svg(viewBox="-1 -1 12 12", role="img",
                       aria_label="Triangle", class_="triangle-svg")
    drawing.polygon(
        points="^.base:0,0 {},0 0,{height}",
        height="^.height", fill="^.color",
        transform="translate(0 10) scale(1 -1)",
    )
