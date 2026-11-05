from gramlot import Page as BasePage
from gramlot.db import DatabaseSelectors


class Page(DatabaseSelectors, BasePage):
    def main(self, root):
        root.dbSelect(value="^state", dbtable="states", lbl="State")
        root.checkBoxText(value="^customers", dbtable="customers", popup=True,
                          condition="$state=:state", condition_state="^state",
                          lbl="Customers")
        root.p("^customers")
