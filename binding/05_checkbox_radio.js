import {Page as BasePage} from '@gramlot/native-html/page';

const PLANS = [['basic', 'Basic'], ['plus', 'Plus'], ['team', 'Team']];

export class Page extends BasePage {
    static title = 'Checkbox and radio';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'choice'});
        pane.h1('Checkbox and radio');

        const options = pane.fieldset({class: 'card stack'});
        options.legend('Options');
        for (const [key, label] of [['newsletter', 'Newsletter'], ['invoice', 'Paper invoice']]) {
            const row = options.div();
            row.input({type: 'checkbox', value: `^.${key}`, id: key});
            row.html_label(label, {for: key});
        }

        const plans = pane.fieldset({class: 'card stack'});
        plans.legend('Plan');
        for (const [key, label] of PLANS) {
            const row = plans.div();
            row.input({type: 'radio', group: 'plan', value: `^.plan.${key}`, id: key});
            row.html_label(label, {for: key});
        }

        const values = pane.section({class: 'card stack'});
        values.h2('The Data');
        const facts = values.dl();
        for (const key of ['newsletter', 'invoice', 'plan.basic', 'plan.plus', 'plan.team']) {
            facts.dt(key);
            facts.dd(`^.${key}`, {id: `out-${key.replace('.', '-')}`});
        }

        pane.dataSetter({destination_path: '.newsletter', value: true});
        pane.dataSetter({destination_path: '.invoice', value: false});
        pane.dataSetter({destination_path: '.plan.plus', value: true});
    }
}
