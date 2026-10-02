from gramlot import Page as BasePage

PLANS = (("basic", "Basic"), ("plus", "Plus"), ("team", "Team"))


class Page(BasePage):
    title = "Checkbox and radio"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="choice")
        pane.h1("Checkbox and radio")

        options = pane.fieldset(class_="card stack")
        options.legend("Options")
        for key, label in (("newsletter", "Newsletter"), ("invoice", "Paper invoice")):
            row = options.div()
            row.input(type="checkbox", value=f"^.{key}", id=key)
            row.html_label(label, for_=key)

        plans = pane.fieldset(class_="card stack")
        plans.legend("Plan")
        for key, label in PLANS:
            row = plans.div()
            row.input(type="radio", group="plan", value=f"^.plan.{key}", id=key)
            row.html_label(label, for_=key)

        values = pane.section(class_="card stack")
        values.h2("The Data")
        facts = values.dl()
        for key in ("newsletter", "invoice", "plan.basic", "plan.plus", "plan.team"):
            facts.dt(key)
            facts.dd(f"^.{key}", id=f"out-{key.replace('.', '-')}")

        pane.dataSetter(".newsletter", True)
        pane.dataSetter(".invoice", False)
        pane.dataSetter(".plan.plus", True)
