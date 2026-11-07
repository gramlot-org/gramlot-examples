/** The site root of the hosted galleries: one tab per gallery, each an iframe on its mount. */
import {Page as BasePage} from '@gramlot/gramlot/page';

const GALLERIES = [['gallery', 'Gallery', '/gallery/'], ['chart_gallery', 'Chart gallery', '/chart_gallery/']];

export class Page extends BasePage {
    static title = 'Gramlot galleries';

    main(root) {
        const tabs = root.tabContainer({id: 'galleries', height: '100vh', default_selected: 0});
        for (const [name, title, url] of GALLERIES) {
            const pane = tabs.contentPane({pageName: name, title, overflow: 'hidden'});
            pane.iframe({src: url, title, width: '100%', height: '100%', border: 0});
        }
    }
}
