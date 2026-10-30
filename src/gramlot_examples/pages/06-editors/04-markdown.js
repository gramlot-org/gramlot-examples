import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title="Markdown editor";
    main(root) {
        const main_content=root.main({datapath:'markdownDemo',padding:'24px',class:'example-page stack'});
        main_content.h1(Page.title);
        main_content.p('Three views share one Markdown draft. Rich text provides Bold, Italic, Code, Undo and Redo. Tables and complex blocks retain their source; edit them in Code.');
        main_content.checkbox({default: false, value:'^.readonly',label:'Read only'});
        main_content.checkbox({default: false, value:'^.allowHtml',label:'Allow embedded HTML'});
        const tabs=main_content.tabContainer({default_selectedPage: "code", selectedPage:'^.view',height:'500px'});
        tabs.contentPane({title:'Code',pageName:'code',height:'100%'}).codeMirror({value:'^.content',language:'markdown',readonly:'^.readonly',height:'100%'});
        tabs.contentPane({title:'Preview',pageName:'preview',height:'100%'}).markdownPreview({value:'^.content',allowHtml:'^.allowHtml',height:'100%'});
        tabs.contentPane({title:'Rich text',pageName:'rich',height:'100%'}).markdownEditor({value:'^.content',readonly:'^.readonly',height:'100%'});
        main_content.h3('Live Markdown in Data');main_content.pre('^.content',{white_space:'pre-wrap',id:'live-markdown'});
    }
}
