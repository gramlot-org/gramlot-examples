/** A filesystem navigation page for the gallery. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Explore Gramlot by task';

    main(root) {
        const main_content = root.main({padding:'24px', class:'gallery-directory-page'});
        main_content.h1(this.constructor.title);
        main_content.p('Start with HTML, SVG and page structure, then Fields and input widgets. Continue with Data and bindings, Logic and events, or RPC. Document editors, layout and tools have separate sections. Select a section title for an introduction; expand its arrow to choose a working example.');
    }
}
