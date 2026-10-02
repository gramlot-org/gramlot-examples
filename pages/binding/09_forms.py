from gramlot import Page as BasePage

RECORD = {"name": "Ada Lovelace", "quantity": 3, "accent": "#456bc4", "intensity": 60,
          "region": "south", "topics": ["html"], "note": "A native multiline field.", "updates": True}
SHOWN = ("name", "email", "search", "website", "telephone", "quantity", "date", "time", "month",
         "week", "accent", "intensity", "region", "topics", "note", "updates")


class Page(BasePage):
    title = "Forms with binding"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="form")
        pane.h1("Native form controls, bound")
        pane.p("The same fields as HTML / SVG example 06. Every value lives in the Data record on the right.")
        layout = pane.div(class_="bound-form")
        form = layout.form()
        identity = form.fieldset(class_="form-grid")
        identity.legend("Identity")
        self.field(identity, "Name", "name", "text", required=True)
        self.field(identity, "Email", "email", "email", placeholder="name@example.org")
        self.field(identity, "Search", "search", "search", placeholder="Find a topic")
        self.field(identity, "Website", "website", "url", placeholder="https://example.org")
        self.field(identity, "Telephone", "telephone", "tel", placeholder="+1 555 0100")
        self.field(identity, "Password", "password", "password", minlength=8)

        choices = form.fieldset(class_="form-grid")
        choices.legend("Choices and ranges")
        self.field(choices, "Quantity", "quantity", "number", min=1, max=20)
        self.field(choices, "Date", "date", "date")
        self.field(choices, "Time", "time", "time")
        self.field(choices, "Month", "month", "month")
        self.field(choices, "Week", "week", "week")
        self.field(choices, "Accent", "accent", "color")
        self.field(choices, "Intensity", "intensity", "range", min=0, max=100, step=5, live=True)
        choices.html_label("Region", for_="region")
        select = choices.select(id="region", name="region", value="^.region")
        for value in ("North", "South", "West"):
            select.option(value, value=value.lower())
        choices.html_label("Topics (multiple)", for_="topics")
        topics = choices.select(id="topics", name="topics", multiple=True, size=3, value="^.topics")
        for topic in ("HTML", "SVG", "Source"):
            topics.option(topic, value=topic.lower())
        choices.html_label("Note", for_="note")
        choices.textarea(id="note", name="note", rows=3, value="^.note")

        options = form.fieldset(class_="form-options")
        options.legend("Flags and states")
        options.html_label("Receive updates", for_="updates")
        options.input(type="checkbox", id="updates", name="updates", value="^.updates")
        for value in ("daily", "weekly"):
            options.html_label(value.title(), for_=value)
            options.input(type="radio", id=value, group="frequency", value=f"^.frequency.{value}")
        options.html_label("Read-only code", for_="code")
        options.input(type="text", id="code", value="DEMO-01", readonly=True)
        options.html_label("Unavailable choice", for_="unavailable")
        options.input(type="text", id="unavailable", value="Disabled", disabled=True)
        options.html_label("Attachment", for_="attachment")
        options.input(type="file", id="attachment", name="attachment")
        form.button("Submit unavailable", type="submit", disabled=True)

        record = layout.aside(class_="card stack")
        record.h2("The Data record")
        facts = record.dl()
        for key in SHOWN:
            facts.dt(key)
            facts.dd(f"^.{key}", id=f"out-{key}")
        facts.dt("frequency.weekly")
        facts.dd("^.frequency.weekly", id="out-weekly")

        pane.dataSetter("form", RECORD)
        pane.dataSetter(".frequency.weekly", True)

    def field(self, parent, label, key, kind, **attrs):
        parent.html_label(label, for_=key)
        parent.input(type=kind, id=key, name=key, value=f"^.{key}", **attrs)
