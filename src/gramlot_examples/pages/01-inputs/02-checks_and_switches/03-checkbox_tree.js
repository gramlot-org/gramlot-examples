import {Bag} from '@gramlot/gramlot';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const options = new Bag();
        options.setItem('documents.fixed', null, {checked:'disabled:on'});
        options.setItem('documents.blocked', null, {checked:'disabled:off'});
        root.dataSetter({destination_path:'options', value:options});
        root.dataRemote({destination_path:'options.documents.catalog', method:'catalog_children', cacheTime:-1});
        root.checkBoxText({values:'^options', value:'^selected', hierarchical:true,
            popup:true, lbl:'Documents', id:'hierarchy'});
        root.button('Clear', {action:"this.SET('selected', null)", id:'clear'});
        root.code('^selected', {id:'selected-paths'});
    }
    catalog_children() { return new Bag({guide:null, reference:null}); }
}
Page.registerEndpoint('catalog_children');
