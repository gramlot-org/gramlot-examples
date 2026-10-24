import inputs from '../../gallery/dist/inputs/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';
const icon = drawing => 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7b8795" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+drawing+'</svg>');
export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = "Compare desktop and touch themes";
    static devices = ['desktop','tablet','phone'];
    main(root) {
        const content = root.main({class:'example-page stack',max_width:'760px'});
        content.h1('Mela: desktop and touch');
        content.p('In Gallery Settings choose Theme → Mela and Colors → Theme default. Switch between Light and Dark, then narrow the window to compare compact desktop controls with touch-sized fields. Changing the theme keeps your entries.');
        content.p('Try Document for the hierarchical menu. Open the dialog to test modality, or the floating window to keep using this content. Both windows share the same draft fields.');
        const panel = content.framePane({height:'320px',border:'1px solid var(--gramlot-border)',border_radius:'var(--gramlot-radius)',overflow:'hidden'});
        this.toolbar(panel.top); this.fields(panel.center);
        panel.bottom.div('^mela.notice',{role:'status',padding:'6px 12px',default:'Ready',id:'mela-status'});
        const actions=content.div({display:'flex',flex_wrap:'wrap',gap:'8px'});
        actions.button('Open dialog…',{id:'mela-open-dialog'}).dataController({script:"this.SET('mela.dialogOpen', true)"});
        actions.button('Open floating…',{id:'mela-open-floating'}).dataController({script:"this.SET('mela.floatingOpen', true)"});
        for(const kind of ['dialog','floatingPane']) {
            const modal=kind==='dialog';
            const window=root[kind]({title:'Document preview',open:modal?'^mela.dialogOpen':'^mela.floatingOpen',width:'480px',height:'360px',movable:true,resizable:true,maximizable:true,id:modal?'mela-dialog':'mela-floating'});
            this.toolbar(window.frame.top);this.fields(window.frame.center);
            const footer=window.frame.bottom.menu({presentation:'bar',padding:'4px 8px',background:'var(--gramlot-surface-subtle)'});
            footer.spacer({flex:1});
            footer.menuline({caption:'Done'}).dataController({script:modal?"this.SET('mela.dialogOpen', false)":"this.SET('mela.floatingOpen', false)"});
        }
    }
    toolbar(parent) {
        const bar=parent.menu({presentation:'bar',iconSize:20,padding:'3px 6px',background:'var(--gramlot-surface-subtle)',border_bottom:'1px solid var(--gramlot-border)'});
        bar.menuline({caption:'Preview',iconSrc:icon('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>')}).dataController({script:"this.SET('mela.notice', 'Preview requested')"});
        bar.spacer({flex:1});
        const menu=bar.menuline({caption:'Document'}).menu();
        menu.menuline({caption:'Save draft',iconSrc:icon('<path d="m5 12 4 4L19 6"/>')}).dataController({script:"this.SET('mela.notice', 'Draft kept in local Data')"});
        menu.menuline('-');
        const submenu=menu.menuline({caption:'Export'}).menu();
        submenu.menuline({caption:'PDF',disabled:true});
        submenu.menuline({caption:'Text preview'}).dataController({script:"this.SET('mela.notice', 'Text preview requested')"});
    }
    fields(pane) {
        pane.setAttr({padding:'12px',overflow:'auto'});
        const fields=pane.formlet({columns:1,lbl_position:'TL',box_c_width:'100%',gap:'10px'});
        fields.textbox({lbl:'Title',value:'^mela.title',placeholder:'Enter a document title'});
        fields.filteringSelect({lbl:'Visibility',value:'^mela.visibility',values:'private:Private,team:Team',default:'private'});
        fields.checkbox({lbl:'Options',label:'Show details',value:'^mela.details',default:true});
    }
}
