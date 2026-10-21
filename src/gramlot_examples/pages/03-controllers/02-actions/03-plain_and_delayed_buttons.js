import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Plain and delayed buttons';
    main(root) {
        const main_content = root.main({class: 'example-page stack', datapath: 'clicks'});
        main_content.h1('Native HTML, then Gramlot behavior');
        const form = main_content.form({class: 'card stack'});
        form.html_label('Native value', {for: 'native-value'});
        form.input({id: 'native-value', value: 'Original'});
        form.html_button('Native reset', {type: 'reset', id: 'native-reset'});
        main_content.p('Edit the field and Reset: the browser restores its initial value, without a Data controller.');
        main_content.dataSetter({destination_path: '.count', value: 0});
        main_content.dataSetter({destination_path: '.runs', value: 0});
        main_content.button('Immediate action', {id: 'immediate',
            action: "this.SET('.count', _counter); this.SET('.runs', this.GET('.runs') + 1)"});
        main_content.button('Delayed action', {id: 'delayed', _delay: 600,
            action: "this.SET('.count', _counter); this.SET('.runs', this.GET('.runs') + 1)"});
        main_content.button('Delayed controller', {id: 'delayed-controller', _delay: 600}).dataController({func: 'countBurst'});
        main_content.button('Delayed confirmation', {id: 'delayed-ask', _delay: 600,
            action: "this.SET('.count', _counter); this.SET('.runs', this.GET('.runs') + 1)", ask: 'Run this group of clicks?'});
        main_content.p('Click a delayed button several times quickly. Wait: one execution reports the number of clicks in that group.');
        main_content.html_label('Clicks', {for: 'count'});
        main_content.output('^.count', {id: 'count'});
        main_content.html_label('Executions', {for: 'runs'});
        main_content.output('^.runs', {id: 'runs'});
    }
}

export class Logic {
    countBurst(node, {button_counter}) {
        node.SET('.count', button_counter);
        node.SET('.runs', node.GET('.runs') + 1);
    }
}
