from gramlot import Page as BasePage


class Page(BasePage):
    title = "Native form controls"
    css = ("/themes/gramlot-base/theme.css", "/examples/html_svg/06_forms/style.css")

    def main(self, root):
        page = root.main(class_="example-page stack")
        page.h1("Native form controls")
        page.p("Try the controls, then use Reset to restore their initial values. Submit is disabled in this static example.")
        form = page.form()
        identity = form.fieldset(class_="form-grid")
        identity.legend("Identity")
        self.field(identity, "Name", "name", "text", value="Ada Lovelace", required=True)
        self.field(identity, "Email", "email", "email", placeholder="name@example.org")
        self.field(identity, "Search", "search", "search", placeholder="Find a topic")
        self.field(identity, "Website", "website", "url", placeholder="https://example.org")
        self.field(identity, "Telephone", "telephone", "tel", placeholder="+1 555 0100")
        self.field(identity, "Password", "password", "password", minlength=8)

        choices = form.fieldset(class_="form-grid")
        choices.legend("Choices and ranges")
        self.field(choices, "Quantity", "quantity", "number", min=1, max=20, value=3)
        self.field(choices, "Date", "date", "date")
        self.field(choices, "Time", "time", "time")
        self.field(choices, "Month", "month", "month")
        self.field(choices, "Week", "week", "week")
        self.field(choices, "Accent", "accent", "color", value="#456bc4")
        self.field(choices, "Intensity", "intensity", "range", min=0, max=100, step=5, value=60)
        choices.gramlot_label("Region", for_="region")
        select = choices.select(id="region", name="region")
        for value in ("North", "South", "West"):
            select.option(value, value=value.lower(), selected=(value == "South"))
        choices.gramlot_label("Topics (multiple)", for_="topics")
        topics = choices.select(id="topics", name="topics", multiple=True, size=3)
        for topic in ("HTML", "SVG", "Source"):
            topics.option(topic, value=topic.lower(), selected=(topic == "HTML"))
        choices.gramlot_label("Note", for_="note")
        choices.textarea("A native multiline field.", id="note", name="note", rows=3)

        options = form.fieldset(class_="form-options")
        options.legend("Flags and states")
        options.gramlot_label("Receive updates", for_="updates")
        options.input(type="checkbox", id="updates", name="updates", checked=True)
        for value in ("daily", "weekly"):
            options.gramlot_label(value.title(), for_=value)
            options.input(type="radio", id=value, name="frequency", value=value, checked=(value == "weekly"))
        options.gramlot_label("Read-only code", for_="code")
        options.input(type="text", id="code", value="DEMO-01", readonly=True)
        options.gramlot_label("Unavailable choice", for_="unavailable")
        options.input(type="text", id="unavailable", value="Disabled", disabled=True)
        options.gramlot_label("Attachment", for_="attachment")
        options.input(type="file", id="attachment", name="attachment")
        actions = form.div(class_="form-actions")
        actions.button("Button without an action", type="button")
        actions.button("Reset values", type="reset")
        actions.button("Submit unavailable", type="submit", disabled=True)

    def field(self, parent, label, key, kind, **attrs):
        parent.gramlot_label(label, for_=key)
        parent.input(type=kind, id=key, name=key, **attrs)
