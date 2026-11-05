from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.h1('3D')
        root.p('Choose categorical bars or numeric coordinates. 3D uses WebGL and the same Data/configuration contract.')
