"""The site root of the hosted galleries: one tab per gallery, each an iframe on its mount."""
from gramlot import Page as BasePage

GALLERIES = (("gallery", "Gallery", "/gallery/"), ("chart_gallery", "Chart gallery", "/chart_gallery/"))


class Page(BasePage):
    title = "Gramlot galleries"

    def main(self, root):
        tabs = root.tabContainer(id="galleries", height="100vh", default_selected=0)
        for name, title, url in GALLERIES:
            pane = tabs.contentPane(pageName=name, title=title, overflow="hidden")
            pane.iframe(src=url, title=title, width="100%", height="100%", border=0)
