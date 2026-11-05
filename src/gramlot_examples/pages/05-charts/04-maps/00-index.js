import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.h1("Maps");
        root.p("Match territory names to prepared GeoJSON. Geography is input data, not a database dependency.");
    }
}
