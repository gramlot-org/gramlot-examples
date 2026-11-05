import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const content = root.main({class: 'example-page stack', datapath: 'rowActionsDemo'});
        content.h2('Act on a row without selecting it');
        const tree = content.tree({
            storepath: '.nodes',
            labelAttribute: 'caption',
            hideValues: true,
            selectedPath: '^.selected',
            id: 'row-actions-tree',
            class: 'row-actions-demo-tree'
        });
        const actions = tree.rowActions({position: 'end', actionState: 'presentRowAction'});
        actions.button({icon: 'i', rowAction: 'inspect', action: 'inspectRow', id: 'inspect-row'});
        const more = actions.dropDownButton('More', {action: 'inspectRow', id: 'row-more'});
        more.menu().menuline({caption: 'Record row path', code: 'record'}).dataController({func: 'recordRow'});

        const results = content.dl();
        results.dt('Selected path');
        results.dd().code('^.selected', {id: 'selected-row-path'});
        results.dt('Last acted-on path');
        results.dd().code('^.acted', {id: 'acted-row-path'});
        results.dt('Last action');
        results.dd('^.message', {id: 'row-action-message'});
    }
}

export class Logic {
    presentRowAction(source, {item, action}) {
        const mode = item.attr.actionMode;
        const checklist = action === 'inspect' && mode === 'checklist';
        return {
            hidden: action === 'inspect' && mode === 'menu',
            icon: checklist ? '✓' : 'i',
            title: checklist ? 'Inspect checklist' : 'Inspect row'
        };
    }

    inspectRow(source, {item, path}) {
        source.SET('.acted', path);
        source.SET('.message', `Inspected ${item.attr.caption}`);
    }

    recordRow(source, {path}) {
        source.SET('.acted', path);
        source.SET('.message', 'Recorded the row path');
    }
}
