import {Page as BasePage} from '@gramlot/gramlot/page';

const PLANS = [['basic', 'Basic'], ['plus', 'Plus'], ['team', 'Team']];

export class Page extends BasePage {

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'choice'});

        const work = pane.div({class: 'grid lesson-workbench'});
        const options = work.fieldset({class: 'card stack'});
        options.legend('Options');
        for (const [key, label] of [['newsletter', 'Newsletter'], ['invoice', 'Paper invoice']]) {
            const row = options.div();
            row.input({type: 'checkbox', value: `^.${key}`, id: key});
            row.html_label(label, {for: key});
        }

        const plans = work.fieldset({class: 'card stack'});
        plans.legend('Plan');
        for (const [key, label] of PLANS) {
            const row = plans.div();
            row.input({type: 'radio', group: 'plan', value: `^.plan.${key}`, id: key});
            row.html_label(label, {for: key});
        }

        const values = work.section({class: 'card stack'});
        values.h2('The Data');
        const facts = values.dl();
        for (const key of ['newsletter', 'invoice', 'plan.basic', 'plan.plus', 'plan.team']) {
            facts.dt(key);
            facts.dd(`^.${key}`, {id: `out-${key.replace('.', '-')}`});
        }

    }
}
