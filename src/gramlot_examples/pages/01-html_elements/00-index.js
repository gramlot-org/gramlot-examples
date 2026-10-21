/** A filesystem navigation page for the gallery. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'HTML and SVG';

    main(root) {
        const main_content = root.main({padding:'24px', class:'gallery-directory-page'});
        main_content.h1(this.constructor.title);
        main_content.p('Explore the HTML and SVG examples, or open the nested directory to try filesystem navigation with lazy children.');
    }
}
