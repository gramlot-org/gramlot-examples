import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Your first page: headings and text";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1('Hello, Gramlot!');
        main_content.p('This heading and paragraph come from a Source tree.');
    }
}
