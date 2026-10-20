import {Page as BasePage} from '@gramlot/gramlot/page';

const STEPS = ['Describe a page with Source', 'Add HTML elements', 'Review the rendered document'];
const TERMS = [['Source', 'The declared structure of a page.'], ['Data', 'A separate home for application state.']];

export class Page extends BasePage {
    static title = 'Lists';

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1('Lists tell a sequence');
        main_content.p('Loops add one Source node for each item.');
        const ordered = main_content.ol();
        for (const step of STEPS) ordered.li(step);
        main_content.h2('Two useful terms');
        const definitions = main_content.dl();
        for (const [term, description] of TERMS) {
            definitions.dt(term);
            definitions.dd(description);
        }
        main_content.h2('A nested list');
        const groups = main_content.ul();
        const first = groups.li('HTML elements');
        const nested = first.ul();
        for (const item of ['headings', 'lists', 'links']) nested.li(item);
        groups.li('SVG');
    }
}
