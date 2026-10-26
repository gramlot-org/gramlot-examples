/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "SVG drawing";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Draw shapes and combine them into a scene. SVG elements belong to the same Source tree as the surrounding HTML, so diagrams and page content can be composed together.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("SVG shapes"); item.p("The basic SVG vocabulary inside an HTML page."); }
        { const item = lessons.li(); item.strong("SVG composition"); item.p("A scene assembled with groups, paths and repeated objects."); }
    }
}
