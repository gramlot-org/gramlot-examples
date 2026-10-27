import {Page as BasePage} from '@gramlot/gramlot/page';

const PRODUCTS = {
    lamp: {name: 'Lamp', category: 'lighting'},
    spot: {name: 'Spotlight', category: 'lighting'},
    chair: {name: 'Chair', category: 'seating'},
};
const RULES = {lighting: 'Ships in two days, bulbs not included.', seating: 'Ships in a week, assembly required.'};
const ON_REMOTE = "this.SET('mounts', (this.GET('mounts') ?? 0) + 1); this.SET('status', 'Mounted the ' + category + ' rules')";

export class Page extends BasePage {
    static title = "Cache remote fragments";

    main(root) {
        const pane = root.div({class: 'example-page stack'});
        pane.h1('Cached remote');
        pane.p("Switch from Lamp to Spotlight, then to Chair. The first two share a category, so the mounted-fragment counter stays unchanged until Chair.");
        pane.html_label('Product', {for: 'product'});
        const choice = pane.select({default: "products.lamp", id: 'product', value: '^current'});
        for (const [key, product] of Object.entries(PRODUCTS)) choice.option(product.name, {value: `products.${key}`});

        const card = pane.article({datapath: '^current', class: 'card stack'});
        card.h2('^.name', {id: 'name'});
        const rules = card.div('Waiting for the server', {id: 'rules'});
        rules.remote('rules', {category: '^.category', _cachedRemote: true, _onRemote: ON_REMOTE});

        const facts = pane.dl();
        for (const [label, key] of [['Mounted fragments', 'mounts'], ['Status', 'status']]) {
            facts.dt(label);
            facts.dd(`^${key}`, {id: key});
        }

    }

    rules(root, {category}) {
        root.p(RULES[category], {id: 'rule'});
    }
}
Page.registerSource('rules');
