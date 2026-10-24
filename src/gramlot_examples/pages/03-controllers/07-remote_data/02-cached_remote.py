from gramlot import Page as BasePage
from gramlot import source

PRODUCTS = {
    "lamp": {"name": "Lamp", "category": "lighting"},
    "spot": {"name": "Spotlight", "category": "lighting"},
    "chair": {"name": "Chair", "category": "seating"},
}
RULES = {"lighting": "Ships in two days, bulbs not included.", "seating": "Ships in a week, assembly required."}
ON_REMOTE = "this.SET('mounts', (this.GET('mounts') ?? 0) + 1); this.SET('status', 'Mounted the ' + category + ' rules')"


class Page(BasePage):
    title = "Cached remote"

    def main(self, root):
        pane = root.div(class_="example-page stack")
        pane.h1("Cached remote")
        pane.html_label("Product", for_="product")
        choice = pane.select(id="product", value="^current", default='products.lamp')
        for key, product in PRODUCTS.items():
            choice.option(product["name"], value=f"products.{key}")

        card = pane.article(datapath="^current", class_="card stack")
        card.h2("^.name", id="name")
        rules = card.div("Waiting for the server", id="rules")
        rules.remote("rules", category="^.category", _cachedRemote=True, _onRemote=ON_REMOTE)

        facts = pane.dl()
        for label, key in (("Mounted fragments", "mounts"), ("Status", "status")):
            facts.dt(label)
            facts.dd(f"^{key}", id=key)


    @source
    def rules(self, root, category, **kwargs):
        root.p(RULES[category], id="rule")
