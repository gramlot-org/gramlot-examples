from gramlot import Page as BasePage


class Page(BasePage):
    title = "Publish and subscribe"

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="messages")
        main_content.h1("The same action, two entry points")
        main_content.p("Compare the direct controller with a page topic. Both update the same summary.")
        main_content.dataSetter(".text", "Hello")
        main_content.html_label("Message", for_="message")
        main_content.input(id="message", value="^.text", live=True)
        main_content.button("Direct controller", id="direct").dataController(func="save", text="=.text")
        main_content.button("Publish", id="publish").dataController(func="publishMessage", text="=.text")
        main_content.dataController(func="save", subscribe_saved=True)
        main_content.p("^.summary", id="summary")
        main_content.button("Ask, then publish", id="ask").dataController(
            func="publishMessage", _ask=dict(title="Message", fields=[dict(name="text", lbl="Message", required=True)]),
            text="=.text")
        main_content.h2("Two independent receivers")
        for name in ("left", "right"):
            box = main_content.section(class_="card stack", datapath=f".{name}")
            box.h3(name.title())
            target = box.dataController(func="receive", selfsubscribe_refresh=True)
            box.button(f"Send to {name}", id=f"send-{name}").dataController(func="sendToNode", target=target, text="=.text")
            box.p("^.received", id=f"received-{name}")
            box.dataSetter(".text", f"Hello {name}")
