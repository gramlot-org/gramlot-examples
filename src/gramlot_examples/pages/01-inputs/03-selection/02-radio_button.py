from gramlot import Page as BasePage


class Page(BasePage):
    title = "Individual radio buttons"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Single radio buttons')
        main_content.p('Each radio binds its own boolean. A shared group makes the choices exclusive; a separate group stays independent.')
        options = main_content.details(max_width="24rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        for code, caption in (("standard", "Standard"), ("express", "Express"), ("pickup", "Pick up")):
            fields.radioButton(id=code, value=f"^{code}", group="delivery", label=caption,
                               disabled="^locked")
        fields.radioButton(id="independent", value="^independent", group="other", label="Independent choice",
                           lbl="Another group", disabled="^locked")
        facts = main_content.dl()
        for code in ("standard", "express", "pickup", "independent"):
            facts.dt(code)
            facts.dd(f"^{code}", id=f"{code}-value")
