import {Page as BasePage} from '@gramlot/gramlot/page';
import typst from '@gramlot/gramlot/collections/typst';
export class Page extends BasePage {
    static gramlots = [typst];
    main(root) {
        const main_content=root.main({datapath:'typstDemo',padding:'24px',class:'example-page stack'});
        const split=main_content.div({class:'grid typst-workbench'});
        split.codeMirror({value:'^.content',language:'typst',height:'min(650px, 70dvh)'});
        split.typstPreview({value:'^.content',filename:'gramlot-typst.pdf',height:'min(650px, 70dvh)'});
    }
}
