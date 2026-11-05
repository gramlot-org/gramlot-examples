from gramlot import Page as BasePage


class Page(BasePage):
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        content = root.main(class_="example-page stack", datapath="rowActionsDemo")
        content.h2("Act on a row without selecting it")
        tree = content.tree(
            storepath=".nodes",
            labelAttribute="caption",
            hideValues=True,
            selectedPath="^.selected",
            id="row-actions-tree",
            class_="row-actions-demo-tree",
        )
        actions = tree.rowActions(position="end", actionState="presentRowAction")
        actions.button(
            icon="i", rowAction="inspect", action="inspectRow", id="inspect-row"
        )
        more = actions.dropDownButton("More", action="inspectRow", id="row-more")
        more.menu().menuline(caption="Record row path", code="record").dataController(
            func="recordRow"
        )

        results = content.dl()
        results.dt("Selected path")
        results.dd().code("^.selected", id="selected-row-path")
        results.dt("Last acted-on path")
        results.dd().code("^.acted", id="acted-row-path")
        results.dt("Last action")
        results.dd("^.message", id="row-action-message")
