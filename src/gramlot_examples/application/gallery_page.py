"""Invoice application navigation on the shared gallery shell."""
from genro_bag import Bag
from gramlot_examples.gallery.page import Page as GalleryPage
from gramlot_examples import navigation_directory


class Page(GalleryPage):
    title = 'Application gallery · Invoice'

    @property
    def navigation(self):
        node = navigation_directory(catalogs=self.catalogs).get_node('application-invoice')
        result = Bag()
        result.set_item(node.label, node.value, **node.attr)
        return result
