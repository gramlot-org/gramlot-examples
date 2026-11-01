"""Local shared editing and validation across a virtualized resident grid."""
import asyncio
from gramlot import Page as BasePage, endpoint


class Page(BasePage):
    title = 'Editing · drafts and validation'

    def main(self, root):
        main = root.main(padding='20px', max_width='1120px', margin='0 auto')
        main.p('GRID / EDITING', color='var(--gramlot-text-secondary)', font_size='11px', letter_spacing='.12em', margin='0 0 8px')
        main.h2('Your edits stay with you', margin='0 0 8px')
        main.p('1,000 rows · one editing session · validation continues while you scroll.', color='var(--gramlot-text-secondary)', margin='0 0 18px')
        form = main.div(form=True, datapath='sample', node_label='editing',
            selfsubscribe_formStatus="this.SET('ui.status',p_0.status); this.SET('ui.canSave',p_0.canSave);")
        bar = form.div(display='flex', gap='12px', align_items='center', flex_wrap='wrap', padding='10px 12px', background='var(--gramlot-surface-subtle)', border_radius='8px', margin_bottom='12px')
        bar.span('Session', color='var(--gramlot-text-secondary)')
        bar.span('^ui.status', id='editing-status', role='status', font_weight='600',
            color="^ui.status:=({ok:'var(--gramlot-success,#247044)',changed:'var(--gramlot-warning,#805600)',error:'var(--gramlot-error,#b3261e)',pending:'var(--gramlot-text-secondary)'}[{}])")
        bar.div(flex=1)
        bar.editingStatus(id='editing-reports')
        bar.button('Accept locally', id='editing-accept', disabled='^ui.canSave:=!{}', action="if(this.formState.accept()){this.SET('ui.notice','Accepted locally. Restore now returns to this snapshot.');}")
        bar.button('Restore', id='editing-restore', action="this.formState.restore(); this.SET('ui.notice','Restored the accepted snapshot, including all grid rows.');")
        form.textbox(value='^.title', id='editing-title', lbl='Batch name · shared form field', validate_notnull=True, width='280px', margin_bottom='12px')
        frame = form.frameGrid(storepath='.rows', rowMode='values', searchOn=True, height='390px')
        frame.grid.set_attr(id='grid-editing-demo', rowHeaders=True, rowResize=True)
        s = frame.grid.struct()
        s.column('code', name='Code', width='95px')
        s.column('description', name='Description · required', width='240px', edit=dict(validate_notnull=True))
        s.column('quantity', name='Quantity · ≥ 0', dtype='L', width='130px', edit=dict(validate_min=0))
        s.column('reference', name='Reference · async check', width='180px', edit=dict(validate_remote='check_reference', validate_timeout=5000))
        s.column('notes', name='Notes', width='320px', white_space='pre-wrap', edit=dict(tag='textBoxArea'))
        form.p('^ui.notice', id='editing-notice', color='var(--gramlot-text-secondary)', min_height='1.4em')
        guide = main.div(padding='14px 18px', border='1px solid var(--gramlot-border)', border_radius='8px')
        guide.h3('Try these checks', margin='0 0 8px')
        steps = guide.ol(margin=0, padding_left='20px', line_height='1.7')
        steps.li('Draft: double-click Quantity, type only a minus sign (-), then scroll far away and back. Reopen the cell: the unfinished text is still there.')
        steps.li('Error: enter -3 in Quantity and press Enter. Scroll away and back: the cell remains marked. Correct it to 3 to clear the error.')
        steps.li('Reports: Errors and Changes include both the batch name and grid cells. Select an entry to return to it, even after scrolling away. Changes show the original and current values until Accept locally or Restore.')
        steps.li('Async: type taken in Reference and press Enter, then scroll away. The session shows pending for 1.5 seconds, then error. Return to the cell to see the message; type available to resolve it.')
        main.p('Double-click, Enter or F2 opens an editor. Tab moves to the next editable cell. Up/Down move along the same column; Left/Right move the caret; at the beginning/end they open the previous/next editable cell. Multiline text and popup controls keep their own arrows. Accept locally is enabled only after all drafts and errors are resolved. Restore discards changes since the last accepted snapshot. The validation endpoint checks a value only; it does not write to a database.', color='var(--gramlot-text-secondary)', font_size='13px')

    @endpoint
    async def check_reference(self, value: str):
        await asyncio.sleep(1.5)
        return {'errorcode': 'reserved', 'message': 'This reference is reserved. Use available instead.'} if value.strip().lower() == 'taken' else {'value': value}
