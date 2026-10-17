from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Single radio buttons'
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1('Single radio buttons')
        pane.p('Each radio binds its own boolean. A shared group makes the choices exclusive; a separate group stays independent.')
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        for code, caption in (("standard", "Standard"), ("express", "Express"), ("pickup", "Pick up")):
            fields.radioButton(id=code, value=f"^{code}", group="delivery", label=caption,
                               lbl=caption, disabled="^locked", box_padding="4px")
        fields.radioButton(id="independent", value="^independent", group="other", label="Independent choice",
                           lbl="Another group", disabled="^locked")
        facts = pane.dl()
        for code in ("standard", "express", "pickup", "independent"):
            facts.dt(code)
            facts.dd(f"^{code}", id=f"{code}-value")
        for path, value in (('standard', True), ('express', False), ('pickup', False), ('independent', False), ('locked', False)):
            pane.dataSetter(path, value)
