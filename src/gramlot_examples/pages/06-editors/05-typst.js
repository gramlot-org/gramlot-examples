import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    main(root) {
        const main_content=root.main({datapath:'typstDemo',padding:'24px',class:'example-page stack'});
        const split=main_content.div({class:'grid typst-workbench'});
        split.codeMirror({value:'^.content',language:'typst',height:'min(650px, 70dvh)'});
        split.typstPreview({value:'^.content',filename:'gramlot-typst.pdf',height:'min(650px, 70dvh)'});
    }
}
