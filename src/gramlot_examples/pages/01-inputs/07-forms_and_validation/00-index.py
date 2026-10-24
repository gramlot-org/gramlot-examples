"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Forms and validation'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Arrange fields into a form, share label settings and group related values. Add validation rules and callbacks, then try both accepted and rejected edits.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Required values and length')
        item.p('Invalid drafts remain visible with a message while Data keeps the last accepted value.')
        item = lessons.li()
        item.strong('Formlet and shared labels')
        item.p('Arrange fields in columns and share label settings. Changing the layout preserves each field and its draft.')
        item = lessons.li()
        item.strong('GroupBox and typed copy')
        item.p('Group customer data under a heading. Copy TYTX with its types or choose plain JSON from the copy menu.')
        item = lessons.li()
        item.strong('Validation rules and callbacks')
        item.p('Transformations, conditions, warnings, local callbacks and remote validation.')
