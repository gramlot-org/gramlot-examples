import {Page as BasePage} from '@gramlot/gramlot/page';

const KEYS = "[button_shift && 'Shift', button_ctrl && 'Ctrl', button_alt && 'Alt', button_meta && 'Meta']" +
    ".filter(Boolean).join('+') || 'none'";

export class Page extends BasePage {
    static title = 'Button controller';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'buttons'});
        pane.h1('Button controller');

        const nested = pane.section({class: 'card stack'});
        nested.h2('A controller nested in the button');
        const button = nested.button('Press me, also with Shift or Alt', {id: 'press'});
        button.dataController({script: `this.SET('.clicks', button_counter); this.SET('.keys', ${KEYS})`});
        const facts = nested.dl();
        for (const [label, key] of [['button_counter', 'clicks'], ['Modifier keys', 'keys']]) {
            facts.dt(label);
            facts.dd(`^.${key}`, {id: key});
        }

        const fired = pane.section({class: 'card stack'});
        fired.h2('fire and fire_<name>');
        fired.button('Save (fire)', {fire: '.saved', id: 'save'});
        fired.p('^.saved_with', {id: 'saved-with'});
        fired.button('Save and close (fire_save, fire_close)', {fire_save: '.command', fire_close: '.command',
            id: 'save-close'});
        fired.p('^.log', {id: 'log'});

        pane.dataController({script: "this.SET('.saved_with', 'fired with ' + saved)", saved: '^.saved'});
        pane.dataController({script: "this.SET('.log', (log ? log + ', ' : '') + command)", command: '^.command', log: '=.log'});
        pane.dataSetter({destination_path: '.clicks', value: 0});
    }
}
