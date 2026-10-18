import { Page as BasePage } from '@gramlot/gramlot/page';
import catalog from '../../catalog.json' with { type: 'json' };

export class Page extends BasePage {
    // The static exporter supplies its file routes; the hosted gallery uses route keys.
    static galleryUrls = Object.fromEntries(
        catalog.families.flatMap((family) => family.examples).map((demo) => [demo.key, demo.key]),
    );
    static title = 'Demo carousel and live preview';
    static devices = ['desktop', 'tablet', 'phone'];
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const demos = catalog.families
            .flatMap((family) => family.examples)
            .filter((demo) => demo.key !== 'l08');
        const pane = root.main({ class: 'example-page stack', datapath: 'stackDemo' });
        for (const [key, value] of [
            ['panel', 0],
            ['page', demos[0]['key']],
            ['caption', demos[0]['title']],
            ['active', demos[0]['key']],
            ['activeCaption', demos[0]['title']],
            ['event', ''],
        ]) {
            pane.dataSetter({ destination_path: `.${key}`, value: value });
        }
        for (const demo of demos) {
            pane.dataSetter({
                destination_path: `.urls.${demo.key}`,
                value: this.constructor.galleryUrls[demo.key],
            });
            pane.dataSetter({ destination_path: `.titles.${demo['key']}`, value: demo['title'] });
            pane.dataSetter({ destination_path: `.opened.${demo['key']}`, value: null });
        }
        pane.dataController({
            script: "if (selected) { this.SET('.caption', this.GET('.titles.' + page)); } this.SET('.event', JSON.stringify(_subscription_kwargs));",
            subscribe_demoStack_selected: true,
        });
        pane.dataController({
            script: "this.SET('.opened.' + demo, this.GET('.urls.' + demo)); this.SET('.active', demo); this.SET('.activeCaption', this.GET('.titles.' + demo));",
            demo: '^.page',
            _delay: 350,
            _onStart: true,
        });
        pane.h1('Browse, pause and try the demo');
        pane.p(
            `Slide through ${demos.length} thumbnails in the drawer. Pause to open the full-size demo in the center. Close the drawer for more space.`,
        );
        const border = pane.borderContainer({
            id: 'carousel-layout',
            height: 'min(76vh, 680px)',
            min_height: '420px',
            rounded: 6,
            border: '1px solid var(--gramlot-border-control, #aaa)',
        });
        border
            .contentPane({
                region: 'top',
                height: '36px',
                padding: '8px 12px',
                border_bottom: '1px solid var(--gramlot-border, #ccc)',
                background: 'var(--gramlot-surface-subtle, #eef1f5)',
            })
            .strong('^.activeCaption', { id: 'stack-active-title', mask: 'Live demo: {}' });
        const drawer = border.contentPane({
            id: 'carousel-drawer',
            region: 'left',
            width: '260px',
            splitter: true,
            minSize: 180,
            maxSize: 400,
            drawer: true,
            drawer_label: 'Demos',
            drawer_icon: '▦',
            padding: '12px',
            background: 'var(--gramlot-surface-subtle, #eef1f5)',
            border_right: '1px solid var(--gramlot-border, #ccc)',
            overflow: 'auto',
        });
        drawer.horizontalSlider({
            id: 'stack-panel',
            value: '^.panel',
            lbl: `Demo index (0–${demos.length - 1})`,
            min: 0,
            max: demos.length - 1,
            step: 1,
            live: true,
            width: '100%',
            min_width: 0,
        });
        drawer.h2('^.caption', { id: 'stack-caption', margin_top: '12px' });
        drawer.p('^.page', { id: 'stack-page', mask: 'Demo: {}' });
        const thumbnails = drawer.stackContainer({
            id: 'stack-demo',
            node_id: 'demoStack',
            selectedPage: '^.page',
            selected: '^.panel',
            height: '300px',
            rounded: 4,
            border: '1px solid var(--gramlot-border-control, #aaa)',
        });
        const center = border.contentPane({ region: 'center', background: 'var(--gramlot-surface, #fff)' });
        const full = center.stackContainer({ id: 'stack-full', selectedPage: '^.active', height: '100%' });
        for (const demo of demos) {
            const panel = thumbnails.contentPane({
                pageName: demo['key'],
                position: 'relative',
                overflow: 'hidden',
            });
            panel.iframe({
                id: `mini-${demo['key']}`,
                src: this.constructor.galleryUrls[demo.key],
                title: demo['title'],
                loading: 'lazy',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '200%',
                height: '200%',
                border: 0,
                transform: 'scale(0.5)',
                max_width: 'none',
                style: 'transform-origin:top left',
            });
            full.contentPane({ pageName: demo['key'] }).iframe({
                id: `live-${demo['key']}`,
                src: `^.opened.${demo['key']}`,
                title: `Live: ${demo['title']}`,
                width: '100%',
                height: '100%',
                border: 0,
                display: 'block',
            });
        }
        pane.p(
            'The center loads a demo only after a pause and keeps visited pages mounted. Thumbnail and full-size views have independent Data. This overview excludes itself.',
        );
    }
}

export class Logic {}
