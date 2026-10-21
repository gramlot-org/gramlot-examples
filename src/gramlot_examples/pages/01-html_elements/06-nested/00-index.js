/** A filesystem navigation page for the gallery. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Nested directory';

    main(root) {
        const main_content = root.main({padding:'24px', class:'gallery-directory-page'});
        main_content.h1(this.constructor.title);
        main_content.p('This directory has its own index page. Expand its arrow to load the child page; selecting this label opens the directory page independently.');
    }
}
