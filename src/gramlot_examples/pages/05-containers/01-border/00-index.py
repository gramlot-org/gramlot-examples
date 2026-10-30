"""Introduction to the borderContainer lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Border containers"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1("One workspace, five regions")
        main_content.p("A borderContainer divides a workspace into top, bottom, left, right and center. The surrounding regions hold tools and context; the center uses the space that remains for the main task.")
        main_content.p("Try dragging the two vertical separators below. The side panels change width and the center adjusts with them.")
        layout = main_content.borderContainer(id="border-overview", height="300px", max_width="60rem",
                                      border="1px solid var(--gramlot-border-control)", border_radius="10px")
        surface = "var(--gramlot-surface-subtle)"
        layout.contentPane(region="top", height="42px", padding="10px", background=surface).strong("Top — workspace title")
        layout.contentPane(region="bottom", height="36px", padding="8px", background=surface).span("Bottom — status and shared tools")
        layout.contentPane(region="left", width="20%", minSize=60, maxSize=240, splitter=True,
                           padding="12px", background=surface).p("Left — navigation")
        layout.contentPane(region="right", width="20%", minSize=60, maxSize=240, splitter=True,
                           padding="12px", background=surface).p("Right — details")
        center = layout.contentPane(region="center", padding="16px", background="var(--gramlot-surface)")
        center.h2("Center")
        center.p("Your main content fits here. You can put another container inside any region when part of the page needs its own layout.")
        main_content.h2("A region can hold a whole task")
        main_content.p("Regions can contain ordinary fields, forms or another layout. Splitters resize them. Drawers put a panel away and bring it back with the same controls and Data.")
        main_content.h2("Choose a lesson")
        main_content.p("Expand the border branch in the gallery navigation. Selecting this branch opens the introduction; its arrow loads the individual lessons.")
        lessons = main_content.ul()
        for text in (
            "Border regions and splitters: arrange a customer workspace and resize its side panels.",
            "Nested borders and layout designs: give an inner editor its own regions.",
            "Rounded borders and popups: combine rounded containers with popup controls.",
            "Drawers: hide and reopen tools while keeping entered values.",
            "Nested regions playground: explore several independent layouts in one page.",
            "Border events and controllers: observe resizing and opening through Data counters.",
        ):
            lessons.li(text)
