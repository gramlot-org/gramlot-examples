import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title="Typst and PDF";
    main(root) {
        const main_content=root.main({datapath:'typstDemo',padding:'24px',class:'example-page stack'});
        main_content.h1(Page.title);
        main_content.p('Edit a self-contained Typst document. The SVG preview and downloadable PDF are generated locally, including offline. This first example uses bundled fonts; project includes and external packages are not loaded.');
        const split=main_content.div({class:'grid typst-workbench'});
        split.codeMirror({value:'^.content',language:'typst',height:'min(650px, 70dvh)'});
        split.typstPreview({value:'^.content',filename:'gramlot-typst.pdf',height:'min(650px, 70dvh)'});
    }
}
