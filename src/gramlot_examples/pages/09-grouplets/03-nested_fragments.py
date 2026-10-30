from gramlot import Page as BasePage, source


class Page(BasePage):
    title = "Service visit: compose a site dossier"

    def main(self, root):
        main_content = root.main(class_="grouplet-demo", datapath="visit")
        main_content.p("SERVICE VISIT SV-208 · HEATING MAINTENANCE", class_="eyebrow")
        main_content.h1("Everything the technician needs before arrival")
        main_content.p("The site grouplet composes a contact editor and an address editor. Reload the whole section after editing: rebuilding its content keeps the draft in the page Data.", class_="demo-intro")
        toolbar = main_content.div(class_="demo-toolbar")
        toolbar.button("Reload site section", id="reload-site", action="this.SET('.revision', this.GET('.revision') + 1)")
        toolbar.span("Draft held in this page", class_="demo-badge")
        main_content.grouplet(id="site-dossier", datapath=".site", remote="site_profile", remote_revision="^visit.revision", class_="demo-panel")
        summary = main_content.section(class_="demo-panel demo-summary")
        summary.h2("Visit briefing")
        summary.strong("^.site.name", id="site-summary")
        summary.p("^.site.contact.name", id="contact-summary")
        summary.p("^.site.contact.phone", id="phone-summary")
        summary.p("^.site.address.street", id="street-summary")
        summary.p("^.site.address.city", id="city-summary")
        summary.p("^.site.instructions", id="instructions-summary")
        main_content.div("Try it: change the site contact, the city and access instructions. Reload the site section and check that every edit remains in the briefing and the fields.", class_="demo-task")

    @source
    def site_profile(self, root, revision):
        root.h2("Site details")
        root.p(f"Section loaded · revision {revision}", id="site-revision", class_="demo-caption")
        root.textbox(value="^.name", lbl="Site name", id="site-name", live=True)
        columns = root.div(class_="demo-addresses")
        columns.grouplet(id="site-contact", datapath=".contact", remote="contact_fields", class_="demo-subsection")
        columns.grouplet(id="site-address", datapath=".address", remote="address_fields", class_="demo-subsection")
        root.textbox(value="^.instructions", lbl="Access instructions", id="site-instructions", live=True)

    @source
    def contact_fields(self, root):
        root.h3("On-site contact")
        for name, label in [("name", "Full name"), ("role", "Role"), ("email", "Email"), ("phone", "Phone")]:
            root.textbox(value=f"^.{name}", lbl=label, id=f"contact-{name}", live=True)

    @source
    def address_fields(self, root):
        root.h3("Site address")
        for name, label in [("street", "Street and number"), ("city", "City"), ("zip", "Postal code"), ("country", "Country")]:
            root.textbox(value=f"^.{name}", lbl=label, id=f"site-{name}", live=True)
