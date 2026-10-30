import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Tray workspace';
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class:'example-page stack', padding:'12px', max_width:'none', width:'100%'});
        main_content.p('Arrange four live cards. Drag their titles, select several with Shift+click or an empty-space rectangle, then save and restore the layout.', {margin:'0'});
        const surface = main_content.framePane({height:'max(700px, calc(100dvh - 100px))', border:'1px solid var(--gramlot-border)', border_radius:'8px'});
        layoutToolbar(surface.top);
        surface.center.setAttr({overflow:'auto'});
        const tray = surface.center.trayPane({storepath:'layout', locked:'^ui.locked',
            gridStep:'^ui.gridStep', gridVisible:'^ui.gridVisible', rotationStep:'^ui.rotationStep',
            min_width:'1080px', height:'100%', min_height:'620px', background:'var(--gramlot-surface-subtle)'});
        for (const makeCard of [workspaceCard, mixerCard, checklistCard, memoCard]) makeCard(tray);
    }
}

function layoutToolbar(region) {
    const bar = region.menu({presentation:'bar', height:'42px', border_bottom:'1px solid var(--gramlot-border)'});
    bar.menuline({caption:'Lock layout', icon:'🔒', checked:'^ui.locked', action:"this.SET('ui.locked', !this.GET('ui.locked'))"});
    const controls = bar.contentPane({display:'flex', align_items:'center', gap:'8px', padding:'0 8px'});
    controls.input({type:'number', lbl:'Grid px', lbl_position:'L', value:'^ui.gridStep', default:10, min:0, step:1, width:'58px'});
    controls.checkbox({lbl:'Grid', lbl_position:'R', value:'^ui.gridVisible', default:false});
    controls.input({type:'number', lbl:'Shift °', lbl_position:'L', value:'^ui.rotationStep', default:15, min:0, step:1, width:'58px'});
    bar.spacer({flex:1});
    bar.menuline({caption:'Save layout', action:"this.SET('savedLayout', this.GET('layout').deepcopy()); this.SET('savedSettings', this.GET('ui').deepcopy())"});
    bar.menuline({caption:'Restore', disabled:'^savedLayout:={} == null',
        action:"this.SET('layout', this.GET('savedLayout').deepcopy()); this.SET('ui', this.GET('savedSettings').deepcopy())"});
    region.div("Shift snaps movement, resize and rotation. Lock keeps fields editable. Save keeps a snapshot in this page's Data, not on the server.",
        {padding:'4px 10px', font_size:'12px', color:'var(--gramlot-muted)'});
}

function workspaceCard(tray) {
    const frame = tray.borderContainer({node_label:'workspace', id:'composed-workspace', lbl:'Workspace',
        datapath:'project', minWidth:220, minHeight:320, height:'100%', box_c_padding:'0'});
    const top = frame.contentPane({region:'top', height:'42px', background:'var(--gramlot-surface-subtle)', border_bottom:'1px solid var(--gramlot-border)'});
    const bar = top.menu({presentation:'bar', height:'100%'});
    bar.menuline({caption:'Apply', action:"this.SET('.savedOwner', this.GET('.owner'))"});
    bar.spacer({flex:1});
    bar.menuline({caption:'Reset', action:"this.SET('.owner', 'Ada'); this.SET('.seats', 3); this.SET('.notes', ''); this.SET('.savedOwner', '')"});
    const center = frame.contentPane({region:'center'});
    const tabs = center.tabContainer({id:'workspace-tabs', selectedPage:'^.tab', height:'100%'});
    const details = tabs.contentPane({pageName:'details', title:'Details', padding:'12px'});
    let form = details.formlet({col_min_width:'10rem', lbl_position:'TL', gap:'10px'});
    form.textbox({lbl:'Owner', value:'^.owner', default:'Ada', live:true, width:'100%'});
    form.numberTextBox({lbl:'Seats', value:'^.seats', default:3, dtype:'L', width:'100%'});
    form.checkbox({lbl:'Notifications', value:'^.notifications', default:true});
    const options = tabs.contentPane({pageName:'options', title:'Options', padding:'12px'});
    form = options.formlet({columns:1, lbl_position:'TL', gap:'10px'});
    form.colorpicker({lbl:'Accent', value:'^.accent', default:'#4b78b8'});
    form.horizontalSlider({lbl:'Volume', value:'^.volume', default:40, min:0, max:100, live:true});
    form.textBoxArea({lbl:'Notes', value:'^.notes', default:'', live:true, width:'100%', height:'90px'});
    const footer = frame.contentPane({region:'bottom', height:'30px', padding:'5px 10px', font_size:'12px', background:'var(--gramlot-surface-subtle)', border_top:'1px solid var(--gramlot-border)'});
    footer.span('Last applied: ');
    footer.span('^.savedOwner', {font_weight:'600'});
}

function trayCard(tray, key, title) {
    return tray.div({node_label:key, lbl:title, datapath:key, minWidth:180, minHeight:160});
}
function mixerCard(tray) {
    const card = trayCard(tray, 'mixer', 'Mixer');
    for (const [name, value] of [['bass', 35], ['treble', 65]]) {
        card.horizontalSlider({lbl:name[0].toUpperCase()+name.slice(1), value:`^.${name}`, default:value,
            min:0, max:100, live:true, box_margin_bottom:'12px'});
    }
    card.button('Reset levels', {action:'SET .bass = 35; SET .treble = 65;'});
}
function checklistCard(tray) {
    const card = trayCard(tray, 'checklist', 'Checklist');
    card.p('Ready to publish?', {margin:'0 0 12px'});
    for (const [key, label] of [['content','Content reviewed'], ['links','Links checked'], ['preview','Preview approved']]) {
        card.checkbox({lbl:label, lbl_position:'R', value:`^.${key}`, default:false, box_margin_bottom:'12px', box_width:'max-content'});
    }
}
function memoCard(tray) {
    const card = trayCard(tray, 'memo', 'Notes');
    card.textBoxArea({value:'^.text', default:'Try editing this note, then move the card.', live:true, width:'100%', height:'130px'});
    card.button('Clear', {action:"SET .text = '';", margin_top:'8px'});
}
