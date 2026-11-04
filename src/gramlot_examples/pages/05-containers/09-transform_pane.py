"""Share a transform between a gesture surface and ordinary numeric fields."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Move, rotate and zoom a card"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        page = root.main(class_="example-page stack", datapath="transformDemo")
        page.dataFormula(
            ".cardStyle",
            "`transform: translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${zoom});`",
            x="^.pose.x", y="^.pose.y", rotate="^.pose.rotate", zoom="^.pose.zoom", _init=True,
        )

        page.p("Drag anywhere on the stage. On a touch screen, use two fingers to rotate and zoom.")
        stage = page.transformPane(
            id="transform-stage", x="^.pose.x", y="^.pose.y", rotate="^.pose.rotate",
            zoom="^.pose.zoom", min=0.5, max=3, step=0.01, onEnd="recordGesture",
            display="block", overflow="hidden", height="270px", border_radius="8px",
            border="1px solid var(--gramlot-border-control)",
            background="var(--gramlot-surface-subtle)",
        )
        center = stage.div(display="flex", align_items="center", justify_content="center", height="100%")
        center.div(
            "▲  Sample card", id="transform-card", style="^.cardStyle", padding="1rem",
            border="2px solid var(--gramlot-action)", border_radius="8px",
            background="var(--gramlot-field-background)", font_weight="bold",
        )

        controls = page.formlet(col_min_width="9rem", lbl_position="TL")
        for name, label in (("x", "X (px)"), ("y", "Y (px)"), ("rotate", "Angle (°)")):
            controls.numberTextBox(lbl=label, value=f"^.pose.{name}", validate_notnull=True, width="100%")
        controls.numberTextBox(lbl="Zoom", value="^.pose.zoom", min=0.5, max=3, validate_notnull=True, width="100%")
        page.textbox(lbl="Card note", value="^.note", default="This text survives a pose reset.", live=True)
        page.button("Reset pose", action="resetPose")
        page.p("^.gestureCount", mask="Completed gestures: {}")
        page.p("^.lastGesture", id="transform-last-gesture")
