/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Editing bound values";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Connect native controls to Data. Try text fields, boolean choices and a small form to see when edits become shared values and how other controls follow them.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Native editing"); item.p("Text, number, range, select, date and color fields bound both ways."); }
        { const item = lessons.li(); item.strong("Checkbox and radio"); item.p("Booleans in the Data, one per checkbox and radio button."); }
        { const item = lessons.li(); item.strong("Forms with binding"); item.p("The native form of example 06, bound to a record."); }
    }
}
