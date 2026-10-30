from gramlot import Page as BasePage


class Page(BasePage):
    title = "HTML editor"

    def main(self, root):
        main_content = root.main(datapath="htmlDemo", padding="24px", class_="example-page stack")
        main_content.h1(self.title)
        main_content.p("One HTML draft, three views. Rich text preserves protected script, SVG and comment blocks. Use Code to change those blocks. Preview does not execute scripts.")
        main_content.checkbox(value="^.readonly", label="Read only", default=False)
        tabs = main_content.tabContainer(selectedPage="^.view", height="500px", default_selectedPage='code')
        tabs.contentPane(title="Code", pageName="code", height="100%").codeMirror(value="^.content", language="html", readonly="^.readonly", height="100%")
        tabs.contentPane(title="Preview", pageName="preview", height="100%").htmlPreview(value="^.content", height="100%")
        tabs.contentPane(title="Rich text", pageName="rich", height="100%").htmlEditor(value="^.content", readonly="^.readonly", height="100%")
        main_content.h3("Live HTML in Data")
        main_content.pre("^.content", white_space="pre-wrap", id="live-html")
