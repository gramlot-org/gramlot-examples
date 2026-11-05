from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.h1('Time')
        root.p('Animate a sine wave or play prepared monthly snapshots. Samples, time controls and configuration live in Data; fixed axes make changes readable.')
