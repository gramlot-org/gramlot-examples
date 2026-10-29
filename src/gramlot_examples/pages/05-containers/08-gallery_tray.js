import {Bag} from '@gramlot/gramlot';
import {Page as BasePage} from '@gramlot/gramlot/page';
import inputs from '../../gallery/dist/inputs/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';
import catalog from '../../catalog.json' with {type:'json'};

const EXCLUDED = new Set(['gallery-tray', 'l08']);

export class Page extends BasePage {
    static title = 'Gallery tray';
    static gramlots = [inputs, layout];
    static devices = ['desktop', 'tablet', 'phone'];
    static galleryUrls = Object.fromEntries(catalog.families.flatMap(family =>
        family.examples.map(demo => [demo.key, `../${family.folder}/${demo.folder}`])));

    main(root) {
        const main_content = root.main({datapath:'galleryTray', class:'example-page stack',
            padding:'12px', max_width:'none', width:'100%'});
        main_content.p('Choose an example and press Add. Each card opens a live page at 65% zoom. Drag its title or use rotation, zoom and layer on the left. The cross removes a card.', {margin:'0'});
        // Catalogue titles and host-specific URLs are generated, not sample records.
        main_content.dataSetter({destination_path:'.examples', value:Object.fromEntries(catalog.families.flatMap(family =>
            family.examples.filter(demo => !EXCLUDED.has(demo.key)).map(demo =>
                [demo.key, {title:demo.title, url:this.constructor.galleryUrls[demo.key]}])))});
        const frame = main_content.framePane({height:'max(660px, calc(100dvh - 100px))',
            border:'1px solid var(--gramlot-border)', border_radius:'8px'});
        main_content.dataFormula({result_path:'.count', formula:'layout.getNodes().length', layout:'^.layout', _init:true});
        examplePicker(frame.top);
        frame.center.setAttr({overflow:'auto'});
        frame.center.trayPane({nodeId:'galleryTray', id:'gallery-tray', storepath:'.layout',
            min_width:'1100px', height:'100%', min_height:'700px', background:'var(--gramlot-surface-subtle)'});
    }
}

function examplePicker(region) {
    const bar = region.menu({presentation:'bar', height:'42px', border_bottom:'1px solid var(--gramlot-border)'});
    const tools = bar.contentPane({display:'flex', align_items:'center', gap:'8px', padding:'0 8px'});
    const picker = tools.select({id:'tray-example', value:'^.choice', default:'', aria_label:'Example', width:'min(440px, 55vw)'});
    picker.option('Choose an example…', {value:''});
    for (const family of catalog.families) {
        const group = picker.optgroup({label:family.title});
        for (const demo of family.examples) if (!EXCLUDED.has(demo.key)) group.option(demo.title, {value:demo.key});
    }
    tools.button('Add', {id:'tray-add', disabled:'^.choice:=!{}'}).dataController({func:'addExample'});
    bar.spacer({flex:1});
    bar.contentPane().span('^.count', {mask:'{} cards', padding:'0 10px'});
}

/** Page logic shared by Python and JS. No widget or application state lives here. */
export class Logic {
    addExample(node) {
        const example = node.GET('.examples.' + node.GET('.choice'));
        const index = node.GET('.sequence') || 0;
        const key = `card_${index + 1}`;
        const row = Math.floor(index / 2);
        node.SET(`.layout.${key}`, new Bag({left:20 + (index % 2) * 430, top:20 + row * 340,
            width:600, height:460, layer:0, rotation:0, scale:0.65, selected:false}));
        const tray = node.builder.nodeById('galleryTray');
        tray.setAttr({min_height:`${Math.max(700, (row + 1) * 340 + 180)}px`});
        const card = tray.div({node_label:key, lbl:example.getItem('title'), closable:true, height:'100%',
            minWidth:300, minHeight:220, box_c_padding:0});
        card.iframe({src:example.getItem('url'), title:example.getItem('title'),
            width:'100%', height:'100%', border:0, display:'block'});
        node.SET('.sequence', index + 1);
    }
}
