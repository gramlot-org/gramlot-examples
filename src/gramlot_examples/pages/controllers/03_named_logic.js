import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Named logic';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'cart'});
        pane.h1('Named logic');
        pane.p('The formula and the controller name methods of class Logic in 03_named_logic_aux.js.',
            {class: 'muted'});
        const form = pane.form({class: 'card stack'});
        form.html_label('Price', {for: 'price'});
        form.input({type: 'number', value: '^.price', live: true, id: 'price'});

        const result = pane.section({class: 'card stack'});
        const facts = result.dl();
        for (const [label, key] of [["Final price (func='finalPrice')", 'final'], ["Changes seen (func='countChange')", 'changes'],
            ['Last reason', 'reason']]) {
            facts.dt(label);
            facts.dd(`^.${key}`, {id: key});
        }

        pane.dataFormula({result_path: '.final', func: 'finalPrice', price: '^.price', threshold: 100, _init: true});
        pane.dataController({func: 'countChange', price: '^.price'});
        pane.dataSetter({destination_path: '.price', value: 80});
    }
}
