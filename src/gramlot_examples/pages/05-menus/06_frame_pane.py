from gramlot import Page as BasePage
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot_examples.collections.menu_trial import mygramlot


class Page(BasePage):
    title = "FramePane regions and command recipients"
    gramlots = [layout, mygramlot]

    def main(self, root):
        main_content = root.main(padding="16px")
        main_content.h1("FramePane: regions and a central recipient")
        main_content.p("The frame reuses borderContainer layout. Regions appear only when accessed; none creates a toolbar automatically.")
        frame = main_content.framePane(height="520px", node_label="outer_frame")
        self.region_tools(frame)
        center = frame.center.contentPane(frameTarget=True, node_label="outer_editor", padding="12px",
            selfsubscribe_save="receive", selfsubscribe_undo="receive")
        center.h2("CENTER — outer_editor")
        center.p("^outerResult", role="status", id="frame-outer-result", overflow_wrap="anywhere")
        center.p("Commands from the outer bars reach this content. Try Shift+click.")
        self.nested_frame(center)

    def region_tools(self, frame):
        frame.top.set_attr(dict(height="84px", background="var(--gramlot-field-background)"))
        frame.left.set_attr(dict(width="200px", background="var(--gramlot-field-background)"))
        frame.right.set_attr(dict(width="135px", background="var(--gramlot-field-background)"))
        frame.bottom.set_attr(dict(height="42px", background="var(--gramlot-field-background)"))
        frame.top.menu(presentation="bar").menuline("documenti:save", caption="Top bar 1", node_label="top_save", parameters=dict(id=1))
        frame.top.menu(presentation="bar").menuline("documenti:undo", caption="Top bar 2", parameters=dict(id=1))
        frame.left.menu(presentation="bar", orientation="vertical").menuline("documenti:save", caption="Left A", parameters=dict(id=1))
        frame.left.menu(presentation="bar", orientation="vertical").menuline("documenti:undo", caption="Left B", parameters=dict(id=1))
        info = frame.right.contentPane(padding="8px")
        info.p("RIGHT")
        info.p("Ordinary content. No automatic bar.")
        frame.bottom.menu(presentation="bar").menuline("documenti:save", caption="Bottom", parameters=dict(id=1))

    def nested_frame(self, center):
        inner = center.framePane(height="170px", node_label="inner_frame")
        inner.top.menu(presentation="bar").menuline("documenti:save", caption="Inner Save", node_label="inner_save", parameters=dict(id=2))
        recipient = inner.center.contentPane(frameTarget=True, node_label="inner_editor", padding="8px", selfsubscribe_save="receive")
        recipient.h3("Nested frame — inner_editor")
        recipient.p("^innerResult", role="status", id="frame-inner-result", overflow_wrap="anywhere")
