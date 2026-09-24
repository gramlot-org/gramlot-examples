import {Page as BasePage} from '@gramlot/native-html/page';

const STEPS = ['Describe a page with Source', 'Add native HTML elements', 'Review the rendered document'];
const TERMS = [['Source', 'The declared structure of a page.'], ['Data', 'A separate home for application state.']];

export class Page extends BasePage {
    static title = 'Lists';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const page = root.main({class: 'example-page stack'});
        page.h1('Lists tell a sequence');
        page.p('Loops add one Source node for each item.');
        const ordered = page.ol();
        for (const step of STEPS) ordered.li(step);
        page.h2('Two useful terms');
        const definitions = page.dl();
        for (const [term, description] of TERMS) {
            definitions.dt(term);
            definitions.dd(description);
        }
        page.h2('A nested list');
        const groups = page.ul();
        const first = groups.li('Native elements');
        const nested = first.ul();
        for (const item of ['headings', 'lists', 'links']) nested.li(item);
        groups.li('Native SVG');
    }
}
