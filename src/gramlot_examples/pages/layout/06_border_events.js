import { Page as BasePage } from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Border events and controllers';
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const main_content = root.main({ class: 'example-page stack', datapath: 'events' });
        for (const [name, value] of [
            ['drawerCount', 0],
            ['resizeCount', 0],
            ['drawerMessage', 'No visibility change yet'],
            ['resizeMessage', 'No completed resize yet'],
            ['drawerPayload', '{}'],
            ['resizePayload', '{}'],
            ['hideFilters', false],
            ['name', 'Ada'],
            ['note', 'Keep this draft'],
        ]) {
            main_content.dataSetter({ destination_path: `.${name}`, value: value });
        }
        main_content.dataController({
            script: "this.SET('.drawerCount', count + 1); this.SET('.drawerMessage', region + ': ' + (open ? 'open' : 'closed')); this.SET('.drawerPayload', JSON.stringify(_subscription_kwargs));",
            count: '=.drawerCount',
            subscribe_eventFilters_closable_change: true,
        });
        main_content.dataController({
            script: "this.SET('.resizeCount', count + 1); this.SET('.resizeMessage', region + ': ' + previousSize + ' → ' + size); this.SET('.resizePayload', JSON.stringify(_subscription_kwargs));",
            count: '=.resizeCount',
            subscribe_eventWorkspace_splitter_resize: true,
        });
        main_content.h1('Observe a drawer and a splitter');
        main_content.p(
            'Toggle Filters, drag a separator, or focus a separator and use its arrow keys. The controllers below receive the published payloads.',
        );
        main_content.checkbox({ id: 'events-hide', value: '^.hideFilters', label: 'Hide Filters from Data' });
        const border = main_content.borderContainer({
            id: 'events-border',
            nodeId: 'eventWorkspace',
            height: '360px',
            max_width: '48rem',
            rounded: 10,
            border: '1px solid var(--gramlot-border-control, #aaa)',
        });
        const filters = border.contentPane({
            nodeId: 'eventFilters',
            region: 'left',
            width: '130px',
            minSize: 90,
            maxSize: 230,
            splitter: true,
            drawer: true,
            drawer_label: 'Filters',
            hidden: '^.hideFilters',
            padding: '12px',
            background: 'var(--gramlot-surface-subtle, #eef1f5)',
            border_right: '1px solid var(--gramlot-border-control, #aaa)',
        });
        filters.p('This pane publishes closable_change.');
        filters.textbox({
            id: 'events-name',
            value: '^.name',
            lbl: 'Name (2–20)',
            validate_len: '2:20',
            width: '100%',
        });
        const center = border.contentPane({
            region: 'center',
            padding: '16px',
            background: 'var(--gramlot-surface, #fff)',
        });
        center.textBoxArea({
            id: 'events-note',
            value: '^.note',
            lbl: 'Retained draft',
            rows: 3,
            width: '100%',
            max_width: '18rem',
        });
        center.p(
            'Live resizing keeps these widgets mounted. The resize counter changes only when the gesture finishes.',
        );
        border
            .contentPane({
                region: 'bottom',
                height: '52px',
                minSize: 36,
                maxSize: 120,
                splitter: true,
                padding: '12px',
                border_top: '1px solid var(--gramlot-border-control, #aaa)',
                background: 'var(--gramlot-surface-subtle, #eef1f5)',
            })
            .p('Resize this bottom region too.');
        const report = main_content.section({ class: 'card stack', max_width: '48rem' });
        report.h2('Received by dataController');
        report.p('^.drawerCount', { id: 'events-drawer-count', mask: 'Visibility events: {}' });
        report.p('^.drawerMessage');
        report.pre('^.drawerPayload', {
            id: 'events-drawer-payload',
            white_space: 'pre-wrap',
            overflow_wrap: 'anywhere',
        });
        report.p('^.resizeCount', { id: 'events-resize-count', mask: 'Completed resizes: {}' });
        report.p('^.resizeMessage');
        report.pre('^.resizePayload', {
            id: 'events-resize-payload',
            white_space: 'pre-wrap',
            overflow_wrap: 'anywhere',
        });
        main_content.p(
            "No events are emitted at startup. The Data checkbox changes visibility too; it does not change the drawer's own open/closed preference.",
        );
    }
}
