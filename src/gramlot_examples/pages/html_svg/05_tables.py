from gramlot import Page as BasePage


ROWS = [("North", 12, 8), ("South", 9, 11), ("West", 15, 6)]


class Page(BasePage):
    title = "Tables"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        page = root.main(class_="example-page stack")
        page.h1("A small regional report")
        page.p("Rows come from data; totals are computed before Source is built.")
        table = page.table()
        table.caption("Orders by region and quarter")
        heading = table.thead().tr()
        for label in ("Region", "Q1", "Q2", "Total"):
            heading.th(label, scope="col")
        body = table.tbody()
        for region, q1, q2 in ROWS:
            row = body.tr()
            row.th(region, scope="row")
            for value in (q1, q2, q1 + q2):
                row.td(str(value))
        total = table.tfoot().tr()
        total.th("All regions", scope="row")
        for value in (sum(row[1] for row in ROWS), sum(row[2] for row in ROWS), sum(row[1] + row[2] for row in ROWS)):
            total.td(str(value))
