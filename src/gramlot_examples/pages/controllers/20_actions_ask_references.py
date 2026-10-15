from gramlot import Page as BasePage


class Page(BasePage):
    title = "Actions, confirmations and references"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack", datapath="buttons")
        pane.h1("One action, with or without a question")
        pane.dataSetter(".name", "Ada")
        pane.dataSetter(".confirm", True)
        pane.dataSetter(".result", "No action yet")
        pane.html_label("Ask before running", for_="confirm-needed")
        pane.input(id="confirm-needed", type="checkbox", value="^.confirm")
        pane.button("Run action", id="action", name="=.name",
                    action="this.SET('.result', 'Hello ' + name)")
        pane.button("Ask for a name", id="action-ask", name="=.name",
                    action="this.SET('.result', 'Hello ' + name)",
                    ask=dict(title="Greeting", fields=[dict(name="name", lbl="Name", required=True)]))
        pane.button("Conditional action", id="conditional-action", name="=.name", confirm_needed="=.confirm",
                    action="this.SET('.result', 'Hello ' + name)", ask="Send this greeting?",
                    _ask_if="confirm_needed")
        pane.button("Conditional controller", id="conditional-controller").dataController(
            func="greet", name="=.name", confirm_needed="=.confirm",
            _ask="Send this greeting?", _ask_if="confirm_needed")
        pane.button("Conditional fields", id="conditional-fields", name="=.name", confirm_needed="=.confirm",
                    action="this.SET('.result', 'Hello ' + name)",
                    ask=dict(title="Greeting", _if="confirm_needed", fields=[dict(name="name", lbl="Name")]))
        pane.button("Legacy askIf", id="legacy-askif", name="=.name",
                    action="this.SET('.result', 'Hello ' + name)",
                    ask=dict(msg="askIf=false alone still asks in legacy semantics.", askIf="false"))
        pane.p("^.result", id="result")
        pane.h2("Pass the element, without looking up an ID")
        target = pane.p("Original text", id="reference-target")
        pane.button("Use Source reference", id="source-reference").dataController(func="changeSource", target=target)
        pane.button("Read DOM reference", id="dom-reference").dataController(
            func="describeDom", target=target.builder.reference(target, kind="dom"))
        pane.p("^.reference", id="reference-result")
