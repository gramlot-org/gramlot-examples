import { Page as BasePage } from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Drawers: handles, content and retained Data';
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const main_content = root.main({
            class: 'example-page stack',
            height: '100dvh',
            box_sizing: 'border-box',
            display: 'flex',
            flex_direction: 'column',
            overflow: 'hidden',
        });
        main_content.h1('Small handles, readable labels');
        main_content.p('Open and resize the regions; the fields share the same Data.');
        const border = main_content.borderContainer({
            id: 'handles-demo',
            height: '100%',
            min_height: 0,
            flex: '1',
            max_width: '64rem',
            border: '1px solid var(--gramlot-border-control, #aaa)',
            rounded: 12,
        });
        const surface = 'var(--gramlot-surface-subtle, #eef1f5)';
        const search = border.contentPane({
            region: 'top',
            nodeId: 'drawerSearch',
            height: '64px',
            splitter: true,
            drawer: '^drawerSearch',
            drawer_icon: '⌕',
            drawer_label: 'Search',
            drawer_title: 'Search',
            drawer_minimize: true,
            minSize: 36,
            padding: '10px',
            background: surface,
        });
        search.textbox({
            value: '^search',
            lbl: 'Search customers',
            placeholder: 'Type a name',
            width: '100%',
            max_width: '20rem',
        });
        const filters = border.contentPane({
            region: 'left',
            nodeId: 'drawerFilters',
            width: '^filtersWidth',
            splitter: true,
            drawer: '^drawerFilters',
            drawer_label: 'Filters',
            drawer_title: 'Filters',
            minSize: 70,
            padding: '10px',
            background: surface,
        });
        filters.h3('Filters');
        filters.checkbox({ value: '^active', label: 'Active only', mode: 'switch' });
        filters.radioButtonText({
            value: '^delivery',
            values: 'standard:Standard,express:Express,pickup:Pick up',
            cols: 1,
        });
        const details = border.contentPane({
            region: 'right',
            nodeId: 'drawerDetails',
            width: '180px',
            splitter: true,
            drawer: '^drawerDetails',
            drawer_label: 'Details',
            drawer_title: 'Details',
            drawer_minimize: true,
            minSize: 70,
            padding: '10px',
            background: surface,
        });
        details.h3('Customer details');
        details.textbox({ value: '^customer', lbl: 'Customer', width: '100%' });
        details.p('Pull the closed handle inward to open this panel.');
        border
            .contentPane({
                region: 'bottom',
                nodeId: 'drawerOutput',
                height: '64px',
                splitter: true,
                drawer: '^drawerOutput',
                drawer_label: 'Output',
                drawer_title: 'Output',
                minSize: 36,
                padding: '10px',
                background: surface,
            })
            .p('^note', { mask: 'Shared note: {}' });
        const center = border.contentPane({
            region: 'center',
            padding: '16px',
            background: 'var(--gramlot-surface, #fff)',
        });
        center.h2('Customer workspace');
        center.p('^customer', { mask: 'Customer: {}' });
        center.p('^delivery', { mask: 'Delivery: {}' });
        center.textbox({
            id: 'handles-note',
            value: '^note',
            lbl: 'Retained value',
            width: '100%',
            max_width: '18rem',
        });
        center.p(
            'Move over a handle or focus it with Tab. Its label grows over the panel; the fields do not move.',
        );
        center.p(
            'Click to toggle. Drag to resize, even from closed. On touch devices the captions remain visible and compact at rest.',
        );
        for (const title of ['Search', 'Filters', 'Details', 'Output']) {
            main_content.dataSetter({
                destination_path: `drawer${title}`,
                value: title === 'Details' ? 'close' : true,
            });
            main_content.dataController({
                script: "this.SET(path, open ? true : 'close')",
                path: `drawer${title}`,
                ...{ [`subscribe_drawer${title}_closable_change`]: true },
            });
        }
        main_content.dataSetter({ destination_path: 'filtersWidth', value: '180px' });
        main_content.dataSetter({ destination_path: 'customer', value: 'Ada Lovelace' });
        main_content.dataSetter({ destination_path: 'search', value: '' });
        main_content.dataSetter({ destination_path: 'active', value: true });
        main_content.dataSetter({ destination_path: 'delivery', value: 'standard' });
        main_content.dataSetter({ destination_path: 'note', value: 'Same Data, every presentation' });
    }
}
