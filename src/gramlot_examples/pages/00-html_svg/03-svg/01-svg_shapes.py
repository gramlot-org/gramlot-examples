from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        drawing = root.svg(viewBox="0 0 200 100", width="300", role="img", aria_label="A circle and a rectangle")
        drawing.circle(cx=50, cy=50, r=30, fill="red")
        drawing.rect(x=110, y=20, width=60, height=60, fill="navy")
