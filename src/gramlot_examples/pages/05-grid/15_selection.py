"""Row selection: the three modes and the Data paths the grid publishes."""
from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.main(datapath='sample', padding='20px', max_width='1080px', margin='0 auto')
        main_content.radioButtonText(value='^.mode', values='none:None,single:Single,multi:Multi',
                                     lbl='selectionMode', margin_bottom='12px')
        frame = main_content.frameGrid(storepath='.rows', rowMode='attributes', rowHeaders=True,
                                       selectionMode='^.mode', selectedId='^.id', selectedPkeys='^.keys',
                                       selected_description='^.names', height='300px')
        s = frame.grid.struct()
        s.column('code', name='Code', width='90px')
        s.column('description', name='Description', width='240px')
        s.column('quantity', name='Quantity', dtype='L', width='100px')
        s.column('price', name='Unit price', dtype='N', format='0.00', width='120px')
        facts = main_content.dl(margin_top='12px')
        facts.dt('selectedId')
        facts.dd('^.id')
        facts.dt('selectedPkeys')
        facts.dd('^.keys')
        facts.dt('selected_description')
        facts.dd('^.names')
        facts.dt('selectionLength')
        facts.dd('^.selectionLength')
