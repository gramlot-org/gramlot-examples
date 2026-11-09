import {Page as BasePage} from '@gramlot/gramlot/page';
import {triangle} from '../../triangle.js';

export class Page extends BasePage {
    main(root) {
        root.h2('One description', {class: 'demo-title'});
        const cards = root.div({class: 'triangle-grid'});
        const examples = [
            ['first', 8, 4, '#417bda'],
            ['second', 4, 8, '#23a5a2'],
            ['third', 7, 7, '#ed9d2d'],
        ];
        for (const [name, base, height, color] of examples) {
            const card = cards.section({class: 'triangle-card'});
            card.div({class: 'window-bar'}).span('●  ●  ●');
            const pane = card.div({datapath: `triangles.${name}`, class: 'triangle-body'});
            triangle(pane, base, height, color);
            card.div(`triangles.${name}`, {class: 'path-label'});
        }
    }
}
