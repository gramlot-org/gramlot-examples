from gramlot import Page as BasePage


REGIONS = (("North", 12, "var(--gramlot-action)"), ("South", 9, "var(--gramlot-warning)"), ("West", 15, "var(--gramlot-success)"))


class Page(BasePage):
    title = "Static report"
    css = ("/themes/gramlot-base/theme.css", "/examples/html_svg/11_static_report/style.css")

    def main(self, root):
        page = root.main(class_="example-page stack")
        header = page.header()
        header.p("SAMPLE REPORT", class_="eyebrow")
        header.h1("Orders by region")
        header.p("A fixed dataset feeds the summary, chart and table.")
        total = sum(value for _, value, _ in REGIONS)
        self.summary(page, total)
        self.chart(page)
        self.table(page, total)

    def summary(self, page, total):
        summary = page.section(class_="grid report-summary", aria_label="Summary")
        self.stat(summary, "Total orders", str(total))
        self.stat(summary, "Regions", str(len(REGIONS)))

    def chart(self, page):
        chart = page.figure(class_="card")
        svg = chart.svg(viewBox="0 0 520 230", role="img", aria_labelledby="report-chart-title", class_="example-art")
        svg.title("Orders by region: North 12, South 9, West 15", id="report-chart-title")
        for index, (region, value, color) in enumerate(REGIONS):
            y = 28 + index * 68
            svg.text(region, x=12, y=y + 23, font_size=17, fill="currentColor")
            svg.rect(x=105, y=y, width=value * 23, height=32, rx=7, fill=color)
            svg.text(str(value), x=112 + value * 23, y=y + 23, font_size=17, fill="currentColor")
        chart.figcaption("The bar lengths and table cells use the same values.")
        legend = page.ul(class_="report-legend")
        for region, _, color in REGIONS:
            item = legend.li()
            item.span("■ ", style=f"color: {color}")
            item.span(region)

    def table(self, page, total):
        table = page.table()
        table.caption("Exact figures")
        head = table.thead().tr()
        head.th("Region", scope="col")
        head.th("Orders", scope="col")
        body = table.tbody()
        for region, value, _ in REGIONS:
            row = body.tr()
            row.th(region, scope="row")
            row.td(str(value))
        foot = table.tfoot().tr()
        foot.th("Total", scope="row")
        foot.td(str(total))

    def stat(self, parent, label, value):
        card = parent.div(class_="card")
        card.p(label, class_="muted")
        card.p(value, class_="report-number")
