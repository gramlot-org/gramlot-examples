/** A filesystem navigation page for the gallery. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Example gallery';

    main(root) {
        const main_content = root.main({padding:'24px', class:'gallery-directory-page'});
        main_content.h1(this.constructor.title);
        main_content.p('Choose a section in the navigation tree. Expand a folder to load its children, or select its label to open its own page when present.');
    }
}
