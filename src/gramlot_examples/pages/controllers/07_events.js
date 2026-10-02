import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Events';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'events'});
        pane.h1('Events');

        const clicks = pane.section({class: 'card stack', id: 'click-area',
            connect_onclick: "this.SET('.clicked', event.target.id || event.target.localName)"});
        clicks.h2('connect_onclick on a section');
        clicks.p('Click anywhere in this card, or on one of the chips.');
        for (const name of ['red', 'green', 'blue']) clicks.span(name, {id: `chip-${name}`, class: 'status'});
        clicks.p('^.clicked', {id: 'clicked', class: 'muted'});

        const typing = pane.section({class: 'card stack'});
        typing.h2('connect_oninput and connect_onkeydown');
        typing.html_label('Type here', {for: 'typing'});
        typing.input({id: 'typing', connect_oninput: "this.SET('.length', event.target.value.length)",
            connect_onkeydown: "this.SET('.key', event.key)"});
        const facts = typing.dl();
        for (const [label, key] of [['Length', 'length'], ['Last key', 'key']]) {
            facts.dt(label);
            facts.dd(`^.${key}`, {id: key});
        }

        const hover = pane.section({class: 'card stack'});
        hover.h2('connect_onmouseover and connect_onmouseout');
        hover.div('Move the pointer over this box', {id: 'hover-box', class: '^.hover_class',
            connect_onmouseover: "this.SET('.hover_class', 'card status status--success')",
            connect_onmouseout: "this.SET('.hover_class', 'card')"});

        pane.dataSetter({destination_path: '.hover_class', value: 'card'});
        pane.dataSetter({destination_path: '.length', value: 0});
    }
}
