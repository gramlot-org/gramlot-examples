import {Page as BasePage} from '@gramlot/native-html/page';

export class Page extends BasePage {
    static title = 'Native disclosure and measures';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const page = root.main({class: 'example-page stack'});
        page.h1('Built-in disclosure and measures');
        page.p("Open the questions with the browser's native details control.");
        for (const [question, answer] of [
            ['What is Source?', 'A declarative tree describing the page.'],
            ['Can a page contain SVG?', 'Yes. The SVG dialect nests under an HTML Source node.'],
        ]) {
            const details = page.details({class: 'card'});
            details.summary(question);
            details.p(answer);
        }
        const measures = page.section({class: 'card stack'});
        measures.h2('Measured values');
        measures.gramlot_label('Preparation: 70%', {for: 'preparation'});
        measures.progress({id: 'preparation', value: 70, max: 100});
        measures.gramlot_label('Quality score: 8 of 10', {for: 'quality'});
        measures.meter({id: 'quality', min: 0, max: 10, low: 4, high: 8, optimum: 10, value: 8});
        measures.p('These numbers are fixed page content; no live progress is implied.', {class: 'muted'});
    }
}
