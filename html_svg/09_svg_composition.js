import {Page as BasePage} from '@gramlot/native-html/page';

export class Page extends BasePage {
    static title = 'SVG composition';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const page = root.main({class: 'example-page stack'});
        page.h1('Compose a small SVG scene');
        page.p('Groups and loops arrange repeated Source nodes in a single viewport.');
        const figure = page.figure({class: 'card'});
        const drawing = figure.svg({viewBox: '0 0 560 240', role: 'img', aria_labelledby: 'scene-title', class: 'example-art'});
        drawing.title('A row of houses and trees in a garden', {id: 'scene-title'});
        drawing.rect({x: 0, y: 0, width: 560, height: 240, fill: 'var(--gramlot-surface-subtle)'});
        drawing.rect({x: 0, y: 177, width: 560, height: 63, fill: 'var(--gramlot-border)'});
        for (const x of [115, 330]) this.house(drawing, x);
        for (const x of [40, 260, 505]) this.tree(drawing, x);
        for (const [x, color] of [[74, 'var(--gramlot-action)'], [282, 'var(--gramlot-warning)'], [465, 'var(--gramlot-brand-blue)']]) this.flower(drawing, x, color);
        figure.figcaption('House, tree and flower methods compose one scene through groups and loops.');
    }

    house(drawing, x) {
        const group = drawing.g({transform: `translate(${x} 0)`});
        group.rect({x: 0, y: 92, width: 125, height: 85, fill: 'var(--gramlot-surface)', stroke: 'var(--gramlot-action)', stroke_width: 3});
        group.path({d: 'M-10 92 L62 42 L135 92 Z', fill: 'var(--gramlot-action)'});
        group.rect({x: 47, y: 127, width: 30, height: 50, fill: 'var(--gramlot-selected)'});
        for (const windowX of [17, 91]) group.rect({x: windowX, y: 110, width: 17, height: 18, fill: 'var(--gramlot-brand-yellow)'});
    }

    tree(drawing, x) {
        const group = drawing.g({transform: `translate(${x} 0)`});
        group.rect({x: -4, y: 103, width: 8, height: 74, fill: 'var(--gramlot-success)'});
        for (const [cx, cy] of [[-14, 111], [12, 109], [0, 88]]) group.circle({cx, cy, r: 22, fill: 'var(--gramlot-success)'});
    }

    flower(drawing, x, color) {
        const group = drawing.g({transform: `translate(${x} 0)`});
        group.line({x1: 0, y1: 207, x2: 0, y2: 187, stroke: 'var(--gramlot-success)', stroke_width: 3});
        for (const [dx, dy] of [[-7, 0], [7, 0], [0, -7], [0, 7]]) group.circle({cx: dx, cy: 184 + dy, r: 6, fill: color});
        group.circle({cx: 0, cy: 184, r: 4, fill: 'var(--gramlot-brand-yellow)'});
    }
}
