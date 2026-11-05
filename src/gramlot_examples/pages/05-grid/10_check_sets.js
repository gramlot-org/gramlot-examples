import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const pane = root.div({datapath:'sample', max_width:'48rem'});
        for (const seller of ['John', 'Mark', 'Fred']) {
            pane.button('Add ' + seller, {action:'addSet', seller});
        }
        const filters = pane.groupBox({lbl:'Set filter'});
        for (const [label,names] of [['Tutti',''],['John','John'],['John e Fred','John,Fred']]) {
            filters.button(label, {action:'filterSets', names});
        }
        const frame = pane.frameGrid({storepath:'.customers', structpath:'.structure',
                                      rowMode:'attributes', searchOn:'Customer:name', height:'280px'});
        frame.grid.setAttr({id:'customer-sets', setFilter:'^.setFilter'});
        for (const seller of ['John', 'Mark', 'Fred']) {
            pane.code('^.sets.' + seller.toLowerCase(), {lbl:seller});
        }
    }
}

function addColumn(node, title) {
    const field = title.toLowerCase(), columns = node.GET('.structure.view_0.rows_0');
    columns.setItem(field, null, {tag:'cell', field, name:title[0], title,
        width:'40px', align:'center', check:'multiple', checked:'^.sets.' + field, checkedField:'id'});
    const nodes = columns.getNodes();
    if (nodes.indexOf(columns.getNode(field)) > nodes.indexOf(columns.getNode('name'))) {
        columns.move(nodes.indexOf(columns.getNode(field)), nodes.indexOf(columns.getNode('name')));
    }
}

export class Logic {
    addSet(node) { addColumn(node, node.getAttr('seller')); }
    filterSets(node) {
        const names = node.getAttr('names');
        if (names) for (const name of names.split(',')) addColumn(node, name);
        node.SET('.setFilter', names.toLowerCase());
    }
}
