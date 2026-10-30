import {Page as BasePage} from '@gramlot/gramlot/page';

const STAGES = {"idea": "M12 3a6 6 0 0 0-3 11v3h6v-3a6 6 0 0 0-3-11ZM9 21h6", "review": "M4 4h16v16H4ZM8 9h8M8 13h6", "ready": "m5 12 4 4L19 6"};

export class Page extends BasePage {
    static title = "Dialog: modal editing";
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const content = root.main({datapath:'workspace', class:'example-content stack', max_width:'48rem', padding:'12px'});
        content.h1("Dialog: modal editing");
        content.p("Open the dialog and try the background counter: it is blocked until you close the dialog. Edit the title, close and reopen: the draft is retained.");
        const actions = content.div({display:'flex', flex_wrap:'wrap', gap:'8px'});
        actions.button('Open dialog', {action:"this.SET('.open', true)"});
        actions.button('Background counter', {action:"this.SET('.clicks', (this.GET('.clicks') || 0) + 1)"});
        const card = content.section({class:'card stack'});
        card.h2('The page behind the window');
        card.p('The left toolbar selects a stage; the top toolbar edits the title; Done closes the window. All three bars belong to the same framePane.');
        card.div("^.clicks", {mask:"Background clicks: {}", role:'status'});
        card.div('^.title', {mask:'Shared title: {}'});
        const window = content.dialog({title:'Edit document', open:'^.open', width:'440px', height:'300px',
            movable:true, resizable:true, collapsible:true, maximizable:true});
        window.frame.left.setAttr({width:'44px', background:'var(--gramlot-surface-subtle)', border_right:'1px solid var(--gramlot-border)'});
        const stages = window.frame.left.menu({presentation:'bar', orientation:'vertical', labelPosition:'tooltip', iconSize:20});
        for (const [stage, drawing] of Object.entries(STAGES)) {
            const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7c899c" stroke-width="1.8"><path d="${drawing}"/></svg>`;
            const caption = stage[0].toUpperCase() + stage.slice(1);
            stages.menuline({caption, tooltip:caption, iconSrc:'data:image/svg+xml,' + encodeURIComponent(icon),
                checked:`^.stage:={} === '${stage}'`, action:`this.SET('.stage', '${stage}')`});
        }
        const toolbar = window.frame.top.menu({presentation:'bar', padding:'3px 6px', background:'var(--gramlot-surface-subtle)'});
        toolbar.menuline({caption:'Uppercase title', action:"this.SET('.title', this.GET('.title').toUpperCase())"});
        const fields = window.frame.center.formlet({padding:'12px', columns:1, lbl_position:'TL', box_c_width:'100%'});
        fields.textbox({lbl:'Title', value:'^.title', live:true});
        fields.filteringSelect({lbl:'Stage', value:'^.stage', values:'idea:Idea,review:Review,ready:Ready'});
        const footer = window.frame.bottom.menu({presentation:'bar', padding:'3px 6px', background:'var(--gramlot-surface-subtle)'});
        footer.spacer({flex:1});
        footer.menuline({caption:'Done', action:"this.SET('.open', false)"});
    }
}
