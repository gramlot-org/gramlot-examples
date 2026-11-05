from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.chartPane(storepath="sales.rows", configpath="sales.chart",
                       id="sales-chart", height="560px")
