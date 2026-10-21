/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Events and lifecycle";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Observe user events and page lifecycle, react to attribute changes, and exchange messages. These lessons cover communication inside a page and between parent and child pages.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Events"); item.p("connect_on<event> attributes for click, input, key and pointer events."); }
        { const item = lessons.li(); item.strong("Lifecycle"); item.p("Core 0.2.0: observe hook order, freeze, removal and Source/DOM lookup."); }
        { const item = lessons.li(); item.strong("Attribute projection"); item.p("Core 0.2.0 templates/masks, then the 0.2.3 sandboxed Data preview."); }
        { const item = lessons.li(); item.strong("Publish and subscribe"); item.p("Core 0.2.18: revisit button actions with page topics, self receivers, references and native ask."); }
        { const item = lessons.li(); item.strong("Parent and child messages"); item.p("Core 0.2.18: local-first publish and direct parent/child postMessage exchange."); }
    }
}
