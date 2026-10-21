/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Forms and validation";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Arrange fields into a form, share label settings and group related values. Add validation rules and callbacks, then try both accepted and rejected edits.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Required values and length"); item.p("Invalid drafts remain visible with a message while Data keeps the last accepted value."); }
        { const item = lessons.li(); item.strong("Formlet and shared labels"); item.p("Arrange fields in columns and share label settings. Changing the layout preserves each field and its draft."); }
        { const item = lessons.li(); item.strong("GroupBox and typed copy"); item.p("Group customer data under a heading. Copy TYTX with its types or choose plain JSON from the copy menu."); }
        { const item = lessons.li(); item.strong("Validation rules and callbacks"); item.p("Transformations, conditions, warnings, local callbacks and remote validation."); }
    }
}
