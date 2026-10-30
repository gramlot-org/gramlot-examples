import {Page as BasePage, Bag} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Sieve of Eratosthenes: animate reactive Data';
    static devices = ['desktop', 'tablet', 'phone'];

    main(root) {
        const main_content = root.main({datapath: 'sieve', class: 'sieve-page'});
        main_content.h1('Sieve of Eratosthenes');
        main_content.p('A learning example: discover the primes from 1 to 100, one Data update at a time.', {class: 'muted'});
        this.controls(main_content);
        this.grid(main_content);
        this.explanation(main_content);
        main_content.dataController({func: 'reset', _onStart: true});
        main_content.dataFormula({result_path: '.interval', formula: 'running ? delay : 0', running: '^.running', delay: '^.delay', _init: true});
        main_content.dataController({func: 'step', _timing: '^.interval'});
    }

    controls(pane) {
        const bar = pane.div({class: 'sieve-controls'});
        for (const [caption, method, disabled] of [['Start', 'start', '^.running:=!!{} || {done}'],
                                                 ['Pause', 'pause', '^.running:=!{}'],
                                                 ['Step', 'step', '^.running:=!!{} || {done}'],
                                                 ['Reset', 'reset', false]]) {
            bar.button(caption, {id: `sieve-${method}`, disabled, done: '^.done'}).dataController({func: method});
        }
        bar.horizontalSlider({value: '^.delay', lbl: 'Seconds per step', min: 0.05, max: 1, step: 0.05,
            default: 0.25, live: true, class: 'sieve-speed'});
        bar.span('^.delay', {mask: '{} s', class: 'sieve-speed-value'});
        const facts = pane.div({class: 'sieve-facts'});
        facts.span('^.prime', {mask: 'Current prime: {}', visible: '^.prime:={} > 0'});
        facts.span('Current prime: —', {visible: '^.prime:=!{}'});
        for (const [path, label] of [['count', 'Primes found'], ['steps', 'Steps']]) {
            facts.span(`^.${path}`, {mask: `${label}: {}`});
        }
        pane.p('^.message', {class: 'sieve-message', role: 'status', id: 'sieve-message'});
    }

    grid(pane) {
        const legend = pane.div({class: 'sieve-legend'});
        for (const [state, label] of [['pending', 'Not visited'], ['prime', 'Prime'], ['composite', 'Composite'], ['excluded', '1 is not prime']]) {
            legend.span(label, {class: `sieve-key sieve-${state}`});
        }
        const grid = pane.div({class: 'sieve-grid', role: 'group', aria_label: 'Numbers 1 to 100'});
        for (let number = 1; number <= 100; number++) {
            grid.span(String(number), {class: `^.cells.n${number}:sieve-cell sieve-{}`,
                aria_label: `^.cells.n${number}:${number}: {}`,
                aria_current: `^.current:={} === ${number} ? 'step' : 'false'`});
        }
    }

    explanation(pane) {
        const guide = pane.details({class: 'sieve-guide'});
        guide.summary('How the animation works');
        for (const text of ['The timer calls step() every interval seconds. Zero stops the timer; Pause preserves the Data.',
                            'step() changes the cells in the Data Bag. It never finds or edits an HTML element.',
                            "Each cell's class is bound to its Data value. The bindings turn those updates into colors.",
                            'Step calls exactly the same method as the timer. Reset stops playback and replaces the initial state.']) guide.p(text);
    }
}

/** All execution state lives in Data; both authoring languages use this browser Logic. */
export class Logic {
    reset(node) {
        node.SET('.running', false);
        const cells = new Bag();
        for (let number = 1; number <= 100; number++) cells.setItem(`n${number}`, number === 1 ? 'excluded' : 'pending');
        node.SET('.cells', cells);
        for (const [key, value] of Object.entries({prime: 0, multiple: 101, current: 0, count: 0, steps: 0, done: false})) node.SET(`.${key}`, value);
        node.SET('.message', 'Ready. 1 is not prime. Press Step to discover 2, or Start to play.');
    }

    start(node) { if (!node.GET('.done')) node.SET('.running', true); }
    pause(node) { node.SET('.running', false); }

    step(node) {
        if (node.GET('.done')) return;
        const cells = node.GET('.cells');
        let prime = node.GET('.prime'), multiple = node.GET('.multiple');
        if (multiple <= 100) {
            node.SET(`.cells.n${multiple}`, 'composite');
            node.SET('.current', multiple);
            node.SET('.multiple', multiple + prime);
            node.SET('.message', `${multiple} = ${prime} × ${multiple / prime}: mark it composite.`);
        } else {
            do { prime++; } while (prime <= 100 && cells.getItem(`n${prime}`) !== 'pending');
            if (prime > 100) {
                node.SET('.done', true);
                node.SET('.running', false);
                node.SET('.current', 0);
                node.SET('.message', 'Complete: 25 primes up to 100. Reset to explore again.');
                return;
            }
            node.SET(`.cells.n${prime}`, 'prime');
            node.SET('.prime', prime);
            node.SET('.current', prime);
            node.SET('.multiple', prime * prime);
            node.SET('.count', node.GET('.count') + 1);
            node.SET('.message', prime * prime <= 100 ? `${prime} is prime. Cross out its multiples, starting at ${prime * prime}.` : `${prime} is prime. Its square is beyond 100.`);
        }
        node.SET('.steps', node.GET('.steps') + 1);
    }
}
