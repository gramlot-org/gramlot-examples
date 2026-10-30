import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Form state';
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class:'example-page stack',max_width:'48rem'});
        main_content.h1('A form remembers');
        main_content.p('Change Mario to Luigi, then back to Mario. Clear the name, type an incomplete date, or try the code taken. Watch the save indicator.');
        const form = main_content.groupBox({lbl:'Profile',form:true,datapath:'record',
            selfsubscribe_formStatus:"this.SET('ui.status',p_0.status); this.SET('ui.canSave',p_0.canSave);"});
        this.fields(form.formlet({columns:2,col_min_width:'16rem',lbl_position:'TL',box_c_width:'100%'}));
        this.actions(form);
        main_content.p('^ui.notice',{color:'var(--gramlot-text-secondary)'});
        const panel = main_content.groupBox({lbl:'Current Data',class:'stack'});
        for (const [label,path] of [['Name','name'],['Amount','amount'],['Date','date'],['Code','code']]) {
            panel.div('^record.'+path,{lbl:label,lbl_position:'L',...(path==='date'?{format:'short',dtype:'D'}:{})});
        }
        main_content.p('Save locally accepts a snapshot for this page only. Restore uses that snapshot. Nothing is written to a server; reloading starts with the example data.');
    }
    fields(form) {
        form.textbox({id:'form-name',value:'^.name',lbl:'Name',validate_notnull:true});
        form.numberTextBox({id:'form-amount',value:'^.amount',lbl:'Amount (zero or more)',validate_min:0});
        form.dateTextBox({id:'form-date',value:'^.date',lbl:'Date',validate_notnull:true});
        form.textbox({id:'form-code',value:'^.code',lbl:'Code (remote check)',validate_remote:'check_code',validate_timeout:3000});
    }
    actions(form) {
        const bar=form.div({display:'flex',gap:'8px',align_items:'center',margin_top:'10px'});
        bar.span('^ui.status',{id:'form-status',role:'status',font_weight:'600',
            color:"^ui.status:=({ok:'var(--gramlot-success,#247044)',changed:'var(--gramlot-warning,#805600)',error:'var(--gramlot-error,#b3261e)',pending:'var(--gramlot-text-secondary)'}[{}])"});
        bar.button('Save locally',{id:'form-save',disabled:'^ui.canSave:=!{}',
            action:"if(this.formState.accept()){this.SET('ui.notice','Local snapshot accepted. No server write.');}"});
        bar.button('Restore',{id:'form-restore',action:"this.formState.restore(); this.SET('ui.notice','Restored the accepted snapshot.');"});
    }
    async check_code({value}) {
        await new Promise(resolve=>setTimeout(resolve,400));
        return value==='taken' ? {errorcode:'reserved',message:'This code is reserved.'} : {value};
    }
}
Page.registerEndpoint('check_code');
