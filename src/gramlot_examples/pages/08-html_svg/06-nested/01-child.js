/** A filesystem navigation page for the gallery. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Nested child page';

    main(root) {
        const main_content = root.main({padding:'24px', class:'gallery-directory-page'});
        main_content.h1(this.constructor.title);
        main_content.p('This is an ordinary page inside a nested directory. Switch between its tab and the directory tab to keep both pages open.');
    }
}
