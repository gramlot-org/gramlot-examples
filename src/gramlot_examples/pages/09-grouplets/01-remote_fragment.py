from gramlot import Page as BasePage, source


class Page(BasePage):
    title = "Customer onboarding: adapt the customer details"

    def main(self, root):
        main_content = root.main(class_="grouplet-demo", datapath="customer")
        main_content.p("CUSTOMER ONBOARDING", class_="eyebrow")
        main_content.h1("One customer editor, two kinds of customer")
        main_content.p("Choose a private customer or a company. The server builds the appropriate fields inside the same page; the contact details and draft remain available.", class_="demo-intro")
        toolbar = main_content.div(class_="demo-toolbar")
        toolbar.html_label("Customer type", for_="customer-kind")
        choice = toolbar.select(id="customer-kind", value="^.kind")
        choice.option("Private customer", value="person")
        choice.option("Company", value="company")
        toolbar.span("Draft held in this page", class_="demo-badge")
        workspace = main_content.div(class_="demo-workspace")
        workspace.grouplet(id="customer-fields", remote="customer_fields", remote_kind="^.kind", class_="demo-panel")
        summary = workspace.aside(class_="demo-panel demo-summary")
        summary.h2("Contact preview")
        summary.p("The preview follows your edits without another server request.")
        summary.strong("^.email", id="customer-email-summary")
        summary.p("^.phone", id="customer-phone-summary")
        summary.p("^.notes", id="customer-notes-summary")
        main_content.div("Try it: enter a company and VAT number, switch to Private customer, then switch back. The fields change, but your company draft is still there.", class_="demo-task")

    @source
    def customer_fields(self, root, kind):
        root.h2({"person": "Private customer", "company": "Company"}[kind], id="customer-section-title")
        fields = root.formlet(columns=2)
        identity = [("first_name", "First name"), ("last_name", "Last name")] if kind == "person" else [("company", "Company name"), ("vat", "VAT number")]
        for name, label in identity + [("email", "Email"), ("phone", "Phone")]:
            fields.textbox(value=f"^.{name}", lbl=label, id=f"customer-{name}", live=True)
        root.textbox(value="^.notes", lbl="Contact notes", id="customer-notes", live=True)
        root.p("These are editable customer details, not a saved database record.", class_="demo-caption")
