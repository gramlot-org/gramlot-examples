from gramlot import Page as BasePage

PLANS = (("basic", "Basic"), ("plus", "Plus"), ("team", "Team"))


class Page(BasePage):
    title = "Bind boolean and single-choice values"

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="choice")

        work = pane.div(class_="grid lesson-workbench")
        options = work.fieldset(class_="card stack")
        options.legend("Options")
        for key, label in (("newsletter", "Newsletter"), ("invoice", "Paper invoice")):
            row = options.div()
            row.input(type="checkbox", value=f"^.{key}", id=key)
            row.html_label(label, for_=key)

        plans = work.fieldset(class_="card stack")
        plans.legend("Plan")
        for key, label in PLANS:
            row = plans.div()
            row.input(type="radio", group="plan", value=f"^.plan.{key}", id=key)
            row.html_label(label, for_=key)

        values = work.section(class_="card stack")
        values.h2("The Data")
        facts = values.dl()
        for key in ("newsletter", "invoice", "plan.basic", "plan.plus", "plan.team"):
            facts.dt(key)
            facts.dd(f"^.{key}", id=f"out-{key.replace('.', '-')}")
