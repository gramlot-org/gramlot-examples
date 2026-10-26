import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Expandable sections and progress indicators";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1('Built-in disclosure and measures');
        main_content.p("Open the questions with the browser's native details control.");
        for (const [question, answer] of [
            ['What is Source?', 'A declarative tree describing the page.'],
            ['Can a page contain SVG?', 'Yes. The SVG dialect nests under an HTML Source node.'],
        ]) {
            const details = main_content.details({class: 'card'});
            details.summary(question);
            details.p(answer);
        }
        const measures = main_content.section({class: 'card stack'});
        measures.h2('Measured values');
        measures.html_label('Preparation: 70%', {for: 'preparation'});
        measures.progress({id: 'preparation', value: 70, max: 100});
        measures.html_label('Quality score: 8 of 10', {for: 'quality'});
        measures.meter({id: 'quality', min: 0, max: 10, low: 4, high: 8, optimum: 10, value: 8});
        measures.p('These numbers are fixed page content; no live progress is implied.', {class: 'muted'});
    }
}
