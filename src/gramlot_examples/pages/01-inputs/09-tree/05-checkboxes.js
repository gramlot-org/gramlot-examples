import {Page as BasePage} from '@gramlot/gramlot/page';
import {Bag} from '@gramlot/gramlot';

export class Page extends BasePage {
    static title = 'Tree checkboxes';

    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'checks'});
        main_content.dataRemote({destination_path: '.nodes.documents.catalog', method: 'catalog_children', cacheTime: -1});
        main_content.tree({storepath: '.nodes', checkedPaths: '^.checked', checkChildren: true,
            labelAttribute: 'caption', hideValues: true, id: 'checkbox-tree'});
        main_content.button('Clear checks', {action: "this.SET('.checked', '')"});
        main_content.div('Checked paths', {class: 'muted'});
        main_content.code('^.checked', {id: 'checked-paths'});
    }

    catalog_children() { return new Bag({guide: null, reference: null}); }
}
Page.registerEndpoint('catalog_children');
