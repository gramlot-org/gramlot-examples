/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Remote content and Data";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Load content and Data when they are needed. Compare remote content, caching and a Data resolver, keeping the page connected through the normal Gramlot mechanisms.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Remote"); item.p("remote makes the content of an element a fragment built by the server."); }
        { const item = lessons.li(); item.strong("Cached remote"); item.p("Revisit remote with a last-result cache; distinguish mounted fragments from observed calls."); }
        { const item = lessons.li(); item.strong("Data remote"); item.p("Revisit endpoint values with lazy Data; compare a bound read, an explicit snapshot and cache expiry."); }
    }
}
