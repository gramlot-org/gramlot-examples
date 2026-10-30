import {Page as BasePage} from '@gramlot/gramlot/page';
import {Bag} from '@gramlot/gramlot';
export class Page extends BasePage {
    static title = "Tree icons and computed captions";
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'treeLabels'});
        main_content.h1('Computed labels and icons');
        main_content.p('Both trees share one Bag. The first uses labelCb; the second uses getLabel, custom icon and caption classes. Open Documents, select a row and toggle its rich caption.');
        main_content.h2('labelCb: computed text');
        main_content.tree({storepath: '.nodes', hideValues: true, labelCb: 'plainCaption', id: 'text-callback-tree', class: 'callback-tree'});
        main_content.h2('getLabel: explicit text or HTML');
        main_content.tree({storepath: '.nodes', hideValues: true, labelAttribute: 'caption', getLabel: 'richCaption', getIconClass: 'rowIcon', getLabelClass: 'rowClass', selectedLabelClass: 'selected-caption', selectedPath: '^.selection', id: 'rich-callback-tree', class: 'callback-tree'});
        main_content.button('Toggle rich Documents', {id: 'toggle-rich', action: "this.SET('.nodes.documents?rich', !this.GET('.nodes.documents?rich'))"});
        main_content.p('Selected path'); main_content.code('^.selection', {id: 'callback-selection'});
        main_content.p('Callbacks are synchronous named Logic methods. HTML is explicit and sanitized; class names are available through CSS parts. No resolver is read to calculate a caption.');
    }
}
export class Logic {
    plainCaption(source, {item}) { return {text: `${item.label} — ${item.staticValue instanceof Bag ? 'group' : 'entry'}`}; }
    richCaption(source, {item, opened}) {
        const caption = item.attr.caption ?? item.label;
        return item.attr.rich ? {html: `<strong>${caption}</strong> <em>(${opened ? 'open' : 'ready'})</em>`} : {text: caption};
    }
    rowIcon(source, {item, opened}) {
        if (item.label === 'starred') return 'favorite-icon';
        if (item.staticValue instanceof Bag) return opened ? 'opened-icon' : 'branch-icon';
        return 'leaf-icon';
    }
    rowClass(source, {opened}) { return opened ? 'expanded-caption' : 'regular-caption'; }
}
