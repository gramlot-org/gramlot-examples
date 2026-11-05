import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.h1("Simple charts");
        root.p("Compare values, trends, shares and relationships. Start with the grid, open Chart and change data or configuration.");
    }
}
