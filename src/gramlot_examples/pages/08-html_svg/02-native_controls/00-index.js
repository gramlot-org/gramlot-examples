/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Native HTML controls";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Explore the browser controls available directly in HTML: forms, input fields and expandable sections. These lessons introduce native elements before the richer input components.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Forms"); item.p("Native fields, choices, buttons and a slider."); }
        { const item = lessons.li(); item.strong("Native disclosure"); item.p("Expandable questions and native progress indicators."); }
    }
}
