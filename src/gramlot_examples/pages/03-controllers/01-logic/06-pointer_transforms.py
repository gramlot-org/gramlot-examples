from gramlot import Page as BasePage


class Page(BasePage):
    title = "Pointer templates and expressions"
    locale = "it-IT"
    time_zone = "Europe/Rome"

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="transforms")
        main_content.h1("Same Data, different presentation")
        sizes = main_content.section(class_="card stack")
        sizes.h2("1. A number becomes a CSS length")
        sizes.html_label("Width in pixels", for_="width-input")
        sizes.input(id="width-input", type="number", value="^.width", live=True)
        sizes.div("Width", id="width-preview", width="^.width:{}px", background_color="#456bc4", color="white")
        sizes.p("Edit the number: only its presentation gains px. Clear it: the explicit width disappears.")
        state = main_content.section(class_="card stack")
        state.h2("2. A boolean becomes another boolean")
        state.html_label("Draft: allow editing", for_="draft-input")
        state.input(id="draft-input", type="checkbox", value="^.draft")
        state.html_label("Name", for_="name-input")
        state.input(id="name-input", value="^.name", readonly="^.draft:=!{}")
        display = main_content.section(class_="card stack")
        display.h2("3. Format a number, then wrap the text")
        display.html_label("Amount", for_="amount-input")
        display.input(id="amount-input", type="number", value="^.amount", live=True)
        display.p("^.amount", id="amount-display", format="0.00", mask="Total: {} €")
        display.p("Hover to read the same amount in the title.", id="amount-title",
                  title="^.amount:=_F({}, {pattern: '0.00', mask: '{} €'})")
        display.p("This page uses Italian formatting. The amount in Data remains a number.")
