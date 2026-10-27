from gramlot import Page as BasePage
from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout


class Page(BasePage):
    title = "Color Maker: one block, three contexts"
    gramlots = [inputs, layout]
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(datapath="maker", class_="color-maker")
        header = main_content.div(class_="maker-header")
        header.h1("Color Maker")
        icon = header.button(aria_label="Open color palette", title="Open color palette",
                             action="this.SET('.paletteOpen', true)").svg(viewBox="0 0 24 24", width=22, height=22,
                             fill="none", stroke="currentColor", stroke_width=1.7)
        icon.path(d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.6-3.2 1.5 1.5 0 0 1 1.2-2.4H18a4 4 0 0 0 4-4C22 7 17.5 3 12 3Z")
        for x, y in ((7, 9), (10, 6), (15, 7)):
            icon.circle(cx=x, cy=y, r=1, fill="currentColor", stroke="none")
        main_content.p("A learning example: open the palette, select a color block, then move its sliders or press Random.", class_="muted")
        self.preview(main_content)
        self.palette(main_content)
        main_content.p("One RGB method, reused on three independent datapaths. Select a block by clicking it or focusing one of its sliders.", class_="maker-note")

    def palette(self, pane):
        window = pane.floatingPane(title="Color palette", open="^.paletteOpen", width="320px", height="550px",
                                   resizable=False, collapsible=False)
        bar = window.frame.top.div(class_="maker-palette-bar", selected="^.selected", default_selected="background")
        bar.span("^.selected", mask="Selected: {}")
        bar.button("Random", action="for (const channel of ['red', 'green', 'blue']) this.SET('.' + this.GET('.selected') + '.' + channel, Math.floor(Math.random() * 256));")
        controls = window.frame.center.div(class_="maker-controls")
        for name, title, rgb in (("background", "Background", (242, 184, 110)),
                                 ("ink", "Text", (49, 47, 78)),
                                 ("shadow", "Shadow", (117, 79, 131))):
            panel = controls.section(panel=name, tabindex=0, aria_label=title,
                class_="^.selected:='maker-panel' + ({} === {panel} ? ' maker-selected' : '')",
                connect_onclick="this.SET('.selected', this.getAttr('panel'))",
                connect_onfocusin="this.SET('.selected', this.getAttr('panel'))")
            self.color_rgb(panel.div(datapath=f".{name}"), title, rgb)

    def color_rgb(self, pane, title, rgb):
        heading = pane.div(class_="maker-panel-heading")
        heading.h2(title)
        heading.span(class_="maker-swatch", background_color="^.rgb", aria_hidden="true")
        for channel, label, initial in zip(("red", "green", "blue"), ("Red", "Green", "Blue"), rgb):
            row = pane.div(class_=f"maker-channel maker-{channel}")
            row.horizontalSlider(value=f"^.{channel}", lbl=label, lbl_position="L", lbl_width="3rem",
                                 min=0, max=255, step=1, live=True, default=initial)
            row.span(f"^.{channel}", class_="maker-value")
        pane.dataFormula(".rgb", "'rgb(' + red + ', ' + green + ', ' + blue + ')'",
                         red="^.red", green="^.green", blue="^.blue", _init=True)
        pane.code("^.rgb", class_="maker-code")

    def preview(self, pane):
        stage = pane.section(class_="maker-stage", aria_label="Live color preview")
        stage.span("LIVE PREVIEW", class_="maker-kicker")
        frame = stage.div(class_="maker-shadow", style="^.shadow.rgb:box-shadow: 0 20px 48px -12px {}")
        poster = frame.article(class_="maker-poster", background_color="^.background.rgb", color="^.ink.rgb")
        poster.span("COLOR STUDIES / 01", class_="maker-kicker")
        poster.h2("A little color.\nA different mood.")
        poster.p("Background, type and shadow — composed by you.")
        poster.div("Aa", class_="maker-specimen", aria_hidden="true")
        stage.p("Try a warm background with cool text. Then change only the shadow.", class_="muted")
