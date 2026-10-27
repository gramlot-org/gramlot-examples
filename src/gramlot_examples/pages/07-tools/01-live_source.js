import {Page as BasePage} from '@gramlot/gramlot/page';

// These browser actions change Source, never DOM elements. `this` is the button node; its builder holds the Source.
const ACTIONS = {
    add: "this.builder.wrapSource(this.builder.source.getNode('main.main_content.work.items')).li('A new item', {class: 'card'})",
    remove: "const items = this.builder.source.getItem('main.main_content.work.items'); const last = items.getNodes().at(-1); if (last) items.popNode(last.label)",
    clear: "this.builder.source.getItem('main.main_content.work.items').clear()",
    rename: "this.builder.source.getNode('main.main_content.heading').setValue('Source is alive!')",
    color: "this.builder.source.getNode('main.main_content.motion.scene.ball').setAttr({fill: 'var(--gramlot-warning)'})",
    stop: "this.builder.source.getItem('main.main_content').popNode('motion')",
};

export class Page extends BasePage {
    static title = "Live Source playground";

    main(root) {
        const main_content = root.main({node_label: 'main_content', class: 'example-page stack'});
        main_content.h1('Live Source playground', {node_label: 'heading'});
        main_content.p('Create and remove items, change text and watch SVG move. Every change goes through Source.');
        this.workspace(main_content);
        this.motion(main_content);
        main_content.p('Reload to restore the initial page. Changes are local to this browser page.', {class: 'muted'});
    }

    action_button(root, title, action) {
        root.html_button(title, {type: 'button', connect_onclick: ACTIONS[action]});
    }

    workspace(main_content) {
        const work = main_content.section({node_label: 'work', class: 'card stack'});
        work.h2('Build a list live');
        work.p('The first two items are authored by a loop. Add item uses the browser Builder to create another li.');
        const toolbar = work.div({class: 'live-toolbar'});
        for (const [title, action] of [['Add item', 'add'], ['Remove last', 'remove'], ['Clear list', 'clear'], ['Change heading', 'rename']]) {
            this.action_button(toolbar, title, action);
        }
        const items = work.ul({node_label: 'items', class: 'live-items'});
        for (const title of ['Explore the Source', 'Try a live change']) items.li(title, {class: 'card'});
    }

    motion(main_content) {
        const motion = main_content.section({node_label: 'motion', class: 'card stack'});
        motion.h2('An animated Source attribute');
        motion.p("Every 50 ms a controller changes the circle's cx attribute in Source. Gramlot projects it into SVG.");
        motion.dataController({func: 'animate', _timing: 0.05});
        const scene = motion.svg({node_label: 'scene', viewBox: '0 0 320 100', role: 'img', aria_label: 'A circle moving from side to side'});
        scene.line({x1: 30, y1: 50, x2: 290, y2: 50, stroke: 'var(--gramlot-action)', stroke_width: 2});
        scene.circle({node_label: 'ball', cx: 160, cy: 50, r: 16, fill: 'var(--gramlot-action)'});
        const toolbar = motion.div({class: 'live-toolbar'});
        this.action_button(toolbar, 'Change ball color', 'color');
        this.action_button(toolbar, 'Remove animation', 'stop');
        motion.p("Removing this section also removes its controller, and the controller's timer stops with it.", {class: 'muted'});
    }
}

/** Logic of 13_live_source.py and 13_live_source.js: the controller of the motion section. */
export class Logic {
    /** Every `_timing` tick: the ball moves along its line; the position depends on elapsed time, not on the tick count. */
    animate(node) {
        const ball = this.page.src.source.getNode('main.main_content.motion.scene.ball');
        ball.setAttr({cx: 160 + 110 * Math.sin(performance.now() / 700)});
    }
}
