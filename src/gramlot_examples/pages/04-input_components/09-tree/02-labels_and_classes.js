import tree from '../../../gallery/dist/tree/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [tree];
    static title = 'Tree labels and classes';
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'treeStyle'});
        main_content.h1('Labels and state classes');
        main_content.p('Open Documents and select a row. Caption classes change with opening and selection; the highlighted row uses a separate node class.');
        main_content.tree({storepath: '.nodes', labelAttribute: 'caption', hideValues: true, selectedPath: '^.selection', selectedLabelClass: 'caption-selected', id: 'styled-tree', class: 'styled-tree'});
        main_content.p('Selected path'); main_content.code('^.selection', {id: 'styled-selection'});
        main_content.button('Rename notes', {id: 'styled-rename', action: "this.SET('.nodes.documents.notes?caption', 'Updated notes')"});
        main_content.p('labelAttribute changes the caption, not the node key. Custom classes are also exposed as CSS parts for page styles.');
    }
}
