import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const pane = root.main({padding: '24px'});
        pane.h1('Documentation gallery');
        pane.p('Interactive examples accompanying the Gramlot developer manual.');
    }
}
