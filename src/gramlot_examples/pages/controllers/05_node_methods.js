import {Page as BasePage} from '@gramlot/gramlot/page';

const ACTIONS = [
    ['SET: add 1', 'set', "this.SET('.value', this.GET('.value') + 1)"],
    ['PUT: add 10 silently', 'put', "this.PUT('.value', this.GET('.value') + 10)"],
    ["FIRE 'now'", 'fire', "this.FIRE('.ping', 'now')"],
    ["FIRE_AFTER 'later', 1 s", 'fire-after', "this.FIRE_AFTER('.ping', 'later', 1000)"],
];

export class Page extends BasePage {
    static title = 'Node methods';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'methods'});
        pane.h1('Node methods');
        const actions = pane.div({class: 'actions'});
        for (const [label, key, script] of ACTIONS) actions.button(label, {action: script, id: key});

        const result = pane.section({class: 'card stack'});
        const facts = result.dl();
        for (const [label, pointer, key] of [['value (^.value)', '^.value', 'value'],
            ['Changes notified', '^.notified', 'notified'],
            ['Pings received', '^.pings', 'pings'],
            ['Last ping', '^.last', 'last']]) {
            facts.dt(label);
            facts.dd(pointer, {id: key});
        }
        result.button('GET value', {action: "this.SET('.read', this.GET('.value'))", id: 'get'});
        result.p('^.read', {id: 'read', class: 'muted'});

        pane.dataController({script: "this.SET('.notified', notified + 1)", value: '^.value', notified: '=.notified'});
        pane.dataController({script: "this.SET('.pings', pings + 1); this.SET('.last', ping)", ping: '^.ping',
            pings: '=.pings'});
        pane.dataSetter({destination_path: '.value', value: 0});
        pane.dataSetter({destination_path: '.notified', value: 0});
        pane.dataSetter({destination_path: '.pings', value: 0});
    }
}

/** The page logic: this page names no methods. */
export class Logic {}
