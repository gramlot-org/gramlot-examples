import { Page as BasePage } from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Rounded borders and popups';
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const main_content = root.main({ class: 'example-page stack' });
        main_content.h1('Rounded outside, continuous inside');
        main_content.p(
            'Drag all four separators and toggle their drawers. Open the calendar and choices inside the rounded inner panel.',
        );
        const controls = main_content.formlet({ max_width: '24rem', columns: 1 });
        controls.filteringSelect({
            id: 'rounded-design',
            value: '^design',
            lbl: 'Outer design',
            values: 'headline:Headline,sidebar:Sidebar',
            width: '10rem',
        });
        controls.horizontalSlider({
            id: 'rounded-slider',
            value: '^rounded',
            lbl: 'Corner radius (px)',
            min: 0,
            max: 48,
            step: 1,
            live: true,
            width: '14rem',
        });
        const border = main_content.borderContainer({
            id: 'rounded-border',
            height: '560px',
            max_width: '64rem',
            design: '^design',
            rounded: '^rounded',
            border: '2px solid var(--gramlot-border-control, #8192aa)',
            background: 'var(--gramlot-surface, #fff)',
        });
        for (const [side, size, label] of [
            ['top', '64px', 'Header'],
            ['bottom', '64px', 'Footer'],
            ['left', '140px', 'Filters'],
            ['right', '140px', 'Details'],
        ]) {
            const dimensions = {
                [`border_${{ top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side]}`]:
                    '1px solid var(--gramlot-border-control, #aaa)',
                [['top', 'bottom'].includes(side) ? 'height' : 'width']: size,
            };
            const region = border.contentPane({
                id: `rounded-${side}`,
                region: side,
                splitter: true,
                drawer: true,
                minSize: 40,
                maxSize: 240,
                drawer_title: label,
                padding: '16px',
                background: 'var(--gramlot-surface-subtle, #e5ebf3)',
                ...dimensions,
            });
            region.strong(label);
        }
        const center = border.contentPane({ region: 'center', padding: '24px 32px' });
        const inner = center.borderContainer({
            id: 'rounded-inner',
            height: '100%',
            rounded: '^rounded',
            background: 'var(--gramlot-surface, #fff)',
            border: '2px solid var(--gramlot-border-control, #8192aa)',
        });
        inner
            .contentPane({
                region: 'top',
                border_bottom: '1px solid var(--gramlot-border-control, #aaa)',
                height: '40px',
                padding: '8px 12px',
                background: 'var(--gramlot-surface-subtle, #e5ebf3)',
            })
            .strong('Shared reactive radius');
        const fields = inner.contentPane({ region: 'center', padding: '12px' });
        const form = fields.formlet({ columns: 1, gap: '10px', max_width: '20rem' });
        form.textbox({
            id: 'rounded-name',
            value: '^name',
            lbl: 'Name (2–8 characters)',
            validate_len: '2:8',
            width: '100%',
        });
        form.dateTextBox({ id: 'rounded-date', value: '^date', lbl: 'Appointment', width: '100%' });
        form.filteringSelect({
            id: 'rounded-choice',
            value: '^choice',
            lbl: 'Delivery',
            values: 'standard:Standard,express:Express,pickup:Pick up,scheduled:Scheduled,evening:Evening,weekend:Weekend',
            width: '100%',
        });
        main_content.p(
            "The rounded outline clips pane backgrounds. Calendar, choices and validation messages use the browser's top layer.",
        );
        main_content.dataSetter({ destination_path: 'design', value: 'headline' });
        main_content.dataSetter({ destination_path: 'rounded', value: 24 });
        main_content.dataSetter({ destination_path: 'name', value: 'Ada' });
        main_content.dataSetter({ destination_path: 'date', value: new Date(Date.UTC(2026, 9, 18)) });
        main_content.dataSetter({ destination_path: 'choice', value: 'standard' });
    }
}
