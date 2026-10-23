from gramlot import Page as BasePage


class Page(BasePage):
    title = "Markdown: code, preview and rich text"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(datapath="markdownDemo", padding="24px", class_="example-page stack")
        pane.h1(self.title)
        pane.p("Three views share one Markdown draft. Rich text provides Bold, Italic, Code, Undo and Redo. Tables and complex blocks retain their source; edit them in Code.")
        pane.dataSetter(".content", '# A Markdown document\n\nEdit this paragraph in **Rich text**, then inspect its Markdown in Code.\n\n## Shared document\n\n- CodeMirror edits the source.\n- ProseMirror edits supported Markdown visually.\n- Preview renders the same draft.\n\n> Save and Revert belong to the document in the IDE.\n\n```python\nprint("Hello, Gramlot!")\n```\n\n| View | Purpose |\n| --- | --- |\n| Code | Edit all syntax |\n| Rich text | Edit supported blocks |\n\nThe table above and ~~strikethrough~~ are preserved blocks: edit them in Code.\n\n<div><strong>Embedded HTML</strong>: enable Allow embedded HTML to render this block.</div>\n')
        pane.dataSetter(".allowHtml", False)
        pane.dataSetter(".readonly", False)
        pane.dataSetter(".view", "code")
        pane.checkbox(value="^.readonly", label="Read only")
        pane.checkbox(value="^.allowHtml", label="Allow embedded HTML")
        tabs = pane.tabContainer(selectedPage="^.view", height="500px")
        tabs.contentPane(title="Code", pageName="code", height="100%").codeMirror(value="^.content", language="markdown", readonly="^.readonly", height="100%")
        tabs.contentPane(title="Preview", pageName="preview", height="100%").markdownPreview(value="^.content", allowHtml="^.allowHtml", height="100%")
        tabs.contentPane(title="Rich text", pageName="rich", height="100%").markdownEditor(value="^.content", readonly="^.readonly", height="100%")
        pane.h3("Live Markdown in Data")
        pane.pre("^.content", white_space="pre-wrap", id="live-markdown")
