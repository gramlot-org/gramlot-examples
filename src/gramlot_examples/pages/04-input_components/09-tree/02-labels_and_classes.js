import {Page as BasePage} from '@gramlot/gramlot/page';
import {Bag} from '@gramlot/gramlot';
export class Page extends BasePage {
    static title = 'Tree labels and classes';
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'treeStyle'});
        main_content.h1('Labels and state classes');
        main_content.p('Open Documents and select a row. Caption classes change with opening and selection; the highlighted row uses a separate node class.');
        const nodes = new Bag({documents: new Bag({readme: 'Welcome', notes: 'Notes'}), status: 'Ready'});
        nodes.getNode('documents').setAttr({caption: 'Documents', labelClass: 'caption-base', labelClassOpened: 'caption-open', labelClassClosed: 'caption-closed'});
        nodes.getNode('documents.notes').setAttr({caption: 'Meeting notes', node_class: 'attention-node'});
        nodes.getNode('status').setAttr({caption: 'Status', labelClass: 'caption-base'});
        main_content.dataSetter({destination_path: '.nodes', value: nodes});
        main_content.dataSetter({destination_path: '.selection', value: null});
        main_content.tree({storepath: '.nodes', labelAttribute: 'caption', hideValues: true, selectedPath: '^.selection', selectedLabelClass: 'caption-selected', id: 'styled-tree', class: 'styled-tree'});
        main_content.p('Selected path'); main_content.code('^.selection', {id: 'styled-selection'});
        main_content.button('Rename notes', {id: 'styled-rename', action: "this.SET('.nodes.documents.notes?caption', 'Updated notes')"});
        main_content.p('labelAttribute changes the caption, not the node key. Custom classes are also exposed as CSS parts for page styles.');
    }
}
