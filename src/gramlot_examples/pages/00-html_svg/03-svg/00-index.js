import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'SVG drawing';

    main(root) {
        root.h1(this.constructor.title);
        root.p('Declare SVG shapes in the same Source tree.');
    }
}
