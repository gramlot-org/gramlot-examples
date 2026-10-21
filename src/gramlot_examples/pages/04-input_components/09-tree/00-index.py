from gramlot import Page as BasePage

class Page(BasePage):
    title = "Bag trees"
    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1("Bag trees")
        main_content.p("A tree always displays a Bag. Explore lazy branches and scalar values, node and caption classes, then computed text, explicit HTML labels and custom icons.")
        main_content.p("Expand this group and choose Bag tree, Tree labels and classes, Tree callbacks, HTML and icons, or Internal tree drag and drop.")
