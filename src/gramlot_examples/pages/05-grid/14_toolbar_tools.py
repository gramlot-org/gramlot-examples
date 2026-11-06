"""FrameGrid toolbar tools: export in five formats, print and line numbers."""
from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.main(datapath='sample', padding='20px', max_width='1080px', margin='0 auto')
        frame = main_content.frameGrid(storepath='.rows', rowMode='attributes', searchOn=True,
                                       export=True, printRows=True, advancedTools=True, height='340px')
        s = frame.grid.struct()
        s.column('code', name='Code', width='90px')
        s.column('description', name='Description', width='240px')
        s.column('quantity', name='Quantity', dtype='L', width='100px')
        s.column('price', name='Unit price', dtype='N', format='0.00', width='120px')
