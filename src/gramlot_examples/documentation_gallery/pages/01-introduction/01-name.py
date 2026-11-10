from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.input(value="^example.name", lbl="Name", lbl_position="L")
        root.div("^example.name", lbl="Your name", lbl_variant="card",
                 font_size="24px", text_align="center")
