from gramlot import Page as BasePage


class Page(BasePage):
    title = "Publish and subscribe"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack", datapath="messages")
        pane.h1("The same action, two entry points")
        pane.p("Compare the direct controller with a page topic. Both update the same summary.")
        pane.dataSetter(".text", "Hello")
        pane.html_label("Message", for_="message")
        pane.input(id="message", value="^.text", live=True)
        pane.button("Direct controller", id="direct").dataController(func="save", text="=.text")
        pane.button("Publish", id="publish").dataController(func="publishMessage", text="=.text")
        pane.dataController(func="save", subscribe_saved=True)
        pane.p("^.summary", id="summary")
        pane.button("Ask, then publish", id="ask").dataController(
            func="publishMessage", _ask=dict(title="Message", fields=[dict(name="text", lbl="Message", required=True)]),
            text="=.text")
        pane.h2("Two independent receivers")
        for name in ("left", "right"):
            box = pane.section(class_="card stack", datapath=f".{name}")
            box.h3(name.title())
            target = box.dataController(func="receive", selfsubscribe_refresh=True)
            box.button(f"Send to {name}", id=f"send-{name}").dataController(func="sendToNode", target=target, text="=.text")
            box.p("^.received", id=f"received-{name}")
            box.dataSetter(".text", f"Hello {name}")
