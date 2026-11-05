from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        options = root.details(max_width="24rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls", default=False)
        fields = root.formlet(class_="card stack", width="100%", max_width="24rem")
        for code, caption in (("standard", "Standard"), ("express", "Express"), ("pickup", "Pick up")):
            fields.radioButton(id=code, value=f"^{code}", group="delivery", label=caption,
                               disabled="^locked")
        fields.radioButton(id="independent", value="^independent", group="other", label="Independent choice",
                           lbl="Another group", disabled="^locked")
        facts = root.dl()
        for code in ("standard", "express", "pickup", "independent"):
            facts.dt(code)
            facts.dd(f"^{code}", id=f"{code}-value")
