/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Selecting values";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Choose a value with radio buttons or a selection field. Compare fixed options, filtering, callback-provided choices and editable combo boxes.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("RadioButtonText and labelbox"); item.p("Choose one delivery option in each group. Change the column count and label position, and try the arrow keys inside a group."); }
        { const item = lessons.li(); item.strong("Single radio buttons"); item.p("Each radio binds its own boolean. A shared group makes the choices exclusive; a separate group stays independent."); }
        { const item = lessons.li(); item.strong("Filtering select"); item.p("Search a caption, store its code. Two fields share the same choice and the same list."); }
        { const item = lessons.li(); item.strong("Callback select"); item.p("Search 100 random samples generated once in this page. The callback reads a Data Bag, without a server request."); }
        { const item = lessons.li(); item.strong("Combo box"); item.p("Choose a suggested city or enter a different one. Two fields share the same text; suggestions do not restrict what you can write."); }
    }
}
