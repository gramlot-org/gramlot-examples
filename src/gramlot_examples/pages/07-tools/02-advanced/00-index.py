from gramlot import Page as BasePage


class Page(BasePage):
    title = "Advanced tools"

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1("Advanced tools")
        main_content.p("Explore upload queues, attachments and editable images.")
