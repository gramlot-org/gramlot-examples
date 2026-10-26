import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "React to Data changes with dataController";

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'demo'});
        pane.h1('Controller');
        pane.p("Change the name, send a request and try the delayed input. Each section shows a different reason for a controller to run; the counters make those triggers visible.");

        const triggers = pane.div({class: 'grid controller-triggers'});
        this.value_changes(triggers);
        this.fired_events(triggers);
        this.delayed_search(triggers);
        this.timed_updates(triggers);
        this.path_filters(pane);

    }

    value_changes(pane) {
        const check = pane.section({class: 'card stack'});
        check.h2('React to a value');
        check.html_label('Name', {for: 'name'});
        check.input({value: '^.name', live: true, id: 'name'});
        check.p('The name is empty', {id: 'warning', class: 'status status--warning', visible: '^.invalid'});
        check.dataController({script: "this.SET('.invalid', !name.trim())", name: '^.name', _init: true});
    }

    fired_events(pane) {
        const fired = pane.section({class: 'card stack'});
        fired.h2('React to a fired path');
        fired.button('Send a request', {fire: '.request', id: 'request'});
        fired.p('^.requests', {id: 'requests'});
        fired.dataController({script: "this.SET('.requests', requests + 1)", _fired: '^.request', requests: '=.requests'});
    }

    delayed_search(pane) {
        const delayed = pane.section({class: 'card stack'});
        delayed.h2('Wait for a pause (_delay)');
        delayed.html_label('Search', {for: 'query'});
        delayed.input({value: '^.query', live: true, id: 'query'});
        delayed.p('^.searched', {id: 'searched'});
        delayed.dataController({script: "this.SET('.searched', 'Searching for ' + query)", query: '^.query', _delay: 400});
    }

    timed_updates(pane) {
        const timed = pane.section({class: 'card stack'});
        timed.h2('Run at start and at intervals (_onStart, _timing)');
        timed.html_label('Interval in seconds', {for: 'interval'});
        const interval = timed.select({default: "1", value: '^.interval', id: 'interval'});
        for (const seconds of [0, 1, 5]) interval.option(String(seconds), {value: String(seconds)});
        timed.p('^.ticks', {id: 'ticks'});
        timed.dataController({script: "this.SET('.ticks', (ticks ?? 0) + 1)", ticks: '=.ticks', _timing: '^.interval',
            _onStart: true});
    }

    path_filters(pane) {
        const filtered = pane.section({class: 'card stack'});
        filtered.h2('Advanced: _userChanges filters paths, not input origin');
        filtered.html_label('Tracked name', {for: 'tracked-name'});
        filtered.input({value: '^.filter.name', id: 'tracked-name'});
        for (const [label, method] of [['SET the name', 'setName'], ['Replace containing Bag', 'replaceFilter'],
            ['Change address child', 'changeCity']]) {
            filtered.button(label, {id: method, type: 'button'}).dataController({func: method});
        }
        for (const [key, path, exact] of [['name_exact', '.filter.name', true], ['name_all', '.filter.name', false],
            ['address_exact', '.filter.address', true], ['address_all', '.filter.address', false]]) {
            filtered.p(`^.${key}`, {mask: `${key}: {}`, id: key});
            filtered.dataController({func: 'countPath', watched: `^${path}`, counter: `.${key}`, _userChanges: exact});
        }
    }

}

/** Named methods for the optional path-filtering exercise. */
export class Logic {
    countPath(node, {counter}) { node.SET(counter, node.GET(counter) + 1); }
    setName(node) { node.SET('.filter.name', 'Grace'); }
    replaceFilter(node) { node.SET('.filter', node.GET('.replacement').deepcopy()); }
    changeCity(node) { node.SET('.filter.address.city', 'Milan'); }
}
