"""The Python integration's example runner, authored with Gramlot Source."""
import json
from pathlib import Path
from gramlot import Page as GramlotPage

RUNNER = Path(__file__).resolve().parent
EXAMPLES = json.loads((RUNNER / "catalog.json").read_text())


class Page(GramlotPage):
    title = "Gramlot examples"
    css = ("/themes/gramlot-base/theme.css", "/examples/00-runner/runner.css")

    def main(self, root):
        shell = root.div(class_="runner", id="runner")
        sidebar = shell.aside(class_="runner-sidebar")
        brand = sidebar.header()
        brand.img(src="/assets/branding/gramlot-logo-dark.svg", alt="Gramlot",
                  class_="runner-logo")
        brand.h1("Examples")
        navigation = sidebar.nav(aria_label="Examples").ul(class_="runner-list")
        category = navigation.li()
        category.a("HTML / SVG", id="open-html_svg", href="#panel-html_svg",
                   aria_current=None, tabindex=-1)
        examples_list = category.ul(class_="runner-list")
        for example in EXAMPLES:
            examples_list.li().a(example["title"], id=f"open-{example['key']}",
                                href=example["key"], aria_current=None,
                                tabindex=-1)
        footer = sidebar.footer(class_="runner-keyboard")
        label = footer.gramlot_label(for_="keyboard-navigation")
        label.input(type="checkbox", id="keyboard-navigation",
                    checked=False)
        label.span("Keyboard navigation")
        theme = sidebar.footer(class_="runner-theme")
        theme.gramlot_label("Theme", for_="runner-theme")
        choices = theme.select(id="runner-theme", value="light")
        choices.option("Light", value="light", selected=True)
        choices.option("Dark", value="dark", selected=False)

        content = shell.main(class_="runner-main")
        tabs = content.div(class_="runner-tabs", role="tablist", aria_label="Open examples")
        tabs.button("Introduction", type="button", role="tab", id="tab-intro",
                    aria_controls="panel-intro",
                    aria_selected="true", tabindex=-1, hidden=False)
        tabs.button("HTML / SVG", type="button", role="tab", id="tab-html_svg",
                    aria_controls="panel-html_svg",
                    aria_selected="false", tabindex=-1, hidden=True)
        for example in EXAMPLES:
            key = example["key"]
            tabs.button(example["title"], type="button", role="tab", id=f"tab-{key}",
                        aria_controls=f"panel-{key}",
                        aria_selected="false", tabindex=-1, hidden=True)

        panels = content.div(class_="runner-panels")
        intro = panels.section(id="panel-intro", class_="runner-intro", role="tabpanel",
                               aria_labelledby="tab-intro", hidden=False)
        intro.h2("Example runner")
        intro.p("This runner shows each native HTML page beside the code that creates it. "
                "The Python and JavaScript integrations have the same examples.")
        intro.p("Choose an example from the list. Its tab stays open so you can return to it. "
                "Enable Keyboard navigation in the sidebar to move through tabs by keyboard. "
                "The vertical divider resizes the preview and code.")

        category_panel = panels.section(id="panel-html_svg", class_="runner-category",
                                        role="tabpanel",
                                        aria_labelledby="tab-html_svg", hidden=True)
        category_panel.div((RUNNER.parent / "html_svg" / "README.md").read_text(),
                           id="readme-html_svg")

        for example in EXAMPLES:
            self.panel(panels, example)
        shell.script(src="/examples/00-runner/dist/runner.js")

    def panel(self, parent, example):
        key = example["key"]
        panel = parent.section(id=f"panel-{key}", class_="runner-panel", role="tabpanel",
                               aria_labelledby=f"tab-{key}", hidden=True)
        folder = RUNNER.parent / "html_svg" / example["folder"]
        explanation = panel.header(class_="runner-explanation")
        explanation.div((folder / "README.md").read_text(),
                        id=f"readme-{key}")
        source_path = folder / "page.py"

        split = panel.div(class_="runner-split", id=f"split-{key}",
                          style="--split-position: 65%")
        preview = split.div(class_="runner-preview", id=f"preview-{key}")
        preview.iframe(title=f"{example['title']} preview", name=f"example-{key}",
                       id=f"frame-{key}")
        split.div(class_="runner-divider", id=f"divider-{key}",
                  role="separator", aria_orientation="vertical", tabindex=0,
                  aria_label="Resize preview and code", aria_valuemin=20,
                  aria_valuemax=80, aria_valuenow=65)
        codepane = split.div(class_="runner-codepane", id=f"codepane-{key}")
        codepane.h3("Python · page.py")
        codepane.pre().code(source_path.read_text(), class_="language-python",
                            id=f"code-{key}")
