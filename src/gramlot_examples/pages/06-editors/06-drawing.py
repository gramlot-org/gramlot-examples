from gramlot import Page as BasePage


IMAGE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="white"/><path d="M80 80H720V420H80Z M400 80V280 M80 280H720" fill="none" stroke="%23334155" stroke-width="8"/></svg>'


class Page(BasePage):
    def main(self, root):
        pane = root.div(datapath="drawing")
        pane.drawingPane(image=IMAGE, annotations="^.annotations", height="480px")
