/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Actions and commands";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Turn a user command into a page action. Explore controller buttons, confirmation questions, references and delayed commands.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Button controller"); item.p("A button with a nested controller, click counter, modifiers and fire."); }
        { const item = lessons.li(); item.strong("Actions, confirmations and references"); item.p("Core 0.2.18: action, conditional ask and explicit Source/DOM references."); }
        { const item = lessons.li(); item.strong("Plain and delayed buttons"); item.p("Core 0.2.19: native html_button and grouped clicks with _delay."); }
    }
}
