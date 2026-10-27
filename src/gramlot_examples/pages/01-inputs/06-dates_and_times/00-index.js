/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Dates and times";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Edit dates and times with typed fields and a calendar. Compare the input interaction with the typed value stored in Data.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Date editing"); item.p("Enter a calendar date or a word such as oggi or domani. Two fields share one civil date."); }
        { const item = lessons.li(); item.strong("Time editing"); item.p("Edit a civil time with hours, minutes and optional seconds. The two fields keep the same typed value."); }
        { const item = lessons.li(); item.strong("Date calendar"); item.p("Pick a day or type a date. The inline calendar, popup and text-only field share the same Data value."); }
    }
}
