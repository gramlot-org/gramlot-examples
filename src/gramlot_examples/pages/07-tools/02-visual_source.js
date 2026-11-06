import {Page as BasePage, VisualEditor, SourceImport} from '@gramlot/gramlot/page';
export {VisualEditorLogic as Logic} from '@gramlot/gramlot';
export class Page extends BasePage {
    static devices = ['desktop', 'tablet'];
    dataRoot = '';
    codeDocument = null;
    main(root) { this.editor = new VisualEditor(root, {datapath:'__editor', dataRoot:this.dataRoot, codeDocument:this.codeDocument, height:'100dvh'}); }
    import_source(metadata) {
        if (!metadata.name.toLowerCase().endsWith('.grmlt')) throw new Error('Expected a .grmlt file');
        return new SourceImport();
    }
}
Page.registerUpload('import_source');
