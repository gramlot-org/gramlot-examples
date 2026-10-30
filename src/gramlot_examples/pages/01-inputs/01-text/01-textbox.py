from gramlot import Page as BasePage


class Page(BasePage):
    devices = ("desktop", "tablet", "phone")
    title = "HTML and components"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("HTML and components")
        main_content.p("Edit any name: all three fields share one Data value. HTML tags and Gramlot components use the same bindings and labelbox.")
        self.options(main_content)
        comparison = main_content.div(display="grid", gap="12px", max_width="56rem",
                              grid_template_columns="repeat(auto-fit, minmax(min(100%, 22rem), 1fr))")
        self.html_controls(comparison)
        self.components(comparison)
        main_content.h2("Shared Data")
        main_content.p("^customer", id="customer-value")

    def html_controls(self, parent):
        card = parent.section(class_="card stack", min_width=0)
        card.h2("HTML tags")
        card.p("input + html_button: browser controls, declared through Gramlot.")
        card.input(id="customer-html", type="text", value="^customer", lbl="Customer",
                   lbl_position="^position", live="^live", readonly="^readonly",
                   placeholder="Enter a name", width="100%", box_c_width="100%")
        card.html_button("Clear name", id="clear-html", type="button",
                         connect_onclick="this.SET('customer', '')")
        card.p("html_button selects the HTML tag. connect_onclick handles its click.", class_="muted")

    def components(self, parent):
        fields = parent.formlet(class_="card stack", min_width=0, width="100%")
        fields.h2("Gramlot components")
        fields.p("textbox + button: controls with Gramlot behavior and dedicated options.")
        fields.textbox(id="customer", value="^customer", lbl="Customer",
                       lbl_position="^position", live="^live", readonly="^readonly",
                       placeholder="Enter a name", box_c_width="100%")
        fields.textbox(id="customer-copy", value="^customer", lbl="Same customer",
                       live="^live", readonly="^readonly")
        fields.button("Clear name", id="clear-component", action="this.SET('customer', '')")
        fields.p("button exposes action; textbox also supports validation and field state.", class_="muted")

    def options(self, parent):
        options = parent.details(max_width="32rem")
        options.summary("Options · labels and editing")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.html_label("Label position", for_="position")
        position = controls.select(id="position", value="^position", width="8rem", max_width="100%", default="TL")
        for code in ("TL", "TC", "TR", "L", "R", "BL", "BC", "BR"):
            position.option(code, value=code)
        controls.checkbox(value="^live", lbl="Editing", label="Update while typing", default=True)
        controls.checkbox(value="^readonly", lbl="State", label="Read only", default=False)
