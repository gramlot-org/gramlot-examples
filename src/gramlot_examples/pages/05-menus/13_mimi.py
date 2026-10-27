from gramlot_examples.trials.menu.theme_preview import PreviewPage


class Page(PreviewPage):
    title = "Mimi appearance review"
    profile = "Mimi"
    density = "24px controls / 12.5px text"
    css = ('/themes/gramlot-compact/theme.css', '/themes/mimi/theme.css')
