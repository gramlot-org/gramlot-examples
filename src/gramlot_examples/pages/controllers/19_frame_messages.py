from gramlot import Page as BasePage


class Page(BasePage):
    title = "Parent and child messages"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack", datapath="frames")
        pane.h1("Parent and child messages")
        pane.dataSetter(".child", False)
        pane.dataSetter(".text", "Hello")
        pane.html_label("Message", for_="message")
        pane.input(id="message", value="^.text", live=True)
        parent = pane.section(hidden="^.child")
        frame = parent.iframe(id="detail", title="Child page", src="^.frame_url", class_="frame-preview")
        parent.button("Send to child", id="send-child").dataController(func="sendChild", target=frame, text="=.text")
        pane.button("Reply to parent", id="reply").dataController(func="reply", text="=.text", child="=.child")
        pane.p("^.received", id="received")
        pane.dataController(func="receive", subscribe_message=True)
        pane.dataController(func="setup", _onStart=True)
