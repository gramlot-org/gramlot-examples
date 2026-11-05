import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const section = root.section({padding: '16px', border_radius: '8px',
            background: 'var(--gramlot-surface-subtle)'});
        section.h2('Learning topics', {color: 'var(--gramlot-action)'});
        const items = section.ul();
        for (const name of ['HTML', 'SVG', 'Data']) items.li(name);
    }
}
