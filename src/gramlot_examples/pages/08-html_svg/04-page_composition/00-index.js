/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Composing complete pages";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Combine small HTML and SVG elements into cards, reports and a complete page. Start with the visible result, then compare the declarations in Code.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Cards with icons"); item.p("HTML cards with SVG icons and live Source removal."); }
        { const item = lessons.li(); item.strong("Static report"); item.p("A summary, chart, legend and table from the same data."); }
        { const item = lessons.li(); item.strong("Complete page"); item.p("An event page with a programme, speakers, map and FAQ."); }
    }
}
