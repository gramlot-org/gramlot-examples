"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Events and lifecycle'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Observe user events and page lifecycle, react to attribute changes, and exchange messages. These lessons cover communication inside a page and between parent and child pages.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Events')
        item.p('connect_on<event> attributes for click, input, key and pointer events.')
        item = lessons.li()
        item.strong('Lifecycle')
        item.p('Core 0.2.0: observe hook order, freeze, removal and Source/DOM lookup.')
        item = lessons.li()
        item.strong('Attribute projection')
        item.p('Core 0.2.0 templates/masks, then the 0.2.3 sandboxed Data preview.')
        item = lessons.li()
        item.strong('Publish and subscribe')
        item.p('Core 0.2.18: revisit button actions with page topics, self receivers, references and native ask.')
        item = lessons.li()
        item.strong('Parent and child messages')
        item.p('Core 0.2.18: local-first publish and direct parent/child postMessage exchange.')
