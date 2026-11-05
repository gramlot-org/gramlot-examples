import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.h1("3D");
        root.p("Choose categorical bars or numeric coordinates. 3D uses WebGL and the same Data/configuration contract.");
    }
}
