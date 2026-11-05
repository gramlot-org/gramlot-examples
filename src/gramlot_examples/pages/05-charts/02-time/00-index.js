import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.h1("Time");
        root.p("Animate a sine wave or play prepared monthly snapshots. Samples, time controls and configuration live in Data; fixed axes make changes readable.");
    }
}
