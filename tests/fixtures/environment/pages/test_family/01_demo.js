import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Demo';

    main(root) {
        root.h1('Demo', {class: 'demo'});
    }
}
