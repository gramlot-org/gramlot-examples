import {Page as BasePage, UploadTarget} from '@gramlot/gramlot/page';

class InspectUpload extends UploadTarget {
    constructor(fields) { super({maxBytes:1024 * 1024}); this.fields = fields; this.size = 0; this.outcome = {state:'pending'}; }
    write(chunk) { this.size += chunk.byteLength; }
    finish() { this.outcome = {state:'completed',result:{size:this.size,fields:this.fields}}; return this.outcome; }
    abort() { if (this.outcome.state !== 'completed') this.outcome = {state:'unsaved'}; return this.outcome; }
    status() { return this.outcome; }
}
export class Page extends BasePage {
    static title = 'Upload queue and metadata';
    main(root) {
        const main_content = root.main({datapath:'uploadDemo', padding:'16px'});
        main_content.h1('Upload queue and metadata');
        main_content.p('Choose files, select each one, edit its fields, then upload. This demonstration does not save files.');

        main_content.uploader({id:'upload-demo', operation:'inspect_file', storepath:'.queue', selectedPath:'^.selected', multiple:true, autoUpload:false, onComplete:'uploadCompleted'});
        main_content.dataFormula({result_path:'.editPath', formula:"selected ? 'uploadDemo.queue.' + selected : 'uploadDemo.empty'", selected:'^.selected', _init:true});
        main_content.p('^.lastCompleted');
        const editor = main_content.div({datapath:'^.editPath'});
        editor.h2('Selected file metadata');
        editor.textbox({id:'upload-title', value:'^.metadata.title', lbl:'Title', live:true, disabled:"^.status:={} !== 'queued'"});
        editor.textbox({id:'upload-description', value:'^.metadata.description', lbl:'Description', live:true, disabled:"^.status:={} !== 'queued'"});
    }
    inspect_file(metadata) {
        const fields = metadata.fields;
        if (['title', 'description'].some(name => typeof (fields[name] ?? '') !== 'string')) throw new TypeError('Metadata fields must be text');
        return new InspectUpload(fields);
    }
}
Page.registerUpload('inspect_file');
export class Logic {
    uploadCompleted(node, {item}) { node.SET('.lastCompleted', `Last completed: ${item.value.getItem('name')}`); }
}
