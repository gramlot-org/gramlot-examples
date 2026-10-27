/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Text inputs";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Edit a short value, a longer note or a password. Compare the shared labels and the relationship between an input and its bound Data value.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Textbox and labelbox"); item.p("Two textboxes share a customer name. Type in either one, switch live editing off and on, and move the label without rebuilding the field."); }
        { const item = lessons.li(); item.strong("One note, two editors"); item.p("Two multiline fields share one note. Switch live editing and move the label while keeping the text and selection."); }
        { const item = lessons.li(); item.strong("One password, two masked fields"); item.p("Two password fields share a sample value. The browser masks the characters; changing either field updates the other."); }
    }
}
