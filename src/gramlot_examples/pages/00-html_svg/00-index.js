import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = "HTML and SVG";
    main(root) {
        const pane = root.main({class:'example-page stack',padding:'24px'});
        pane.h1(this.constructor.title);
        pane.p("Learn the underlying page vocabulary: text, links, lists, tables, native controls and SVG. Build up to complete page compositions.");
        pane.p("For ready-made input components start with Fields and input widgets. For application layout use Containers and layout.");
    }
}
