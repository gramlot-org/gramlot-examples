from gramlot import Page as BasePage
from gramlot.page import code_mirror_with_options


class Page(BasePage):
    title = "Editor options"

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="editorDemo", padding="24px")
        main_content.h1('CodeMirror with options')
        main_content.p("Edit the draft: Data updates immediately. Ctrl/Cmd+F opens search; Escape then Tab leaves the editor. Save or Ctrl/Cmd+S copies the draft to the snapshot below.")
        main_content.p('Choose a language to load its sample and switch syntax highlighting. Changing language replaces the current draft.')
        options = main_content.details()
        options.summary("Options · language, read only and disabled")
        options.filteringSelect(value="^.document.settings.language", values='python:Python,javascript:JavaScript,typescript:TypeScript,json:JSON,html:HTML,css:CSS,xml:XML,markdown:Markdown,sql:SQL,text:Plain text', lbl="Language and sample", validate_notnull=True, id="sample-language", default='python')
        options.checkbox(value="^.document.readonly", label="Read only", default=False)
        options.checkbox(value="^.document.disabled", label="Disabled", default=False)
        code_mirror_with_options(main_content, datapath=".document", value="^.source", language="python", id="demo-editor", readonly="^.readonly", disabled="^.disabled", selfsubscribe_save="this.SET('.saved', p_0.value)")
        main_content.dataController("this.SET('.document.source', snippets.getItem(language))", language="^.document.settings.language", snippets="=.snippets")
        main_content.button("Save snapshot", id="save-snapshot", action="this.SET('.document.saved', this.GET('.document.source'))")
        main_content.h3("Live Data")
        main_content.pre("^.document.source", id="live-draft")
        main_content.h3("Saved snapshot")
        main_content.pre("^.document.saved", id="saved-snapshot")
