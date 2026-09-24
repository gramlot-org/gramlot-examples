"""The Python integration's example runner, authored with Gramlot Source."""
import json
from pathlib import Path
from gramlot import Page as GramlotPage

EXAMPLES = json.loads(Path(__file__).with_name("catalog.json").read_text())


class Page(GramlotPage):
    title = "Gramlot examples"
    css = ("/themes/gramlot-base/theme.css", "/examples/00-runner/runner.css")

    def main(self, root):
        shell = root.div(class_="runner", data_gramlot_tabs="catalog")
        sidebar = shell.aside(class_="runner-sidebar")
        sidebar.header().h1("Examples")
        navigation = sidebar.nav(aria_label="Examples").ul(class_="runner-list")
        for example in EXAMPLES:
            navigation.li().button(example["title"], type="button",
                                   data_gramlot_open=example["key"],
                                   aria_current="page" if example["key"] == "catalog" else None)
        content = shell.main(class_="runner-main")
        tabs = content.div(class_="runner-tabs", role="tablist", aria_label="Open examples")
        for example in EXAMPLES:
            key = example["key"]
            active = key == "catalog"
            tabs.button(example["title"], type="button", role="tab", id=f"tab-{key}",
                        data_gramlot_tab=key, aria_controls=f"panel-{key}",
                        aria_selected="true" if active else "false",
                        tabindex=0 if active else -1, hidden=not active)
        panels = content.div(class_="runner-panels")
        for example in EXAMPLES:
            self.panel(panels, example)

    def panel(self, parent, example):
        key = example["key"]
        panel = parent.section(id=f"panel-{key}", class_="runner-panel", role="tabpanel",
                               data_gramlot_panel=key, aria_labelledby=f"tab-{key}",
                               hidden=key != "catalog")
        explanation = panel.header(class_="runner-explanation")
        explanation.h2(example["title"])
        explanation.p(example["description"], class_="runner-description")
        explanation.p(example["explanation"])
        base = ("/examples/00-runner/catalog" if key == "catalog"
                else f"/examples/html_svg/{example['folder']}")
        links = explanation.div(class_="runner-resources")
        links.a("Python source", href=f"{base}/page.py", target="_blank")
        links.a("README", href=f"{base}/README.md", target="_blank")
        panel.iframe(title=example["title"], name=f"example-{key}",
                     data_gramlot_frame=key, data_gramlot_src=key,
                     src=key if key == "catalog" else None)
