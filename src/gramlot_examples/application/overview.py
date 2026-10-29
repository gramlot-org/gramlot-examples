from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Invoice application'
    css = ('/themes/gramlot-base/theme.css',)

    def main(self, root):
        pane = root.main(class_='example-page stack', max_width='850px', margin='0 auto', padding='40px')
        pane.div('APPLICATION GALLERY', class_='muted', letter_spacing='.12em', font_size='.8rem')
        pane.h1('Invoice', font_size='3rem', margin_bottom='12px')
        pane.p('Explore real customer selection on the complete Invoice physical model.', font_size='1.2rem')
        card = pane.section(class_='card stack', padding='28px', margin_top='24px')
        card.h2('Customer selectors')
        card.p('Open Invoice in the navigation, then Invoice customers. Compare a record selector with a combobox, inspect the HTML templates and see how selected fields update the page.')
        card.p('Kajenn + Asqueel · PostgreSQL · 3,200 real customers', class_='muted')
        pane.p('Read-only access. This first application trial does not edit invoices or customer records.', class_='muted')
