"""A workspace composed from ordinary Source nodes; layout lives in Data."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Tray workspace"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="12px", max_width="none", width="100%")
        main_content.p("Arrange four live cards. Drag their titles, select several with Shift+click or an empty-space rectangle, then save and restore the layout.", margin="0")
        surface = main_content.framePane(height="max(700px, calc(100dvh - 100px))", border="1px solid var(--gramlot-border)", border_radius="8px")
        layout_toolbar(surface.top)
        surface.center.set_attr(dict(overflow="auto"))
        tray = surface.center.trayPane(storepath="layout", locked="^ui.locked",
            gridStep="^ui.gridStep", gridVisible="^ui.gridVisible", rotationStep="^ui.rotationStep",
            min_width="1080px", height="100%", min_height="620px", background="var(--gramlot-surface-subtle)")
        for make_card in (workspace_card, mixer_card, checklist_card, memo_card):
            make_card(tray)


def layout_toolbar(region):
    bar = region.menu(presentation="bar", height="42px", border_bottom="1px solid var(--gramlot-border)")
    bar.menuline(caption="Lock layout", icon="🔒", checked="^ui.locked", action="this.SET('ui.locked', !this.GET('ui.locked'))")
    controls = bar.contentPane(display="flex", align_items="center", gap="8px", padding="0 8px")
    controls.input(type="number", lbl="Grid px", lbl_position="L", value="^ui.gridStep", default=10, min=0, step=1, width="58px")
    controls.checkbox(lbl="Grid", lbl_position="R", value="^ui.gridVisible", default=False)
    controls.input(type="number", lbl="Shift °", lbl_position="L", value="^ui.rotationStep", default=15, min=0, step=1, width="58px")
    bar.spacer(flex=1)
    bar.menuline(caption="Save layout", action="this.SET('savedLayout', this.GET('layout').deepcopy()); this.SET('savedSettings', this.GET('ui').deepcopy())")
    bar.menuline(caption="Restore", disabled="^savedLayout:={} == null",
        action="this.SET('layout', this.GET('savedLayout').deepcopy()); this.SET('ui', this.GET('savedSettings').deepcopy())")
    region.div("Shift snaps movement, resize and rotation. Lock keeps fields editable. Save keeps a snapshot in this page's Data, not on the server.",
        padding="4px 10px", font_size="12px", color="var(--gramlot-muted)")


def workspace_card(tray):
    frame = tray.borderContainer(node_label="workspace", id="composed-workspace", lbl="Workspace",
                    datapath="project", minWidth=220, minHeight=320,
                    height="100%", box_c_padding="0")
    top = frame.contentPane(region="top", height="42px", background="var(--gramlot-surface-subtle)",
                            border_bottom="1px solid var(--gramlot-border)")
    bar = top.menu(presentation="bar", height="100%")
    bar.menuline(caption="Apply", action="this.SET('.savedOwner', this.GET('.owner'))")
    bar.spacer(flex=1)
    bar.menuline(caption="Reset", action="this.SET('.owner', 'Ada'); this.SET('.seats', 3); this.SET('.notes', ''); this.SET('.savedOwner', '')")
    center = frame.contentPane(region="center")
    tabs = center.tabContainer(id="workspace-tabs", selectedPage="^.tab", height="100%")
    details = tabs.contentPane(pageName="details", title="Details", padding="12px")
    form = details.formlet(col_min_width="10rem", lbl_position="TL", gap="10px")
    form.textbox(lbl="Owner", value="^.owner", default="Ada", live=True, width="100%")
    form.numberTextBox(lbl="Seats", value="^.seats", default=3, dtype="L", width="100%")
    form.checkbox(lbl="Notifications", value="^.notifications", default=True)
    options = tabs.contentPane(pageName="options", title="Options", padding="12px")
    form = options.formlet(columns=1, lbl_position="TL", gap="10px")
    form.colorpicker(lbl="Accent", value="^.accent", default="#4b78b8")
    form.horizontalSlider(lbl="Volume", value="^.volume", default=40, min=0, max=100, live=True)
    form.textBoxArea(lbl="Notes", value="^.notes", default="", live=True, width="100%", height="90px")
    footer = frame.contentPane(region="bottom", height="30px", padding="5px 10px",
                               font_size="12px", background="var(--gramlot-surface-subtle)", border_top="1px solid var(--gramlot-border)")
    footer.span("Last applied: ")
    footer.span("^.savedOwner", font_weight="600")


def tray_card(tray, key, title):
    return tray.div(node_label=key, lbl=title, datapath=key, minWidth=180, minHeight=160)


def mixer_card(tray):
    card = tray_card(tray, "mixer", "Mixer")
    for name, value in (("bass", 35), ("treble", 65)):
        card.horizontalSlider(lbl=name.title(), value=f"^.{name}", default=value,
                              min=0, max=100, live=True, box_margin_bottom="12px")
    card.button("Reset levels", action="SET .bass = 35; SET .treble = 65;")


def checklist_card(tray):
    card = tray_card(tray, "checklist", "Checklist")
    card.p("Ready to publish?", margin="0 0 12px")
    for key, label in (("content", "Content reviewed"), ("links", "Links checked"),
                       ("preview", "Preview approved")):
        card.checkbox(lbl=label, lbl_position="R", value=f"^.{key}", default=False,
                      box_margin_bottom="12px", box_width="max-content")


def memo_card(tray):
    card = tray_card(tray, "memo", "Notes")
    card.textBoxArea(value="^.text", default="Try editing this note, then move the card.",
                     live=True, width="100%", height="130px")
    card.button("Clear", action="SET .text = '';", margin_top="8px")


