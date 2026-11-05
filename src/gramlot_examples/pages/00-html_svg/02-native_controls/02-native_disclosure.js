import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {

    main(root) {
        for (const [question, answer] of [
            ['What is Source?', 'A declarative tree describing the page.'],
            ['Can a page contain SVG?', 'Yes. The SVG dialect nests under an HTML Source node.'],
        ]) {
            const details = root.details({class: 'card'});
            details.summary(question);
            details.p(answer);
        }
        const measures = root.section({class: 'card stack'});
        measures.h2('Measured values');
        measures.html_label('Preparation: 70%', {for: 'preparation'});
        measures.progress({id: 'preparation', value: 70, max: 100});
        measures.html_label('Quality score: 8 of 10', {for: 'quality'});
        measures.meter({id: 'quality', min: 0, max: 10, low: 4, high: 8, optimum: 10, value: 8});
    }
}
