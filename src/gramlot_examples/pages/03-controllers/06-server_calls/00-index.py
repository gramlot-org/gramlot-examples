"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Calling the server'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Expose an endpoint and call it from the browser. Compare calls triggered by a value change with calls triggered by an explicit button click.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Endpoint')
        item.p('dataRpc calls an endpoint of the page and writes the value at its result path.')
        item = lessons.li()
        item.strong('Call on change')
        item.p('dataRpc follows a ^ argument, with _delay, _onCalling and _onResult.')
        item = lessons.li()
        item.strong('Call on click')
        item.p('A dataRpc nested in a button, with _onError for a failing and a protected endpoint.')
