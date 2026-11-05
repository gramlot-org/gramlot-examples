import {Page as BasePage} from '@gramlot/gramlot/page';
import {Bag} from '@gramlot/gramlot';

export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'treeDemo'});
        main_content.checkbox({default: false, value: '^.hideValues', lbl: 'Hide scalar values', id: 'tree-hide-values'});
        main_content.dataRemote({destination_path: '.nodes.catalog', method: 'catalog_children', cacheTime: -1});
        main_content.tree({storepath: '.nodes', hideValues: '^.hideValues', labelAttribute: 'caption', selectedPath: '^.selection', id: 'example-tree', class: 'example-bag-tree'});
        main_content.p('Selected path');
        main_content.code('^.selection', {id: 'tree-selected-path'});
        const actions = main_content.div({class: 'tree-actions'});
        actions.button('Select notes', {id: 'tree-select-notes', action: "this.SET('.selection', 'documents.notes')"});
        actions.button('Add document', {id: 'tree-add', action: "this.SET('.nodes.documents.new_document', 'New text')"});
        actions.button('Rename notes', {id: 'tree-rename', action: "this.SET('.nodes.documents.notes?caption', 'Meeting notes')"});
    }
    catalog_children() { return new Bag({books: new Bag({guide: 'Guide', reference: 'Reference'}), audio: new Bag({interview: 'Interview'})}); }
}
Page.registerEndpoint('catalog_children');
