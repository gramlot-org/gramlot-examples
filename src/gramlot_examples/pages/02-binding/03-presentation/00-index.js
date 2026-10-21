/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Binding the presentation";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Let Data control how a page looks: visibility, styles and SVG attributes. These examples connect a changing value to more than the text displayed on screen.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Style and visibility"); item.p("visible, class, style and reactive style shortcuts."); }
        { const item = lessons.li(); item.strong("Bound SVG"); item.p("SVG geometry and paint follow range and color fields."); }
        { const item = lessons.li(); item.strong("SVG shapes with binding"); item.p("The six shapes of example 08, resized and recolored by controls."); }
    }
}
