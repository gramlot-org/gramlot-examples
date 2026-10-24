import {Page as BasePage} from '@gramlot/gramlot/page';

const OPTIONS = [['ada', 'Ada Lovelace'], ['alan', 'Alan Turing'], ['grace', 'Grace Hopper']];

export class Page extends BasePage {
    static title = 'Variable datapath';

    main(root) {
        const pane = root.div({class: 'example-page stack'});
        pane.h1('Variable datapath');
        pane.html_label('Record', {for: 'record'});
        const choice = pane.select({default: "people.ada", id: 'record', value: '^current'});
        for (const [key, caption] of OPTIONS) {
            choice.option(caption, {value: `people.${key}`});
        }

        const card = pane.article({datapath: '^current', class: 'card stack'});
        card.h2('^.name', {id: 'name'});
        card.p('^.field', {id: 'field'});
        card.p('^.born', {id: 'born', class: 'muted'});
        card.html_label('Edit the name of this record', {for: 'name-field'});
        card.input({value: '^.name', id: 'name-field'});
        pane.p('^current', {id: 'current', class: 'muted'});

    }
}
