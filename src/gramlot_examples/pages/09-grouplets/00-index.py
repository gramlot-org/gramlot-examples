from gramlot import Page as BasePage


class Page(BasePage):
    title = "Grouplets"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1(self.title)
        main_content.p('Use grouplets to adapt a customer editor, reuse billing and delivery addresses, and compose a service-site dossier, and review a complete order with independently foldable cards. The shipping desk adds meaningful menu actions and confirmed, scoped clearing. Edit realistic fields and inspect live previews; each lesson includes its Python @source methods. Customer handover adds contextual guides beside the fields, also on folded and nested cards.')
