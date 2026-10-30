import { Page as BasePage } from '@gramlot/gramlot/page';
import catalog from '../../catalog.json' with { type: 'json' };

export class Page extends BasePage {
    // Integrations supply public URLs; direct filesystem pages use sibling paths.
    static galleryUrls = Object.fromEntries(
        catalog.families.flatMap((family) => family.examples.map((demo) => [demo.key, `../${family.folder}/${demo.folder}`])),
    );
    static title = "Switch pages in a single stack";
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const demos = catalog.families.flatMap(family => family.examples).filter(demo => demo.key !== 'l08');
        const main_content = root.main({class:'example-page stack', datapath:'stackDemo'});
        for (const [key, value] of [['active', demos[0].key], ['activeCaption', demos[0].title]]) {
            main_content.dataSetter({destination_path:`.${key}`, value});
        }
        // These URLs are supplied by the host, not static example records.
        main_content.dataSetter({destination_path:'.urls',
            value:Object.fromEntries(demos.map(demo => [demo.key, this.constructor.galleryUrls[demo.key]]))});
        main_content.dataSetter({destination_path:'.titles', value:Object.fromEntries(demos.map(demo => [demo.key, demo.title]))});
        main_content.dataController({
            script:"const demo = keys[panel]; this.SET('.opened.' + demo, this.GET('.urls.' + demo)); this.SET('.active', demo); this.SET('.activeCaption', this.GET('.titles.' + demo));",
            panel:'^.panel', keys:demos.map(demo => demo.key), _delay:350, _onStart:true,
        });
        main_content.h1('Browse, pause and try the demo');
        main_content.p(`Use the slider to choose among ${demos.length} demos. Pause briefly to open your choice in the single central view.`);
        const border = main_content.borderContainer({id:'carousel-layout', height:'min(76vh, 680px)', min_height:'320px',
            rounded:6, border:'1px solid var(--gramlot-border-control, #aaa)'});
        const controls = border.contentPane({region:'top', height:'76px', padding:'6px 12px',
            border_bottom:'1px solid var(--gramlot-border, #ccc)', background:'var(--gramlot-surface-subtle, #eef1f5)'});
        controls.strong('^.activeCaption', {id:'stack-active-title', display:'block', margin_bottom:'4px'});
        controls.horizontalSlider({id:'stack-panel', value:'^.panel', default:0,
            lbl:`Demo index (0–${demos.length - 1})`, lbl_position:'L',
            min:0, max:demos.length - 1, step:1, live:true, width:'100%', min_width:0});
        const center = border.contentPane({region:'center', background:'var(--gramlot-surface, #fff)'});
        const full = center.stackContainer({id:'stack-full', selectedPage:'^.active', height:'100%'});
        for (const demo of demos) {
            full.contentPane({pageName:demo.key}).iframe({id:`live-${demo.key}`, src:`^.opened.${demo.key}`,
                title:demo.title, width:'100%', height:'100%', border:0, display:'block'});
        }
        main_content.p('Visited demos keep their edits. Demos you skip quickly are never loaded. This overview excludes itself.');
    }
}
