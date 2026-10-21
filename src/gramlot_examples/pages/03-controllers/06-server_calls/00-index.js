/** Introduction to a gallery lesson group. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Calling the server";

    main(root) {
        const main_content = root.main({class:"example-page stack", padding:"24px"});
        main_content.h1(this.constructor.title);
        main_content.p("Expose an endpoint and call it from the browser. Compare calls triggered by a value change with calls triggered by an explicit button click.");
        main_content.p("Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.");
        const lessons = main_content.ul();
        { const item = lessons.li(); item.strong("Endpoint"); item.p("dataRpc calls an endpoint of the page and writes the value at its result path."); }
        { const item = lessons.li(); item.strong("Call on change"); item.p("dataRpc follows a ^ argument, with _delay, _onCalling and _onResult."); }
        { const item = lessons.li(); item.strong("Call on click"); item.p("A dataRpc nested in a button, with _onError for a failing and a protected endpoint."); }
    }
}
