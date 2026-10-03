import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Named logic';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'cart'});
        pane.h1('Named logic');
        pane.p('The formula and the controller name methods of class Logic in 03_named_logic.js.',
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

/**
 * Logic of 03_named_logic.py and 03_named_logic.js. The minimal FileHost serves this module as the
 * root group of the page logic: `func='finalPrice'` names the method below.
 */
export class Logic {
    /** A formula method receives the resolved parameters and returns the result. */
    finalPrice(kwargs) {
        const {price, threshold} = kwargs;
        if (price == null) return null;
        return price >= threshold ? Math.round(price * 90) / 100 : price;
    }

    /** A controller method receives its node and the parameters; `this` is the group. */
    countChange(node, kwargs) {
        this.changes = (this.changes ?? 0) + 1;
        node.SET('.changes', this.changes);
        node.SET('.reason', `${kwargs._reason}: price ${kwargs.price}`);
    }
}
