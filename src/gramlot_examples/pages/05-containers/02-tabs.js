import { Page as BasePage } from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Tabs, selection and closing';
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const main_content = root.main({ class: 'example-page stack', datapath: 'tabsDemo' });
        for (const [key, value] of [
            ['page', 'customer'],
            ['index', 0],
            ['name', 'Ada'],
            ['notes', 'These Data survive closing Notes.'],
            ['variantMessage', 'Please confirm the delivery address.'],
            ['mode', 'tabs'],
            ['position', 'top'],
            ['align', 'start'],
            ['unread', 3],
            ['badgeColor', 'crimson'],
            ['notesIcon', '✉'],
            ['locked', false],
            ['events', ''],
            ['closed', 'None'],
        ]) {
            main_content.dataSetter({ destination_path: `.${key}`, value: value });
        }
        for (const topic of ['hiding', 'showing', 'selected', 'closing', 'closed']) {
            main_content.dataController({
                script: "this.SET('.events', history + topic + ': ' + JSON.stringify(_subscription_kwargs) + '\\n');",
                history: '=.events',
                topic: topic,
                ...{ [`subscribe_editor_${topic}`]: true },
            });
        }
        main_content.dataController({ script: "this.SET('.closed', pageName)", subscribe_editor_closed: true });
        this.tab_variants(main_content);
        this.tab_alignment(main_content);
        main_content.h2('Try the controls, selection and closing');
        main_content.p(
            'Try a one-letter name, switch away and return: the invalid draft remains. Close Notes: its Source disappears, but the saved notes below remain.',
        );
        const controls = main_content.formlet({ col_min_width: '14rem', max_width: '36rem' });
        controls.filteringSelect({
            id: 'tabs-choice',
            value: '^.page',
            lbl: 'Selected page',
            values: 'customer:Customer,notes:Notes,layout:Nested border',
        });
        controls.filteringSelect({
            id: 'tabs-mode',
            value: '^.mode',
            lbl: 'Presentation',
            values: 'tabs:Tabs,underline:Underline',
        });
        controls.filteringSelect({
            id: 'tabs-position',
            value: '^.position',
            lbl: 'Tab position',
            values: 'top:Top,bottom:Bottom,left:Left,right:Right',
        });
        controls.filteringSelect({
            id: 'tabs-align',
            value: '^.align',
            lbl: 'Alignment along the strip',
            values: 'start:Start,center:Center,end:End',
        });
        controls.horizontalSlider({
            id: 'tabs-unread',
            value: '^.unread',
            lbl: 'Unread messages',
            min: 0,
            max: 12,
            step: 1,
            live: true,
            width: '14rem',
            max_width: '100%',
        });
        controls.filteringSelect({
            id: 'tabs-badge-color',
            value: '^.badgeColor',
            lbl: 'Badge color',
            values: 'crimson:Crimson,seagreen:Green,royalblue:Blue',
        });
        controls.filteringSelect({
            id: 'tabs-icon',
            value: '^.notesIcon',
            lbl: 'Notes icon',
            values: '✉:Envelope,●:Dot,★:Star',
        });
        controls.checkbox({
            id: 'tabs-lock',
            value: '^.locked',
            label: 'Prevent closing Notes',
            mode: 'switch',
        });
        main_content.p(
            'Change position and presentation while keeping a draft. Move the unread slider while Notes is inactive: its badge updates immediately.',
        );
        main_content.p('^.index', { id: 'tabs-index', mask: 'Selected index: {}' });
        const tabs = main_content.tabContainer({
            id: 'tabs-demo',
            nodeId: 'editor',
            selectedPage: '^.page',
            selected: '^.index',
            tabMode: '^.mode',
            tabPosition: '^.position',
            tabAlign: '^.align',
            height: '300px',
            max_width: '44rem',
            border: '1px solid var(--gramlot-border-control, #aaa)',
            rounded: 6,
        });
        const customer = tabs.contentPane({
            id: 'customer-panel',
            pageName: 'customer',
            title: 'Customer',
            icon: '👤',
            padding: '12px',
        });
        customer.textbox({
            id: 'tabs-name',
            value: '^.name',
            lbl: 'Name (2–20)',
            validate_len: '2:20',
            live: true,
            width: '15rem',
        });
        customer.p('The accepted Data value:');
        customer.p('^.name', { id: 'tabs-accepted' });
        const notes = tabs.contentPane({
            id: 'notes-panel',
            pageName: 'notes',
            title: 'Notes',
            icon: '^.notesIcon',
            badge: '^.unread',
            badge_color: '^.badgeColor',
            closable: true,
            onClose: "return !this.GET('.locked')",
            padding: '12px',
        });
        notes.textBoxArea({
            id: 'tabs-notes',
            value: '^.notes',
            lbl: 'Notes',
            rows: 3,
            width: '100%',
            max_width: '24rem',
        });
        const nested = tabs.borderContainer({
            id: 'tabs-border',
            pageName: 'layout',
            title: 'Nested border',
            icon: '▦',
        });
        nested
            .contentPane({
                region: 'left',
                width: '100px',
                splitter: true,
                drawer: true,
                drawer_label: 'Tools',
                padding: '10px',
                background: 'var(--gramlot-surface-subtle, #eef1f5)',
            })
            .p('Resize me');
        nested
            .contentPane({ region: 'center', padding: '12px' })
            .textbox({ value: '^.name', lbl: 'Same accepted name', width: '15rem' });
        main_content.p('^.closed', { id: 'tabs-closed', mask: 'Last closed: {}' });
        main_content.p('^.notes', { id: 'tabs-saved-notes', mask: 'Saved notes: {}' });
        main_content.h2('Container events');
        main_content.pre('^.events', {
            id: 'tabs-events',
            max_height: '12rem',
            overflow: 'auto',
            white_space: 'pre-wrap',
            overflow_wrap: 'anywhere',
        });
    }

    tab_variants(main_content) {
        main_content.h1('See the tab variants side by side');
        main_content.p(
            'Compare shaped tabs with a light underline, on each of the four sides. Every card is a working editor. Change the name in one: the others show the same Data.',
        );
        main_content.p(
            'Top and bottom use a horizontal row. Left and right use a vertical list; the words remain horizontal so they are easy to read.',
        );
        const grid = main_content.section({
            id: 'tab-variants',
            display: 'grid',
            grid_template_columns: 'repeat(auto-fit, minmax(min(100%, 24rem), 1fr))',
            gap: '16px',
            width: '100%',
            max_width: '72rem',
        });
        for (const [position, caption] of [
            ['top', 'Top'],
            ['bottom', 'Bottom'],
            ['left', 'Left'],
            ['right', 'Right'],
        ]) {
            for (const [mode, presentation] of [
                ['tabs', 'Shaped tabs'],
                ['underline', 'Underline'],
            ]) {
                const key = `${mode}-${position}`;
                this.variant_card(grid, key, `${presentation} · ${caption}`, mode, position);
            }
        }
    }

    tab_alignment(main_content) {
        main_content.h2('Align the labels along the strip');
        main_content.p(
            'Position chooses the side of the panel. Alignment chooses where the labels sit along that side. Compare the three horizontal rows, then the three vertical lists.',
        );
        const grid = main_content.section({
            id: 'tab-alignment',
            display: 'grid',
            grid_template_columns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))',
            gap: '16px',
            width: '100%',
            max_width: '72rem',
        });
        for (const [position, axis, captions] of [
            ['top', 'Horizontal', ['Left', 'Center', 'Right']],
            ['left', 'Vertical', ['Top', 'Center', 'Bottom']],
        ]) {
            for (const [align, caption] of ['start', 'center', 'end'].map((value, i) => [
                value,
                captions[i],
            ])) {
                this.variant_card(
                    grid,
                    `align-${position}-${align}`,
                    `${axis} · ${caption}`,
                    'underline',
                    position,
                    align,
                );
            }
        }
    }

    variant_card(grid, key, title, mode, position, align = 'start') {
        const card = grid.section({ min_width: 0 });
        card.h2(title, { font_size: '1rem', margin: '0 0 6px' });
        card.p(`tabMode="${mode}", tabPosition="${position}", tabAlign="${align}"`, {
            font_family: 'var(--gramlot-font-code)',
            font_size: '.8rem',
            margin: '0 0 8px',
        });
        const tabs = card.tabContainer({
            id: `tabs-variant-${key}`,
            tabMode: mode,
            tabPosition: position,
            tabAlign: align,
            height: '240px',
            width: '100%',
            border: '1px solid var(--gramlot-border-control)',
            rounded: 6,
        });
        const profile = tabs.contentPane({ pageName: 'profile', title: 'Profile', padding: '12px' });
        profile.textbox({
            id: `variant-name-${key}`,
            value: '^.name',
            lbl: 'Customer name',
            width: '100%',
            max_width: '15rem',
            live: true,
        });
        profile.p('Switch to Messages and back. Your edit stays here.', { font_size: '.9rem' });
        const messages = tabs.contentPane({
            pageName: 'messages',
            title: 'Messages',
            icon: '✉',
            badge: '^.unread',
            badge_color: '^.badgeColor',
            padding: '12px',
        });
        messages.textBoxArea({
            value: '^.variantMessage',
            lbl: 'Message',
            rows: 2,
            width: '100%',
            live: true,
        });
        messages.p('The badge remains visible when this panel is hidden.', { font_size: '.9rem' });
        const activity = tabs.contentPane({ pageName: 'activity', title: 'Activity', padding: '12px' });
        activity.h3('Customer updated', { font_size: '1rem' });
        activity.p('^.name', { mask: 'Latest name: {}' });
        activity.p('Each card selects its own panel; only the business values are shared.', {
            font_size: '.9rem',
        });
    }
}
