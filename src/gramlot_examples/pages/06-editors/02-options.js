import inputs from '../../gallery/dist/inputs/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';
import editors from '../../gallery/dist/editors/descriptor.js';
import {Page as BasePage, codeMirrorWithOptions} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static gramlots = [inputs, layout, editors];
    static title = "Configure language, wrapping and editor options";
    main(root) {
        const main_content = root.main({class:'example-page stack', datapath:'editorDemo', padding:'24px'});
        main_content.h1("CodeMirror with options");
        main_content.p('Edit the draft: Data updates immediately. Ctrl/Cmd+F opens search; Escape then Tab leaves the editor. Save or Ctrl/Cmd+S copies the draft to the snapshot below.');
        main_content.p("Choose a language to load its sample and switch syntax highlighting. Changing language replaces the current draft.");
        main_content.filteringSelect({default: "python", value:"^.document.settings.language", values:"python:Python,javascript:JavaScript,typescript:TypeScript,json:JSON,html:HTML,css:CSS,xml:XML,markdown:Markdown,sql:SQL,text:Plain text", lbl:"Language and sample", validate_notnull:true, id:"sample-language"});
        main_content.checkbox({default: false, value:'^.document.readonly', label:'Read only'});
        main_content.checkbox({default: false, value:'^.document.disabled', label:'Disabled'});
        codeMirrorWithOptions(main_content, {datapath:'.document', value:'^.source', language:'python', id:'demo-editor', readonly:'^.readonly', disabled:'^.disabled', selfsubscribe_save:"this.SET('.saved', p_0.value)"});
        main_content.dataController({script:"this.SET('.document.source', snippets.getItem(language))", language:"^.document.settings.language", snippets:"=.snippets"});
        main_content.button('Save snapshot', {id:'save-snapshot', action:"this.SET('.document.saved', this.GET('.document.source'))"});
        main_content.h3('Live Data'); main_content.pre('^.document.source', {id:'live-draft'});
        main_content.h3('Saved snapshot'); main_content.pre('^.document.saved', {id:'saved-snapshot'});
    }
}
