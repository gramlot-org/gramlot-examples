import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.input({value: '^example.name', lbl: 'Name'});
        root.div('^example.name', {lbl: 'Your name', lbl_variant: 'card',
            font_size: '24px', text_align: 'center'});
    }
}
