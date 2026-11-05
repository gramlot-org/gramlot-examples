import { Page as BasePage } from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'tabsDemo'});
        this.track_events(main_content);
        this.options(main_content);
        this.workspace(main_content);
        this.event_report(main_content);
        this.reference(main_content);
    }

    track_events(main_content) {
        for (const topic of ['hiding', 'showing', 'selected', 'closing', 'closed']) {
            main_content.dataController({
                script: "this.SET('.events', history + topic + ': ' + JSON.stringify(_subscription_kwargs) + '\\n');",
                history: '=.events',
                topic: topic,
                ...{ [`subscribe_editor_${topic}`]: true },
            });
        }
        main_content.dataController({ script: "this.SET('.closed', pageName)", subscribe_editor_closed: true });
    }

    options(main_content) {
        const options = main_content.details();
        options.summary("Options · presentation, badges and closing");
        const controls = options.formlet({ col_min_width: '14rem', max_width: '36rem' });
        controls.filteringSelect({default: "customer", id: 'tabs-choice', value: '^.page', lbl: 'Selected page',
            values: 'customer:Customer,notes:Notes,layout:Nested border'});
        controls.filteringSelect({default: "tabs", id: 'tabs-mode', value: '^.mode', lbl: 'Presentation',
            values: 'tabs:Tabs,underline:Underline'});
        controls.filteringSelect({default: "top", id: 'tabs-position', value: '^.position', lbl: 'Tab position',
            values: 'top:Top,bottom:Bottom,left:Left,right:Right'});
        controls.filteringSelect({default: "start", id: 'tabs-align', value: '^.align', lbl: 'Alignment along the strip',
            values: 'start:Start,center:Center,end:End'});
        controls.horizontalSlider({id: 'tabs-unread', value: '^.unread', lbl: 'Unread messages', min: 0, max: 12, step: 1,
            live: true, width: '14rem', max_width: '100%'});
        controls.filteringSelect({default: "crimson", id: 'tabs-badge-color', value: '^.badgeColor', lbl: 'Badge color',
            values: 'crimson:Crimson,seagreen:Green,royalblue:Blue'});
        controls.filteringSelect({default: "✉", id: 'tabs-icon', value: '^.notesIcon', lbl: 'Notes icon',
            values: '✉:Envelope,●:Dot,★:Star'});
        controls.checkbox({default: false, id: 'tabs-lock', value: '^.locked', label: 'Prevent closing Notes',
            mode: 'switch'});
    }

    workspace(main_content) {
        main_content.p('^.index', { id: 'tabs-index', mask: 'Selected index: {}' });
        const tabs = main_content.tabContainer({default_selected: 0, id: 'tabs-demo', nodeId: 'editor', selectedPage: '^.page',
            selected: '^.index', tabMode: '^.mode', tabPosition: '^.position', tabAlign: '^.align',
            height: '240px', max_width: '44rem',
            border: '1px solid var(--gramlot-border-control, #aaa)', rounded: 6});
        this.customer_panel(tabs);
        this.notes_panel(tabs);
        this.nested_panel(tabs);
    }

    customer_panel(tabs) {
        const customer = tabs.contentPane({id: 'customer-panel', pageName: 'customer', title: 'Customer', icon: '👤', padding: '12px'});
        customer.textbox({id: 'tabs-name', value: '^.name', lbl: 'Name (2–20)', validate_len: '2:20', live: true,
            width: '15rem'});
        customer.p('The accepted Data value:');
        customer.p('^.name', { id: 'tabs-accepted' });
    }

    notes_panel(tabs) {
        const notes = tabs.contentPane({id: 'notes-panel', pageName: 'notes', title: 'Notes', icon: '^.notesIcon',
            badge: '^.unread', badge_color: '^.badgeColor', closable: true,
            onClose: "return !this.GET('.locked')", padding: '12px'});
        notes.textBoxArea({id: 'tabs-notes', value: '^.notes', lbl: 'Notes', rows: 3, width: '100%',
            max_width: '24rem'});
    }

    nested_panel(tabs) {
        const nested = tabs.borderContainer({id: 'tabs-border', pageName: 'layout', title: 'Nested border', icon: '▦'});
        nested
            .contentPane({region: 'left', width: '100px', splitter: true, drawer: true, drawer_label: 'Tools',
            padding: '10px', background: 'var(--gramlot-surface-subtle, #eef1f5)'})
            .p('Resize me');
        nested
            .contentPane({ region: 'center', padding: '12px' })
            .textbox({ value: '^.name', lbl: 'Same accepted name', width: '15rem' });
    }

    event_report(main_content) {
        main_content.p('^.closed', { id: 'tabs-closed', mask: 'Last closed: {}' });
        main_content.p('^.notes', { id: 'tabs-saved-notes', mask: 'Saved notes: {}' });
        const events = main_content.details();
        events.summary("Inspect container events");
        events.pre('^.events', {id: 'tabs-events', max_height: '12rem', overflow: 'auto', white_space: 'pre-wrap',
            overflow_wrap: 'anywhere'});
    }

    reference(main_content) {
        const reference = main_content.details();
        reference.summary("Compare tab styles, positions and alignment");
        this.tab_variants(reference);
        this.tab_alignment(reference);
    }

    tab_variants(main_content) {
        main_content.h2('See the tab variants side by side');
        const grid = main_content.section({id: 'tab-variants', display: 'grid',
            grid_template_columns: 'repeat(auto-fit, minmax(min(100%, 24rem), 1fr))', gap: '16px',
            width: '100%', max_width: '72rem'});
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
        const grid = main_content.section({id: 'tab-alignment', display: 'grid',
            grid_template_columns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))', gap: '16px',
            width: '100%', max_width: '72rem'});
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
        card.p(`tabMode="${mode}", tabPosition="${position}", tabAlign="${align}"`, {font_family: 'var(--gramlot-font-code)', font_size: '.8rem', margin: '0 0 8px'});
        const tabs = card.tabContainer({
            id: `tabs-variant-${key}`,
            tabMode: mode,
            tabPosition: position,
            tabAlign: align,
            height: '200px',
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
        const messages = tabs.contentPane({pageName: 'messages', title: 'Messages', icon: '✉', badge: '^.unread',
            badge_color: '^.badgeColor', padding: '12px'});
        messages.textBoxArea({value: '^.variantMessage', lbl: 'Message', rows: 2, width: '100%', live: true});
        const activity = tabs.contentPane({ pageName: 'activity', title: 'Activity', padding: '12px' });
        activity.h3('Customer updated', { font_size: '1rem' });
        activity.p('^.name', { mask: 'Latest name: {}' });
    }
}
