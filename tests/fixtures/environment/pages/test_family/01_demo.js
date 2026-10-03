import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Demo';

    main(root) {
        root.h1('Demo', {class: 'demo'});
    }
}

/** The page logic of 01_demo.py and 01_demo.js. */
export class Logic {}
