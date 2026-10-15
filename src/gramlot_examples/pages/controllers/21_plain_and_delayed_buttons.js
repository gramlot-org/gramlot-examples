import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Plain and delayed buttons';
    static css = ['/themes/gramlot-base/theme.css'];
    main(root) {
        const pane = root.main({class: 'example-page stack', datapath: 'clicks'});
        pane.h1('Native HTML, then Gramlot behavior');
        const form = pane.form({class: 'card stack'});
        form.html_label('Native value', {for: 'native-value'});
        form.input({id: 'native-value', value: 'Original'});
        form.html_button('Native reset', {type: 'reset', id: 'native-reset'});
        pane.p('Edit the field and Reset: the browser restores its initial value, without a Data controller.');
        pane.dataSetter({destination_path: '.count', value: 0});
        pane.dataSetter({destination_path: '.runs', value: 0});
        pane.button('Immediate action', {id: 'immediate',
            action: "this.SET('.count', _counter); this.SET('.runs', this.GET('.runs') + 1)"});
        pane.button('Delayed action', {id: 'delayed', _delay: 600,
            action: "this.SET('.count', _counter); this.SET('.runs', this.GET('.runs') + 1)"});
        pane.button('Delayed controller', {id: 'delayed-controller', _delay: 600}).dataController({func: 'countBurst'});
        pane.button('Delayed confirmation', {id: 'delayed-ask', _delay: 600,
            action: "this.SET('.count', _counter); this.SET('.runs', this.GET('.runs') + 1)", ask: 'Run this group of clicks?'});
        pane.p('Click a delayed button several times quickly. Wait: one execution reports the number of clicks in that group.');
        pane.html_label('Clicks', {for: 'count'});
        pane.output('^.count', {id: 'count'});
        pane.html_label('Executions', {for: 'runs'});
        pane.output('^.runs', {id: 'runs'});
    }
}

export class Logic {
    countBurst(node, {button_counter}) {
        node.SET('.count', button_counter);
        node.SET('.runs', node.GET('.runs') + 1);
    }
}
