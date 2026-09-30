/**
 * Companion of 03_named_logic.py and 03_named_logic.js. The minimal FileHost serves it as the
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
