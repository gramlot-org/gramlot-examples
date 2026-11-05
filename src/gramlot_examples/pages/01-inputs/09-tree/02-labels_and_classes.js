import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'treeStyle'});
        main_content.tree({storepath: '.nodes', labelAttribute: 'caption', hideValues: true, selectedPath: '^.selection', selectedLabelClass: 'caption-selected', id: 'styled-tree', class: 'styled-tree'});
        main_content.p('Selected path'); main_content.code('^.selection', {id: 'styled-selection'});
        main_content.button('Rename notes', {id: 'styled-rename', action: "this.SET('.nodes.documents.notes?caption', 'Updated notes')"});
    }
}
