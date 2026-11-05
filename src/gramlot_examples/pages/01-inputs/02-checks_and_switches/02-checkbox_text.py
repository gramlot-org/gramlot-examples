from genro_bag import Bag
from gramlot import Page as BasePage, endpoint


class Page(BasePage):
    def main(self, root):
        options = "MI:Milano,TO:Torino,CO:Como,PV:Pavia"
        pane = root.div(max_width="34rem", display="grid", gap="1rem", padding="1rem")
        pane.checkbox(value="^locked", default=False, label="Read only", id="locked")
        inline = pane.groupBox(lbl="Inline")
        inline.comboBox(value="^columns", values="1,2,3", default="2",
                      lbl="Columns", id="columns", box_c_width="6rem")
        inline.checkBoxText(value="^cities", values=options, cols="==Number(columns)", columns="^columns",
                          readonly="^locked", id="channels")
        popup = pane.groupBox(lbl="Popup")
        popup.checkBoxText(value="^cities", values=options, popup=True,
                          readonly="^locked", id="channels-copy")
        popup.code("^cities", id="city-codes")
        root.dataRemote("documents", "document_choices", cacheTime=-1)
        hierarchy = pane.groupBox(lbl="Hierarchy")
        hierarchy.checkBoxText(value="^selected", values="^documents", hierarchical=True,
                          readonly="^locked", id="hierarchy-inline")
        hierarchy.code("^selected", id="selected-paths")

    @endpoint
    def document_choices(self):
        choices = Bag({"manual": Bag({"guide": None, "reference": None})})
        choices.setItem("manual.fixed", None, checked="disabled:on")
        return choices
