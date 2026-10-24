import layout from '../../gallery/dist/layout/descriptor.js';
import editors from '../../gallery/dist/editors/descriptor.js';
import typst from '../../gallery/dist/typst/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static gramlots = [layout, editors, typst];
    static title="Edit Typst and generate a PDF";
    main(root) {
        const main_content=root.main({datapath:'typstDemo',padding:'24px',class:'example-page stack'});
        main_content.h1(Page.title);
        main_content.p('Edit a self-contained Typst document. The SVG preview and downloadable PDF are generated locally, including offline. This first example uses bundled fonts; project includes and external packages are not loaded.');
        const split=main_content.borderContainer({height:'650px'});
        split.contentPane({region:'left',width:'50%',splitter:true}).codeMirror({value:'^.content',language:'typst',height:'100%'});
        split.contentPane({region:'center'}).typstPreview({value:'^.content',filename:'gramlot-typst.pdf',height:'100%'});
    }
}
