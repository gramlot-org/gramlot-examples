import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Labels and boxes';

    main(root) {
        root.h1(this.constructor.title);
        root.p('Use labels and boxes with native HTML elements.');
    }
}
