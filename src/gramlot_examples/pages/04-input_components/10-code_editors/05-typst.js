import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title='Typst: editor, preview and PDF';
    main(root) {
        const main_content=root.main({datapath:'typstDemo',padding:'24px',class:'example-page stack'});
        main_content.h1(Page.title);
        main_content.p('Edit a self-contained Typst document. The SVG preview and downloadable PDF are generated locally, including offline. This first example uses bundled fonts; project includes and external packages are not loaded.');
        main_content.dataSetter({destination_path:'.content',value:"#set page(paper: \"a5\", margin: 18mm)\n#set text(font: \"Libertinus Serif\", size: 11pt)\n#set heading(numbering: \"1.\")\n\n= Typst in Gramlot\n\nEdit this source and see the *same draft* rendered as SVG and PDF.\nCompilation runs in the browser, including offline serverless pages.\n\n== Mathematics\n\n$ integral_0^1 x^2 dif x = 1/3 $\n\n== A small table\n\n#table(\n  columns: (1fr, 1fr),\n  [*View*], [*Purpose*],\n  [Code], [Edit the source],\n  [SVG], [Preview the draft],\n  [PDF], [Download locally],\n)\n\n#pagebreak()\n= Another page\n\nNo server receives this document for compilation.\n\n```python\nprint(\"Hello, Gramlot!\")\n```\n"});
        const split=main_content.borderContainer({height:'650px'});
        split.contentPane({region:'left',width:'50%',splitter:true}).codeMirror({value:'^.content',language:'typst',height:'100%'});
        split.contentPane({region:'center'}).typstPreview({value:'^.content',filename:'gramlot-typst.pdf',height:'100%'});
    }
}
