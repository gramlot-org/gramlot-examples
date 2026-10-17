from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Password and labelbox'
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1('Password and labelbox')
        pane.p('Two password fields share a sample value. The browser masks the characters; changing either field updates the other.')
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.passwordbox(id="secret", value="^secret", lbl="Sample password", live="^live",
                           disabled="^locked", placeholder="Use a sample value",
                           box_padding="8px")
        fields.passwordbox(id="secret-copy", value="^secret", lbl="Same sample password",
                           live="^live", disabled="^locked")
        for path, value in (('secret', 'sample-only'), ('locked', False), ('live', True)):
            pane.dataSetter(path, value)
