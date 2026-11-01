import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Advanced tools';
    main(root) {
        const main_content = root.main({class:'example-page stack', padding:'24px'});
        main_content.h1('Advanced tools');
        main_content.p('Explore upload queues, attachments and editable images.');
    }
}
