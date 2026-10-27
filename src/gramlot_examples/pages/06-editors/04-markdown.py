from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.editors import mygramlot as editors
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout, editors]
    title = "Markdown editor"

    def main(self, root):
        main_content = root.main(datapath="markdownDemo", padding="24px", class_="example-page stack")
        main_content.h1(self.title)
        main_content.p("Three views share one Markdown draft. Rich text provides Bold, Italic, Code, Undo and Redo. Tables and complex blocks retain their source; edit them in Code.")
        main_content.checkbox(value="^.readonly", label="Read only", default=False)
        main_content.checkbox(value="^.allowHtml", label="Allow embedded HTML", default=False)
        tabs = main_content.tabContainer(selectedPage="^.view", height="500px", default_selectedPage='code')
        tabs.contentPane(title="Code", pageName="code", height="100%").codeMirror(value="^.content", language="markdown", readonly="^.readonly", height="100%")
        tabs.contentPane(title="Preview", pageName="preview", height="100%").markdownPreview(value="^.content", allowHtml="^.allowHtml", height="100%")
        tabs.contentPane(title="Rich text", pageName="rich", height="100%").markdownEditor(value="^.content", readonly="^.readonly", height="100%")
        main_content.h3("Live Markdown in Data")
        main_content.pre("^.content", white_space="pre-wrap", id="live-markdown")
