import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Editing · drafts and validation';
    main(root) {
        const main = root.main({padding:"20px", max_width:"1120px", margin:"0 auto"});
        const form = main.div({form:true, datapath:"sample", node_label:"editing", selfsubscribe_formStatus:"this.SET('ui.status',p_0.status); this.SET('ui.canSave',p_0.canSave);"});
        const bar = form.div({display:"flex", gap:"12px", align_items:"center", flex_wrap:"wrap", padding:"10px 12px", background:"var(--gramlot-surface-subtle)", border_radius:"8px", margin_bottom:"12px"});
        bar.span("Session", {color:"var(--gramlot-text-secondary)"});
        bar.span("^ui.status", {id:"editing-status", role:"status", font_weight:"600", color:"^ui.status:=({ok:'var(--gramlot-success,#247044)',changed:'var(--gramlot-warning,#805600)',error:'var(--gramlot-error,#b3261e)',pending:'var(--gramlot-text-secondary)'}[{}])"});
        bar.div({flex:1});
        bar.editingStatus({id:"editing-reports"});
        bar.button("Accept locally", {id:"editing-accept", disabled:"^ui.canSave:=!{}", action:"if(this.formState.accept()){this.SET('ui.notice','Accepted locally. Restore now returns to this snapshot.');}"});
        bar.button("Restore", {id:"editing-restore", action:"this.formState.restore(); this.SET('ui.notice','Restored the accepted snapshot, including all grid rows.');"});
        form.textbox({value:"^.title", id:"editing-title", lbl:"Batch name · shared form field", validate_notnull:true, width:"280px", margin_bottom:"12px"});
        const frame = form.frameGrid({storepath:".rows", rowMode:"values", searchOn:true, height:"390px"});
        frame.grid.setAttr({id:"grid-editing-demo", rowHeaders:true, rowResize:true});
        const s = frame.grid.struct();
        s.column({field:"code", name:"Code", width:"95px"});
        s.column({field:"description", name:"Description · required", width:"240px", edit:{validate_notnull:true}});
        s.column({field:"quantity", name:"Quantity · ≥ 0", dtype:"L", width:"130px", edit:{validate_min:0}});
        s.column({field:"reference", name:"Reference · async check", width:"180px", edit:{validate_remote:"check_reference", validate_timeout:5000}});
        s.column({field:"notes", name:"Notes", width:"320px", white_space:"pre-wrap", edit:{tag:"textBoxArea"}});
        form.p("^ui.notice", {id:"editing-notice", color:"var(--gramlot-text-secondary)", min_height:"1.4em"});

    }
    async check_reference({value}) {
        await new Promise(resolve => setTimeout(resolve,1500));
        return value.trim().toLowerCase() === 'taken'
            ? {errorcode:'reserved',message:'This reference is reserved. Use available instead.'} : {value};
    }
}
Page.registerEndpoint('check_reference');
