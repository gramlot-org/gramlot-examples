from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        section = root.section(padding="16px", border_radius="8px",
                               background="var(--gramlot-surface-subtle)")
        section.h2("Learning topics", color="var(--gramlot-action)")
        items = section.ul()
        for name in ("HTML", "SVG", "Data"):
            items.li(name)
