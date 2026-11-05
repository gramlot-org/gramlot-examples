from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.input(value="^message", default="Hello, Gramlot!", live=True, lbl="Message")
        root.input(type="range", min=0.2, max=1, step=0.1,
                   value="^opacity", default=1, live=True, lbl="Opacity")
        root.p("^message", title="^message", opacity="^opacity", font_size="48px")
