import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Fundamentals';

    main(root) {
        root.h1(this.constructor.title);
        root.p('Build a page from HTML and SVG, style its elements, add labels and boxes, connect values and attributes to the Data store, and inspect Data and Source.');
    }
}
