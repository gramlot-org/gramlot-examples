import {Page as BasePage} from '@gramlot/native-html/page';

export class Page extends BasePage {
    static title = 'Inline expressions';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'player'});
        pane.h1('Inline expressions');
        const form = pane.form({class: 'card stack'});
        for (const [label, key] of [['First name', 'first'], ['Last name', 'last']]) {
            form.html_label(label, {for: key});
            form.input({value: `^.${key}`, live: true, id: key});
        }
        form.html_label('Score', {for: 'score'});
        form.input({type: 'range', min: 0, max: 100, value: '^.score', live: true, id: 'score'});
        const row = form.div();
        row.input({type: 'checkbox', value: '^.accepted', id: 'accepted'});
        row.html_label('I accept the rules', {for: 'accepted'});

        const result = pane.section({class: 'card stack'});
        result.h2("==first + ' ' + last", {first: '^.first', last: '^.last', id: 'full-name'});
        result.p("==score >= 50 ? 'Passed' : 'Not yet'", {score: '^.score', id: 'verdict',
            class: "==score >= 50 ? 'status status--success' : 'status status--error'",
            title: "=='Score ' + score + ' of 100'"});
        const bar = result.svg({viewBox: '0 0 300 20', role: 'img', aria_label: 'Score bar', class: 'example-art'});
        bar.rect({x: 0, y: 0, height: 20, width: '==score * 3', score: '^.score', fill: 'var(--gramlot-action)', id: 'bar'});
        result.button('Start', {disabled: '==!accepted', accepted: '^.accepted', id: 'start',
            action: "this.SET('.started', true)"});
        result.p('Started', {visible: '^.started', id: 'started', class: 'muted'});

        pane.dataSetter({destination_path: '.first', value: 'Ada'});
        pane.dataSetter({destination_path: '.last', value: 'Lovelace'});
        pane.dataSetter({destination_path: '.score', value: 40});
        pane.dataSetter({destination_path: '.accepted', value: false});
        pane.dataSetter({destination_path: '.started', value: false});
    }
}
