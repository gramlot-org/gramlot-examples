from gramlot import Page as BasePage
from gramlot.collections.inputs import mygramlot as inputs


class Page(BasePage):
    title = "Sieve of Eratosthenes: animate reactive Data"
    gramlots = [inputs]
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(datapath="sieve", class_="sieve-page")
        main_content.h1("Sieve of Eratosthenes")
        main_content.p("A learning example: discover the primes from 1 to 100, one Data update at a time.", class_="muted")
        self.controls(main_content)
        self.grid(main_content)
        self.explanation(main_content)
        main_content.dataController(func="reset", _onStart=True)
        main_content.dataFormula(".interval", "running ? delay : 0", running="^.running", delay="^.delay", _init=True)
        main_content.dataController(func="step", _timing="^.interval")

    def controls(self, pane):
        bar = pane.div(class_="sieve-controls")
        for caption, method, disabled in (("Start", "start", "^.running:=!!{} || {done}"),
                                          ("Pause", "pause", "^.running:=!{}"),
                                          ("Step", "step", "^.running:=!!{} || {done}"),
                                          ("Reset", "reset", False)):
            bar.button(caption, id=f"sieve-{method}", disabled=disabled, done="^.done").dataController(func=method)
        bar.horizontalSlider(value="^.delay", lbl="Seconds per step", min=0.05, max=1, step=0.05,
                             default=0.25, live=True, class_="sieve-speed")
        bar.span("^.delay", mask="{} s", class_="sieve-speed-value")
        facts = pane.div(class_="sieve-facts")
        facts.span("^.prime", mask="Current prime: {}", visible="^.prime:={} > 0")
        facts.span("Current prime: —", visible="^.prime:=!{}")
        for path, label in (("count", "Primes found"), ("steps", "Steps")):
            facts.span(f"^.{path}", mask=f"{label}: {{}}")
        pane.p("^.message", class_="sieve-message", role="status", id="sieve-message")

    def grid(self, pane):
        legend = pane.div(class_="sieve-legend")
        for state, label in (("pending", "Not visited"), ("prime", "Prime"), ("composite", "Composite"), ("excluded", "1 is not prime")):
            legend.span(label, class_=f"sieve-key sieve-{state}")
        grid = pane.div(class_="sieve-grid", role="group", aria_label="Numbers 1 to 100")
        for number in range(1, 101):
            grid.span(str(number), class_=f"^.cells.n{number}:sieve-cell sieve-{{}}",
                      aria_label=f"^.cells.n{number}:{number}: {{}}",
                      aria_current=f"^.current:={{}} === {number} ? 'step' : 'false'")

    def explanation(self, pane):
        guide = pane.details(class_="sieve-guide")
        guide.summary("How the animation works")
        for text in ("The timer calls step() every interval seconds. Zero stops the timer; Pause preserves the Data.",
                     "step() changes the cells in the Data Bag. It never finds or edits an HTML element.",
                     "Each cell's class is bound to its Data value. The bindings turn those updates into colors.",
                     "Step calls exactly the same method as the timer. Reset stops playback and replaces the initial state."):
            guide.p(text)
