import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.h1('Hello, Gramlot!');
        root.p('This heading and paragraph come from a Source tree.');
    }
}
