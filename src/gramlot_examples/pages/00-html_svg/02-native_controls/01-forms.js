import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.input({type: 'text', value: 'Ada', lbl: 'Name', box_width: '28rem'});
        const summary = root.div({lbl: 'Summary', box_width: '28rem', box_max_width: '100%',
            box_padding: '16px', box_border: '1px solid var(--gramlot-border)',
            box_border_radius: '8px'});
        summary.p('An HTML element can contain other elements.');
        root.html_button('Continue', {type: 'button'});
    }
}
