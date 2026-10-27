/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Numbers and sliders";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Enter a number directly or adjust it with a horizontal or vertical slider. Explore ranges and steps while keeping the value in shared Data.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Horizontal slider"); item.p("Two horizontal sliders share a numeric level. Drag or use the arrow keys; switch live editing to compare immediate and committed updates."); }
        { const item = lessons.li(); item.strong("Vertical slider"); item.p("Vertical and horizontal sliders share the same level. The vertical minimum is at the bottom and the maximum at the top."); }
        { const item = lessons.li(); item.strong("Number editing"); item.p("Try a comma decimal, an integer and an exact Decimal. Invalid text stays in the field without changing Data."); }
    }
}
