from gramlot import Page as BasePage


# These browser actions change Source, never DOM elements.
ACTIONS = {
    'add': "window.gramlot.builder.wrapSource(window.gramlot.source.getNode('main.page.work.items')).li('A new item', {class: 'card'})",
    'remove': "const items = window.gramlot.source.getItem('main.page.work.items'); const last = items.getNodes().at(-1); if (last) items.popNode(last.label)",
    'clear': "window.gramlot.source.getItem('main.page.work.items').clear()",
    'rename': "window.gramlot.source.getNode('main.page.heading').setValue('Source is alive!')",
    'color': "window.gramlot.source.getNode('main.page.motion.scene.ball').setAttr({fill: 'var(--gramlot-warning)'})",
    'stop': "window.gramlot.source.getItem('main.page').popNode('motion')",
}

ANIMATION = """queueMicrotask(() => {
    const app = window.gramlot;
    const motion = app.source.getNode('main.page.motion');
    const ball = app.source.getNode('main.page.motion.scene.ball');
    const timer = setInterval(() => {
        ball.setAttr({cx: 160 + 110 * Math.sin(performance.now() / 700)});
    }, 50);
    app.renderer.onDispose(motion, () => clearInterval(timer));
});"""


class Page(BasePage):
    title = "Live Source playground"
    css = ("/themes/gramlot-base/theme.css", "/examples/html_svg/13_live_source/style.css")

    def main(self, root):
        page = root.main(node_label="page", class_="example-page stack")
        page.h1("Live Source playground", node_label="heading")
        page.p("Create and remove items, change text and watch SVG move. Every change goes through Source.")
        self.workspace(page)
        self.motion(page)
        page.p("Reload to restore the initial page. Changes are local to this browser page.", class_="muted")
        page.script(ANIMATION)

    def button(self, root, title, action):
        root.button(title, type="button", onclick=ACTIONS[action])

    def workspace(self, page):
        work = page.section(node_label="work", class_="card stack")
        work.h2("Build a list live")
        work.p("The first two items are authored by a loop. Add item uses the browser Builder to create another li.")
        toolbar = work.div(class_="live-toolbar")
        for title, action in (("Add item", "add"), ("Remove last", "remove"), ("Clear list", "clear"), ("Change heading", "rename")):
            self.button(toolbar, title, action)
        items = work.ul(node_label="items", class_="live-items")
        for title in ("Explore the Source", "Try a live change"):
            items.li(title, class_="card")

    def motion(self, page):
        motion = page.section(node_label="motion", class_="card stack")
        motion.h2("An animated Source attribute")
        motion.p("Every 50 ms, setInterval changes the circle's cx attribute in Source. Gramlot projects it into SVG.")
        scene = motion.svg(node_label="scene", viewBox="0 0 320 100", role="img", aria_label="A circle moving from side to side")
        scene.line(x1=30, y1=50, x2=290, y2=50, stroke="var(--gramlot-action)", stroke_width=2)
        scene.circle(node_label="ball", cx=160, cy=50, r=16, fill="var(--gramlot-action)")
        toolbar = motion.div(class_="live-toolbar")
        self.button(toolbar, "Change ball color", "color")
        self.button(toolbar, "Remove animation", "stop")
        motion.p("Removing this section also clears its interval through renderer.onDispose.", class_="muted")
