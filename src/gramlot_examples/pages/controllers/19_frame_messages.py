from gramlot import Page as BasePage


class Page(BasePage):
    title = "Parent and child messages"

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="frames")
        main_content.h1("Parent and child messages")
        main_content.dataSetter(".child", False)
        main_content.dataSetter(".text", "Hello")
        main_content.html_label("Message", for_="message")
        main_content.input(id="message", value="^.text", live=True)
        parent = main_content.section(hidden="^.child")
        frame = parent.iframe(id="detail", title="Child page", src="^.frame_url", class_="frame-preview")
        parent.button("Send to child", id="send-child").dataController(func="sendChild", target=frame, text="=.text")
        main_content.button("Reply to parent", id="reply").dataController(func="reply", text="=.text", child="=.child")
        main_content.p("^.received", id="received")
        main_content.dataController(func="receive", subscribe_message=True)
        main_content.dataController(func="setup", _onStart=True)
