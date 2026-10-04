"""The Python integration's example gallery, authored with Gramlot Source."""
from gramlot import Page as GramlotPage
from gramlot_examples import build_gallery


class Page(GramlotPage):
    """The gallery page; an environment subclass sets ``catalogs`` as for ``build_gallery``,
    and ``logoUrl`` and ``galleryScript`` when it serves them at other URLs."""

    title = "Gramlot examples"
    css = ("/themes/gramlot-base/theme.css", "/gallery/gallery.css")
    logoUrl = "/assets/branding/gramlot-logo-dark.svg"
    galleryScript = "/gallery/dist/gallery.js"
    catalogs = ()

    @property
    def gallery(self):
        return build_gallery(self.catalogs)

    def main(self, root):
        gallery = self.gallery
        families = gallery["families"]
        shell = root.div(class_="gallery", id="gallery")
        sidebar = shell.aside(class_="gallery-sidebar")
        brand = sidebar.header()
        brand.img(src=self.logoUrl, alt="Gramlot", class_="gallery-logo")
        brand.h1("Examples")
        navigation = sidebar.nav(aria_label="Examples").ul(class_="gallery-list")
        for family in families:
            category = navigation.li().details(open=family is families[0])
            category.summary(tabindex=-1).a(
                family["title"], id=f"open-{family['key']}", href=f"#panel-{family['key']}",
                class_="gallery-family", aria_current=None, tabindex=-1)
            examples_list = category.ul(class_="gallery-list")
            for example in family["examples"]:
                examples_list.li().a(example["title"], id=f"open-{example['key']}",
                                    href=example["key"], aria_current=None,
                                    tabindex=-1)
        footer = sidebar.footer(class_="gallery-keyboard")
        label = footer.html_label(for_="keyboard-navigation")
        label.input(type="checkbox", id="keyboard-navigation",
                    checked=False)
        label.span("Keyboard navigation")
        theme = sidebar.footer(class_="gallery-theme")
        theme.html_label("Theme", for_="gallery-theme")
        choices = theme.select(id="gallery-theme", value="light")
        choices.option("Light", value="light", selected=True)
        choices.option("Dark", value="dark", selected=False)

        content = shell.main(class_="gallery-main")
        tabs = content.div(class_="gallery-tabs", role="tablist", aria_label="Open examples")
        tabs.button("Introduction", type="button", role="tab", id="tab-intro",
                    aria_controls="panel-intro",
                    aria_selected="true", tabindex=-1, hidden=False)
        for family in families:
            for item in (family, *family["examples"]):
                key = item["key"]
                tabs.button(item["title"], type="button", role="tab", id=f"tab-{key}",
                            aria_controls=f"panel-{key}",
                            aria_selected="false", tabindex=-1, hidden=True)

        panels = content.div(class_="gallery-panels")
        intro = panels.section(id="panel-intro", class_="gallery-intro", role="tabpanel",
                               aria_labelledby="tab-intro", hidden=False)
        intro.h2("Example gallery")
        intro.p("This gallery shows each example page beside the code that creates it. "
                "The Python and JavaScript integrations have the same examples.")
        intro.p("Choose an example from the list. Its tab stays open so you can return to it. "
                "Enable Keyboard navigation in the sidebar to move through tabs by keyboard. "
                "The vertical divider resizes the preview and code.")

        for family in families:
            key = family["key"]
            category_panel = panels.section(id=f"panel-{key}", class_="gallery-category",
                                            role="tabpanel",
                                            aria_labelledby=f"tab-{key}", hidden=True)
            category_panel.div((family["path"] / "README.md").read_text(),
                               id=f"readme-{key}")
            for example in family["examples"]:
                self.panel(panels, example, family["path"], gallery["routes"][example["key"]]["logic"])
        shell.script(src=self.galleryScript)

    def panel(self, parent, example, examples, logic_path):
        key = example["key"]
        panel = parent.section(id=f"panel-{key}", class_="gallery-panel", role="tabpanel",
                               aria_labelledby=f"tab-{key}", hidden=True)
        explanation = panel.header(class_="gallery-explanation")
        explanation.div((examples / f"{example['folder']}.md").read_text(),
                        id=f"readme-{key}")
        source_path = examples / f"{example['folder']}.py"

        split = panel.div(class_="gallery-split", id=f"split-{key}",
                          style="--split-position: 65%")
        preview = split.div(class_="gallery-preview", id=f"preview-{key}")
        preview.iframe(title=f"{example['title']} preview", name=f"example-{key}",
                       id=f"frame-{key}")
        split.div(class_="gallery-divider", id=f"divider-{key}",
                  role="separator", aria_orientation="vertical", tabindex=0,
                  aria_label="Resize preview and code", aria_valuemin=20,
                  aria_valuemax=80, aria_valuenow=65)
        codepane = split.div(class_="gallery-codepane", id=f"codepane-{key}")
        codepane.h3(f"Python · {source_path.name}")
        codepane.pre().code(source_path.read_text(), class_="language-python",
                            id=f"code-{key}")
        # The Python page takes its Logic from the JavaScript module beside it.
        if logic_path is not None:
            codepane.h3(f"Logic · {logic_path.name}")
            codepane.pre().code(logic_path.read_text(), class_="language-javascript",
                                id=f"logic-{key}")
