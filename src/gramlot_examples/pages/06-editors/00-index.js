import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = "Document and code editors";
    main(root) {
        const pane = root.main({class:'example-page stack',padding:'24px'});
        pane.h1(this.constructor.title);
        pane.p("Edit a whole document rather than a single field: source code, HTML, Markdown and Typst. Compare source editing, preview and rich text while keeping one shared draft.");
        pane.p("The Python gallery also provides an IDE in Tools, with a sample document workspace. Saving requires Remote Edit on the host.");
    }
}
