import {Page as BasePage} from '@gramlot/gramlot/page';


export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'treeDrag'});
        const columns = main_content.div({class: 'drag-columns'});
        const origin = columns.section({class: 'drag-panel'});
        origin.h2('Documents');
        origin.tree({storepath: '.documents', hideValues: true, labelAttribute: 'caption', draggable: true,
            dragTags: 'document', effectAllowed: 'copy', onDrag: 'prepareDocument', onDragEnd: 'dragFinished', id: 'drag-documents'});
        const target = columns.section({class: 'drag-panel'});
        target.h2('Folders');
        target.tree({storepath: '.folders', hideValues: true, labelAttribute: 'caption', dropTargetCb: 'acceptDocument',
            dropTypes: 'app/document', dropTags: 'document', dropEffect: 'copy', onDrop: 'copyDocument', id: 'drop-folders'});
        main_content.p('^.lastDrop', {id: 'last-drop'});
        main_content.p('^.lastEnd', {id: 'last-drag-end'});
    }
}

export class Logic {
    prepareDocument(source, {dragValues, item}) {
        dragValues['app/document'] = {code: item.label, caption: item.attr.caption, content: item.staticValue};
    }
    acceptDocument(source, {item}) {
        return item.attr.accepts === true;
    }
    copyDocument(source, {dropValues, item}) {
        const document = dropValues['app/document'];
        item.staticValue.setItem(document.code, document.content, {caption: document.caption});
        source.SET('.lastDrop', `Copied ${document.caption} to ${item.attr.caption}`);
    }
    dragFinished(source, {dropEffect}) {
        source.SET('.lastEnd', `Browser gesture: ${dropEffect}`);
    }
}
