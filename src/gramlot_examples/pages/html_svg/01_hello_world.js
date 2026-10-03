import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Hello, Gramlot';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const page = root.main({class: 'example-page stack'});
        page.h1('Hello, Gramlot!');
        page.p('This heading and paragraph come from a Source tree.');
    }
}

/** The page logic: this page names no methods. */
export class Logic {}
