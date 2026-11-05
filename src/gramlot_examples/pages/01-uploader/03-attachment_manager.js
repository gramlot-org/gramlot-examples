import {Bag, Page as BasePage, UploadTarget} from '@gramlot/gramlot/page';

// This demonstration keeps its application data only for the Worker lifetime.
const records = new Map();
class AttachmentTarget extends UploadTarget {
    constructor(record, metadata) {
        super({maxBytes:1024 * 1024});
        Object.assign(this, {record, metadata, parts:[], size:0, outcome:{state:'pending'}});
    }
    write(chunk) { this.parts.push(chunk); this.size += chunk.byteLength; }
    finish() {
        const attachmentId = `a_${crypto.randomUUID().replaceAll('-', '')}`;
        const content = new Uint8Array(this.size);
        let offset = 0;
        for (const part of this.parts) { content.set(part, offset); offset += part.byteLength; }
        this.record.attachments.set(attachmentId, {name:this.metadata.name, mediaType:this.metadata.mediaType,
            fields:this.metadata.fields, content});
        this.parts = [];
        this.outcome = {state:'completed', result:{attachmentId}};
        return this.outcome;
    }
    abort() { if (this.outcome.state !== 'completed') { this.parts = []; this.outcome = {state:'unsaved'}; } return this.outcome; }
    status() { return this.outcome; }
}
export class Page extends BasePage {
    main(root) {
        const main_content = root.main({datapath:'attachmentsDemo', padding:'16px'});

        main_content.dataFormula({result_path:'.ready',formula:'recordId != null',recordId:'^.context.recordId',_init:true});
        main_content.button('Save record',{id:'save-record'}).dataRpc({method:'save_record',result_path:'.context.recordId'});
        main_content.p('^.context.recordId',{id:'record-id'});
        main_content.attachmentManager({id:'attachment-manager',operation:'attach_file',storepath:'.queue',contextPath:'.context',ready:'^.ready',
            listMethod:'list_attachments',readMethod:'preview_attachment',removeMethod:'remove_attachment'});
    }
    save_record() {
        if (!records.has(this.pageId)) records.set(this.pageId, {id:`r_${crypto.randomUUID().replaceAll('-', '')}`,attachments:new Map()});
        return records.get(this.pageId).id;
    }
    attach_file(metadata) {
        const record = records.get(this.pageId);
        if (!record) throw new Error('Save the record before uploading');
        if (metadata.context.recordId !== record.id) throw new Error('Record does not match upload context');
        return new AttachmentTarget(record, metadata);
    }
    list_attachments({context}) {
        const result = new Bag(), record = this.record(context);
        if (record) for (const [key, item] of record.attachments) result.setItem(key, null, {caption:item.name,size:item.content.byteLength});
        return result;
    }
    preview_attachment({context,selected}) {
        const item = this.record(context).attachments.get(selected);
        if (!item) return new Bag({kind:'message',text:'Select an attachment to preview it.',src:''});
        const mediaType = item.mediaType.toLowerCase();
        if (['image/png','image/jpeg','image/gif','image/webp'].includes(mediaType)) {
            let binary = '';
            for (const byte of item.content) binary += String.fromCharCode(byte);
            return new Bag({kind:'image',text:'',src:`data:${mediaType};base64,${btoa(binary)}`});
        }
        if (mediaType.startsWith('text/')) {
            try { return new Bag({kind:'text',text:new TextDecoder('utf-8',{fatal:true}).decode(item.content),src:''}); }
            catch { /* Invalid UTF-8 has no text preview. */ }
        }
        return new Bag({kind:'message',text:'Preview unavailable.',src:''});
    }

    remove_attachment({context,selected}) { return this.record(context).attachments.delete(selected); }
    record(context) { const record=records.get(this.pageId); if (!record || context.recordId !== record.id) throw new Error('Record does not match attachment context'); return record; }
}
Page.registerEndpoint('save_record');
Page.registerUpload('attach_file');
Page.registerEndpoint('list_attachments');
Page.registerEndpoint('preview_attachment');
Page.registerEndpoint('remove_attachment');
