from gramlot import Page as BasePage


class Page(BasePage):
    title = "HTML: code, preview and Jodit"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(datapath="htmlDemo", padding="24px", class_="example-page stack")
        pane.h1(self.title)
        pane.p("One HTML draft, three views. Rich text preserves protected script, SVG and comment blocks. Use Code to change those blocks. Preview does not execute scripts.")
        pane.dataSetter(".content", '<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><title>A real HTML document</title>\n<style>body {font: 17px system-ui; padding: 24px; color: #24334b} h1 {color: #3566aa} .note {background: #eaf1fc; padding: 16px; border-radius: 8px}</style></head>\n<body><h1>Hello, Gramlot!</h1><p>Edit this paragraph in <strong>Rich text</strong>, then inspect its HTML in Code.</p><p class="note">Code, Preview and Rich text share one draft.</p>\n<!-- This comment stays in the source. -->\n<svg width="100" height="50" viewBox="0 0 100 50"><circle cx="25" cy="25" r="20" fill="#3566aa"/></svg>\n<script>document.body.dataset.executed = "yes";</script>\n</body></html>')
        pane.dataSetter(".readonly", False)
        pane.dataSetter(".view", "code")
        pane.checkbox(value="^.readonly", label="Read only")
        tabs = pane.tabContainer(selectedPage="^.view", height="500px")
        tabs.contentPane(title="Code", pageName="code", height="100%").codeMirror(value="^.content", language="html", readonly="^.readonly", height="100%")
        tabs.contentPane(title="Preview", pageName="preview", height="100%").htmlPreview(value="^.content", height="100%")
        tabs.contentPane(title="Rich text", pageName="rich", height="100%").htmlEditor(value="^.content", readonly="^.readonly", height="100%")
        pane.h3("Live HTML in Data")
        pane.pre("^.content", white_space="pre-wrap", id="live-html")
