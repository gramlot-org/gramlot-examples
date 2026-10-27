/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Data paths and updates";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Learn how a page points to Data, chooses its current scope and supplies initial values. Then explore how freezing a binding affects the connection between Data and its presentation.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Pointers"); item.p("Read Data with ^, =, relative, symbolic and ?attr pointers."); }
        { const item = lessons.li(); item.strong("Variable datapath"); item.p("One card follows the record chosen in a select."); }
        { const item = lessons.li(); item.strong("Setters and defaults"); item.p("dataSetter values and control defaults, all in place at the first render."); }
        { const item = lessons.li(); item.strong("Freeze"); item.p("Freeze structural rendering while Data keeps updating; increment a counter, remove Source items, then thaw."); }
    }
}
