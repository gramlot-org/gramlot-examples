import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.input({value: '^message', default: 'Hello, Gramlot!', live: true, lbl: 'Message'});
        root.input({type: 'range', min: 0.2, max: 1, step: 0.1,
                    value: '^opacity', default: 1, live: true, lbl: 'Opacity'});
        root.p('^message', {title: '^message', opacity: '^opacity', font_size: '48px'});
    }
}
