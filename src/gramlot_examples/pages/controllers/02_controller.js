import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Controller';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'demo'});
        pane.h1('Controller');

        const check = pane.section({class: 'card stack'});
        check.h2('React to a value');
        check.html_label('Name', {for: 'name'});
        check.input({value: '^.name', live: true, id: 'name'});
        check.p('The name is empty', {id: 'warning', class: 'status status--warning', visible: '^.invalid'});
        check.dataController({script: "this.SET('.invalid', !name.trim())", name: '^.name', _init: true});

        const fired = pane.section({class: 'card stack'});
        fired.h2('React to a fired path');
        fired.button('Send a request', {fire: '.request', id: 'request'});
        fired.p('^.requests', {id: 'requests'});
        fired.dataController({script: "this.SET('.requests', requests + 1)", _fired: '^.request', requests: '=.requests'});

        const delayed = pane.section({class: 'card stack'});
        delayed.h2('Wait for a pause (_delay)');
        delayed.html_label('Search', {for: 'query'});
        delayed.input({value: '^.query', live: true, id: 'query'});
        delayed.p('^.searched', {id: 'searched'});
        delayed.dataController({script: "this.SET('.searched', 'Searching for ' + query)", query: '^.query', _delay: 400});

        const timed = pane.section({class: 'card stack'});
        timed.h2('Run at start and at intervals (_onStart, _timing)');
        timed.html_label('Interval in seconds', {for: 'interval'});
        const interval = timed.select({value: '^.interval', id: 'interval'});
        for (const seconds of [0, 1, 5]) interval.option(String(seconds), {value: String(seconds)});
        timed.p('^.ticks', {id: 'ticks'});
        timed.dataController({script: "this.SET('.ticks', (ticks ?? 0) + 1)", ticks: '=.ticks', _timing: '^.interval',
            _onStart: true});

        pane.dataSetter({destination_path: '.name', value: 'Ada'});
        pane.dataSetter({destination_path: '.requests', value: 0});
        pane.dataSetter({destination_path: '.interval', value: '1'});
    }
}

/** The page logic: this page names no methods. */
export class Logic {}
