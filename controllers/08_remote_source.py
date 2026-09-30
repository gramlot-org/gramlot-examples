from gramlot import Page as BasePage
from gramlot import source

TOPICS = {
    "binding": ("Binding", "Pointers connect the DOM to the Data in both directions."),
    "controllers": ("Controllers", "Formulas and controllers run code when the Data changes."),
    "svg": ("SVG", "SVG attributes follow the Data like HTML attributes."),
}


class Page(BasePage):
    title = "Remote Source"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="remote")
        pane.h1("Remote Source")
        pane.html_label("Topic", for_="topic")
        topic = pane.select(value="^.topic", id="topic")
        for key, (title, _) in TOPICS.items():
            topic.option(title, value=key)
        pane.button("Load from the server", id="load").dataController(func="load", topic="=.topic")
        target = pane.section(node_id="details", class_="card stack", id="details")
        target.p("Nothing loaded yet.", class_="muted")
        pane.dataSetter(".topic", "binding")

    @source
    def details(self, root, topic="binding"):
        title, summary = TOPICS[topic]
        branch = root.div(datapath=f"topics.{topic}", class_="stack")
        branch.h2("^.title", id="remote-title")
        branch.p("^.summary", id="remote-summary")
        branch.dataSetter(".title", title)
        branch.dataSetter(".summary", summary)
