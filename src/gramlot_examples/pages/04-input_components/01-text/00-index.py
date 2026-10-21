"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Text inputs'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Edit a short value, a longer note or a password. Compare the shared labels and the relationship between an input and its bound Data value.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Textbox and labelbox')
        item.p('Two textboxes share a customer name. Type in either one, switch live editing off and on, and move the label without rebuilding the field.')
        item = lessons.li()
        item.strong('Multiline text and labelbox')
        item.p('Two multiline fields share one note. Switch live editing and move the label while keeping the text and selection.')
        item = lessons.li()
        item.strong('Password and labelbox')
        item.p('Two password fields share a sample value. The browser masks the characters; changing either field updates the other.')
