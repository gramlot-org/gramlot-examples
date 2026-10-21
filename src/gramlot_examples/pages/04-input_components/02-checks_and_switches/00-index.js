/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Checkboxes and switches";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Use a checkbox for a boolean choice, a switch for its alternate presentation, or a checkbox group for several choices. Try the controls and watch their Data values change.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Checkbox and labelbox"); item.p("Two checkboxes share one boolean preference. Click either caption, then disable both using the State checkbox."); }
        { const item = lessons.li(); item.strong("Checkbox group"); item.p("Choose several notification channels. Two groups share the same comma-separated codes; clearing all choices writes null."); }
        { const item = lessons.li(); item.strong("Checkbox as a switch"); item.p("A switch and a checkbox share one boolean. Compare their appearance, captions and read-only state."); }
    }
}
