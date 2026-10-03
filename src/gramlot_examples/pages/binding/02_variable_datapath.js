import {Page as BasePage} from '@gramlot/gramlot/page';

const PEOPLE = {
    ada: {name: 'Ada Lovelace', field: 'Mathematics', born: 1815},
    alan: {name: 'Alan Turing', field: 'Computer science', born: 1912},
    grace: {name: 'Grace Hopper', field: 'Programming languages', born: 1906},
};

export class Page extends BasePage {
    static title = 'Variable datapath';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack'});
        pane.h1('Variable datapath');
        pane.html_label('Record', {for: 'record'});
        const choice = pane.select({id: 'record', value: '^current'});
        for (const [key, person] of Object.entries(PEOPLE)) {
            choice.option(person.name, {value: `people.${key}`});
        }

        const card = pane.article({datapath: '^current', class: 'card stack'});
        card.h2('^.name', {id: 'name'});
        card.p('^.field', {id: 'field'});
        card.p('^.born', {id: 'born', class: 'muted'});
        card.html_label('Edit the name of this record', {for: 'name-field'});
        card.input({value: '^.name', id: 'name-field'});
        pane.p('^current', {id: 'current', class: 'muted'});

        pane.dataSetter({destination_path: 'people', value: PEOPLE});
        pane.dataSetter({destination_path: 'current', value: 'people.ada'});
    }
}

/** The page logic: this page names no methods. */
export class Logic {}
