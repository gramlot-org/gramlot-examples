import {Page as BasePage} from '@gramlot/native-html/page';

// These browser actions change Source, never DOM elements.
const ACTIONS = {
    "add": "window.gramlot.builder.wrapSource(window.gramlot.source.getNode('main.page.work.items')).li('A new item', {class: 'card'})",
    "remove": "const items = window.gramlot.source.getItem('main.page.work.items'); const last = items.getNodes().at(-1); if (last) items.popNode(last.label)",
    "clear": "window.gramlot.source.getItem('main.page.work.items').clear()",
    "rename": "window.gramlot.source.getNode('main.page.heading').setValue('Source is alive!')",
    "color": "window.gramlot.source.getNode('main.page.motion.scene.ball').setAttr({fill: 'var(--gramlot-warning)'})",
    "stop": "window.gramlot.source.getItem('main.page').popNode('motion')"
};
const ANIMATION = `queueMicrotask(() => {
    const app = window.gramlot;
    const motion = app.source.getNode('main.page.motion');
    const ball = app.source.getNode('main.page.motion.scene.ball');
    const timer = setInterval(() => {
        ball.setAttr({cx: 160 + 110 * Math.sin(performance.now() / 700)});
    }, 50);
    app.renderer.onDispose(motion, () => clearInterval(timer));
});`;

export class Page extends BasePage {
    static title = 'Live Source playground';
    static css = ['/themes/gramlot-base/theme.css', '/examples/html_svg/13_live_source/style.css'];

    main(root) {
        const page = root.main({node_label: 'page', class: 'example-page stack'});
        page.h1('Live Source playground', {node_label: 'heading'});
        page.p('Create and remove items, change text and watch SVG move. Every change goes through Source.');
        this.workspace(page);
        this.motion(page);
        page.p('Reload to restore the initial page. Changes are local to this browser page.', {class: 'muted'});
        page.script(ANIMATION);
    }

    button(root, title, action) {
        root.button(title, {type: 'button', onclick: ACTIONS[action]});
    }

    workspace(page) {
        const work = page.section({node_label: 'work', class: 'card stack'});
        work.h2('Build a list live');
        work.p('The first two items are authored by a loop. Add item uses the browser Builder to create another li.');
        const toolbar = work.div({class: 'live-toolbar'});
        for (const [title, action] of [['Add item', 'add'], ['Remove last', 'remove'], ['Clear list', 'clear'], ['Change heading', 'rename']]) {
            this.button(toolbar, title, action);
        }
        const items = work.ul({node_label: 'items', class: 'live-items'});
        for (const title of ['Explore the Source', 'Try a live change']) items.li(title, {class: 'card'});
    }

    motion(page) {
        const motion = page.section({node_label: 'motion', class: 'card stack'});
        motion.h2('An animated Source attribute');
        motion.p("Every 50 ms, setInterval changes the circle's cx attribute in Source. Gramlot projects it into SVG.");
        const scene = motion.svg({node_label: 'scene', viewBox: '0 0 320 100', role: 'img', aria_label: 'A circle moving from side to side'});
        scene.line({x1: 30, y1: 50, x2: 290, y2: 50, stroke: 'var(--gramlot-action)', stroke_width: 2});
        scene.circle({node_label: 'ball', cx: 160, cy: 50, r: 16, fill: 'var(--gramlot-action)'});
        const toolbar = motion.div({class: 'live-toolbar'});
        this.button(toolbar, 'Change ball color', 'color');
        this.button(toolbar, 'Remove animation', 'stop');
        motion.p('Removing this section also clears its interval through renderer.onDispose.', {class: 'muted'});
    }
}
