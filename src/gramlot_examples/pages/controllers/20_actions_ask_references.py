from gramlot import Page as BasePage


class Page(BasePage):
    title = "Actions, confirmations and references"

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="buttons")
        main_content.h1("One action, with or without a question")
        main_content.dataSetter(".name", "Ada")
        main_content.dataSetter(".confirm", True)
        main_content.dataSetter(".result", "No action yet")
        main_content.html_label("Ask before running", for_="confirm-needed")
        main_content.input(id="confirm-needed", type="checkbox", value="^.confirm")
        main_content.button("Run action", id="action", name="=.name",
                            action="this.SET('.result', 'Hello ' + name)")
        main_content.button("Ask for a name", id="action-ask", name="=.name",
                            action="this.SET('.result', 'Hello ' + name)",
                            ask=dict(title="Greeting", fields=[dict(name="name", lbl="Name", required=True)]))
        main_content.button("Conditional action", id="conditional-action", name="=.name", confirm_needed="=.confirm",
                            action="this.SET('.result', 'Hello ' + name)", ask="Send this greeting?",
                            _ask_if="confirm_needed")
        main_content.button("Conditional controller", id="conditional-controller").dataController(
            func="greet", name="=.name", confirm_needed="=.confirm",
            _ask="Send this greeting?", _ask_if="confirm_needed")
        main_content.button("Conditional fields", id="conditional-fields", name="=.name", confirm_needed="=.confirm",
                            action="this.SET('.result', 'Hello ' + name)",
                            ask=dict(title="Greeting", _if="confirm_needed", fields=[dict(name="name", lbl="Name")]))
        main_content.button("Legacy askIf", id="legacy-askif", name="=.name",
                            action="this.SET('.result', 'Hello ' + name)",
                            ask=dict(msg="askIf=false alone still asks in legacy semantics.", askIf="false"))
        main_content.p("^.result", id="result")
        main_content.h2("Pass the element, without looking up an ID")
        target = main_content.p("Original text", id="reference-target")
        main_content.button("Use Source reference", id="source-reference").dataController(func="changeSource", target=target)
        main_content.button("Read DOM reference", id="dom-reference").dataController(
            func="describeDom", target=target.builder.reference(target, kind="dom"))
        main_content.p("^.reference", id="reference-result")
