import {Page as BasePage} from '@gramlot/gramlot/page';
import {triangle} from '../../triangle.js';

export class Page extends BasePage {
    main(root) {
        const pane = root.div({datapath: 'example', class: 'triangle-body'});
        triangle(pane, 8, 6, '#3366cc');
    }
}
