from gramlot import Page as BasePage


class Page(BasePage):
    title = "Lifecycle"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="lifecycle")
        pane.h1("Lifecycle")
        pane.p("Follow initialization, building, starting and removal of one branch.")
        actions = pane.div(class_="actions")
        for label, method in (("Freeze", "freeze"), ("Thaw", "thaw"),
                              ("Inspect Source and DOM", "inspect"), ("Remove branch", "remove")):
            actions.button(label, id=method, type="button").dataController(func=method)
        for label, key in (("Hook trace", "trace"), ("Data ticks", "ticks"), ("Lookup", "lookup")):
            pane.h2(label)
            pane.p(f"^.{key}", id=key)
        observed = pane.section(node_id="observed", id="observed", class_="card stack")
        observed.h2("Observed branch")
        observed.p("^.ticks", id="branch-ticks")
        for hook, stage in (("_init", "init"), ("_onBuilt", "built"), ("_onStart", "start")):
            observed.dataController(func="record", stage=stage, **{hook: True})
        observed.dataController(func="tick", _timing=1, _onStart=True)
        pane.dataSetter(".trace", "")
        pane.dataSetter(".ticks", 0)
        pane.dataSetter(".lookup", "Press Inspect")
