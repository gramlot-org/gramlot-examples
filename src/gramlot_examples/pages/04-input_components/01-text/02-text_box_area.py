from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Multiline text and labelbox'

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Multiline text and labelbox')
        main_content.p('Two multiline fields share one note. Switch live editing or disable the controls while keeping the text and selection.')
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls")
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.textBoxArea(id="notes", value="^notes", lbl="Notes", rows=4, cols=24,
                           placeholder="Write a few lines", live="^live", disabled="^locked",
                           box_padding="8px")
        fields.textBoxArea(id="notes-copy", value="^notes", lbl="Same notes", rows=3, cols=24,
                           live="^live", disabled="^locked")
        for path, value in (('notes', 'First line\nSecond line'), ('locked', False), ('live', True)):
            main_content.dataSetter(path, value)
