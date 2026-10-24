import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import { Page as BasePage } from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = 'Nested borders and layout designs';
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const main_content = root.main({ class: 'example-page stack' });
        main_content.h1('One layout inside another');
        const controls = main_content.formlet({ max_width: '24rem', columns: 1 });
        controls.filteringSelect({default: "headline",
            id: 'design',
            value: '^design',
            lbl: 'Outer design',
            values: 'headline:Headline,sidebar:Sidebar',
            width: '10rem',
        });
        const bc = main_content.borderContainer({
            id: 'nested-demo',
            height: '440px',
            design: '^design',
            max_width: '64rem',
            border: '1px solid var(--gramlot-border-control, #aaa)',
        });
        bc.contentPane({
            region: 'top',
            border_bottom: '1px solid var(--gramlot-border-control, #aaa)',
            height: '48px',
            splitter: true,
            minSize: 30,
            maxSize: 100,
            padding: '10px',
            background: 'var(--gramlot-surface-subtle, #eef1f5)',
        }).p('Outer header');
        const left = bc.contentPane({
            region: 'left',
            border_right: '1px solid var(--gramlot-border-control, #aaa)',
            width: '130px',
            drawer: true,
            splitter: false,
            drawer_title: 'Side',
            padding: '10px',
            background: 'var(--gramlot-surface-subtle, #eef1f5)',
        });
        left.h3('Workspace');
        left.radioButtonText({default: "profile",  value: '^section', values: 'profile:Profile,history:History', cols: 1 });
        left.p('A fixed-width drawer: open and close without dragging.');
        const nested = bc.borderContainer({ region: 'center' });
        nested
            .contentPane({
                region: 'top',
                border_bottom: '1px solid var(--gramlot-border-control, #aaa)',
                height: '40px',
                padding: '10px',
                background: 'var(--gramlot-surface-subtle, #eef1f5)',
            })
            .p('Inner header');
        const editor = nested.contentPane({
            region: 'center',
            padding: '12px 40px',
            background: 'var(--gramlot-surface, #fff)',
        });
        editor.textbox({ value: '^name', lbl: 'Customer', width: '100%', max_width: '24rem' });
        editor.checkbox({ value: '^active', label: 'Active', mode: 'switch' });
        editor.textBoxArea({
            id: 'nested-note',
            value: '^note',
            lbl: 'Retained draft',
            rows: 3,
            width: '100%',
            max_width: '24rem',
        });
        nested
            .contentPane({
                region: 'bottom',
                border_top: '1px solid var(--gramlot-border-control, #aaa)',
                height: '80px',
                splitter: true,
                minSize: 36,
                maxSize: 180,
                drawer: true,
                drawer_title: 'Output',
                padding: '10px',
                background: 'var(--gramlot-surface-subtle, #eef1f5)',
            })
            .p('^note');
    }
}
