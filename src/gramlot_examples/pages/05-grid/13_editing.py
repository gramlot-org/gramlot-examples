"""Local shared editing and validation across a virtualized resident grid."""
import asyncio
from gramlot import Page as BasePage, endpoint


class Page(BasePage):
    def main(self, root):
        main = root.main(padding='20px', max_width='1120px', margin='0 auto')
        form = main.div(form=True, datapath='sample', node_label='editing',
            selfsubscribe_formStatus="this.SET('ui.status',p_0.status); this.SET('ui.canSave',p_0.canSave);")
        bar = form.div(display='flex', gap='12px', align_items='center', flex_wrap='wrap', padding='10px 12px', background='var(--gramlot-surface-subtle)', border_radius='8px', margin_bottom='12px')
        bar.span('Session', color='var(--gramlot-text-secondary)')
        bar.span('^ui.status', id='editing-status', role='status', font_weight='600',
            color="^ui.status:=({ok:'var(--gramlot-success,#247044)',changed:'var(--gramlot-warning,#805600)',error:'var(--gramlot-error,#b3261e)',pending:'var(--gramlot-text-secondary)'}[{}])")
        bar.div(flex=1)
        bar.editingStatus(id='editing-reports')
        bar.button('Accept locally', id='editing-accept', disabled='^ui.canSave:=!{}', action='validateAndAccept')
        bar.button('Test unopened cell', id='editing-unopened', action="this.SET('.rows.r800.quantity',-1); this.SET('ui.notice','Row 801 has a negative quantity. Accept locally checks it without opening an editor.');")
        bar.button('Restore', id='editing-restore', action="this.formState.restore(); this.SET('ui.notice','Restored the accepted snapshot, including all grid rows.');")
        form.textbox(value='^.title', id='editing-title', lbl='Batch name · shared form field', validate_notnull=True, width='280px', margin_bottom='12px')
        frame = form.frameGrid(storepath='.rows', rowMode='values', searchOn=True, height='390px')
        frame.grid.set_attr(id='grid-editing-demo', rowHeaders=True, rowResize=True)
        s = frame.grid.struct()
        s.column('code', name='Code', width='95px')
        s.column('description', name='Description · required', width='240px', edit=dict(validate_notnull=True))
        s.column('quantity', name='Quantity · ≥ 0', dtype='L', width='130px', edit=dict(validate_min=0))
        s.column('reference', name='Reference · async check', width='180px', edit=dict(validate_remote='check_reference', validate_timeout=5000))
        s.column('notes', name='Notes', width='320px', white_space='pre-wrap', max_height='96px', edit=dict(tag='textBoxArea'))
        form.p('^ui.notice', id='editing-notice', color='var(--gramlot-text-secondary)', min_height='1.4em')

    @endpoint
    async def check_reference(self, value: str):
        if value.strip().lower() == 'taken':
            await asyncio.sleep(1.5)
        return {'errorcode': 'reserved', 'message': 'This reference is reserved. Use available instead.'} if value.strip().lower() == 'taken' else {'value': value}
