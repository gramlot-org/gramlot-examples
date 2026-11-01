from gramlot import Page as BasePage


# These browser actions change Source, never DOM elements. `this` is the button node; its builder holds the Source.
ACTIONS = {
    'add': "this.builder.wrapSource(this.builder.source.getNode('main.main_content.work.items')).li('A new item', {class: 'card'})",
    'remove': "const items = this.builder.source.getItem('main.main_content.work.items'); const last = items.getNodes().at(-1); if (last) items.popNode(last.label)",
    'clear': "this.builder.source.getItem('main.main_content.work.items').clear()",
    'rename': "this.builder.source.getNode('main.main_content.heading').setValue('Source is alive!')",
    'color': "this.builder.source.getNode('main.main_content.motion.scene.ball').setAttr({fill: 'var(--gramlot-warning)'})",
    'stop': "this.builder.source.getItem('main.main_content').popNode('motion')",
}


class Page(BasePage):
    title = "Live Source playground"

    def main(self, root):
        main_content = root.main(node_label="main_content", class_="example-page stack")
        main_content.h1("Editable heading", node_label="heading")
        self.workspace(main_content)
        self.motion(main_content)

    def action_button(self, root, title, action):
        root.html_button(title, type="button", connect_onclick=ACTIONS[action])

    def workspace(self, main_content):
        work = main_content.section(node_label="work", class_="card stack")
        work.h2("Build a list live")
        toolbar = work.div(class_="live-toolbar")
        for title, action in (("Add item", "add"), ("Remove last", "remove"), ("Clear list", "clear"), ("Change heading", "rename")):
            self.action_button(toolbar, title, action)
        items = work.ul(node_label="items", class_="live-items")
        for title in ("Explore the Source", "Try a live change"):
            items.li(title, class_="card")

    def motion(self, main_content):
        motion = main_content.section(node_label="motion", class_="card stack")
        motion.h2("An animated Source attribute")
        motion.dataController(func="animate", _timing=0.05)
        scene = motion.svg(node_label="scene", viewBox="0 0 320 100", role="img", aria_label="A circle moving from side to side")
        scene.line(x1=30, y1=50, x2=290, y2=50, stroke="var(--gramlot-action)", stroke_width=2)
        scene.circle(node_label="ball", cx=160, cy=50, r=16, fill="var(--gramlot-action)")
        toolbar = motion.div(class_="live-toolbar")
        self.action_button(toolbar, "Change ball color", "color")
        self.action_button(toolbar, "Remove animation", "stop")
