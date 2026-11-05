import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'HTML basics';

    main(root) {
        root.h1(this.constructor.title);
        root.p('Declare elements, children and style attributes.');
    }
}
