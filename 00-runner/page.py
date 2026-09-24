"""Local Gramlot example index, authored as a normal Python Page."""

from gramlot import Page as GramlotPage


EXAMPLES = (
    ("catalog", "HTML grammar catalogue", "Every HTML family in its valid context"),
    ("e01", "Hello World", "First Source page"),
    ("e02", "Text and links", "Text content and navigation"),
    ("e03", "Lists", "Ordered, unordered and description lists"),
    ("e04", "Semantic page", "Landmarks and sections"),
    ("e05", "Tables", "Rows, cells and captions"),
    ("e06", "Forms", "Native form elements"),
    ("e07", "Native disclosure", "Details and summary"),
    ("e08", "SVG shapes", "Basic vector elements"),
    ("e09", "SVG composition", "Composed vector content"),
    ("e10", "Cards with icons", "HTML and SVG together"),
    ("e11", "Static report", "Structured information"),
    ("e12", "Complete page", "A composed example"),
)


class Page(GramlotPage):
    title = "Gramlot examples · runner"
    css = ("/themes/gramlot-base/theme.css", "/examples/00-runner/runner.css")

    def main(self, root):
        shell = root.div(class_="runner")
        shell.input(type="radio", name="runner-language", id="show-python", checked=True, class_="runner-choice")
        shell.input(type="radio", name="runner-language", id="show-javascript", class_="runner-choice")
        sidebar = shell.aside(class_="runner-sidebar")
        brand = sidebar.header(class_="runner-brand")
        brand.span("GRAMLOT", class_="eyebrow")
        brand.h1("Examples")
        brand.p("Choose a page and compare its Python and JavaScript implementations.", class_="muted")
        nav = sidebar.nav(aria_label="Examples")
        for route, title, caption in EXAMPLES:
            item = nav.div(class_="runner-item")
            item.strong(title)
            item.small(caption)
            links = item.div(class_="runner-links")
            links.a("Open Python ↗", href=f"/py/{route}", target="python-example", class_="runner-py-link")
            links.a("Open JavaScript ↗", href=f"/js/{route}", target="javascript-example", class_="runner-js-link")
            folder = "catalog" if route == "catalog" else (
                "01_hello_world", "02_text_and_links", "03_lists", "04_semantic_page",
                "05_tables", "06_forms", "07_native_disclosure", "08_svg_shapes",
                "09_svg_composition", "10_cards_with_icons", "11_static_report", "12_complete_page",
            )[int(route[1:]) - 1]
            source_base = (f"/examples/00-runner/{folder}" if route == "catalog"
                           else f"/examples/html_svg/{folder}")
            links.a("Source .py", href=f"{source_base}/page.py", target="_blank")
            links.a("Source .js", href=f"{source_base}/page.js", target="_blank")
            links.a("README", href=f"{source_base}/README.md", target="_blank")
        sidebar.p("Source links open the original files; the inspector is pending a reusable Gramlot component.", class_="muted runner-note")

        content = shell.main(class_="runner-main")
        intro = content.header(class_="runner-intro")
        intro.span("LOCAL EXAMPLE RUNNER", class_="eyebrow")
        intro.h2("Native HTML, two authoring languages")
        intro.p("Each frame runs an actual Gramlot Page. Select a language link in the sidebar to load an example without leaving the runner.", class_="muted")
        tabs = content.div(class_="runner-tabs", role="group", aria_label="Authoring language")
        tabs.gramlot_label("Python", for_="show-python")
        tabs.gramlot_label("JavaScript", for_="show-javascript")
        frames = content.div(class_="runner-frames")
        for language, route in (("Python", "py"), ("JavaScript", "js")):
            panel = frames.section(class_=f"runner-panel runner-panel-{route}")
            bar = panel.header(class_="runner-panel-header")
            bar.h3(language)
            bar.a("Open catalogue ↗", href=f"/{route}/catalog", target="_blank")
            panel.iframe(title=f"{language} Gramlot example", name=f"{language.lower()}-example", src=f"/{route}/catalog")
        foot = content.footer(class_="runner-footer")
        foot.a("Runner source (Python)", href="/examples/00-runner/page.py", target="_blank")
        foot.a("Runner source (JavaScript)", href="/examples/00-runner/page.js", target="_blank")
        foot.a("Catalogue notes", href="/examples/00-runner/catalog/README.md", target="_blank")
