import {Page as BasePage, codeMirrorWithOptions} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    main(root) {
        const main_content = root.main({class:'example-page stack', datapath:'editorDemo', padding:'24px'});
        const options = main_content.details();
        options.summary('Options · language, read only and disabled');
        options.filteringSelect({default: "python", value:"^.document.settings.language", values:"python:Python,javascript:JavaScript,typescript:TypeScript,json:JSON,html:HTML,css:CSS,xml:XML,markdown:Markdown,sql:SQL,text:Plain text", lbl:"Language and sample", validate_notnull:true, id:"sample-language"});
        options.checkbox({default: false, value:'^.document.readonly', label:'Read only'});
        options.checkbox({default: false, value:'^.document.disabled', label:'Disabled'});
        codeMirrorWithOptions(main_content, {datapath:'.document', value:'^.source', language:'python', id:'demo-editor', readonly:'^.readonly', disabled:'^.disabled', selfsubscribe_save:"this.SET('.saved', p_0.value)"});
        main_content.dataController({script:"this.SET('.document.source', snippets.getItem(language))", language:"^.document.settings.language", snippets:"=.snippets"});
        main_content.button('Save snapshot', {id:'save-snapshot', action:"this.SET('.document.saved', this.GET('.document.source'))"});
        main_content.h3('Live Data'); main_content.pre('^.document.source', {id:'live-draft'});
        main_content.h3('Saved snapshot'); main_content.pre('^.document.saved', {id:'saved-snapshot'});
    }
}
