import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Text and links";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1('Words with meaning');
        const intro = main_content.p('A paragraph can contain ');
        intro.strong('strong emphasis');
        intro.span(', ');
        intro.em('gentle emphasis');
        intro.span(', and a ');
        intro.a('link to the HTML standard', {href: 'https://html.spec.whatwg.org/', target: '_blank', rel: 'noopener noreferrer'});
        intro.span('.');
        main_content.p('Text is escaped by the Source renderer: <tag> is shown as text.', {class: 'muted'});
        const quote = main_content.blockquote();
        quote.p('Clarity grows from small, explicit choices.');
        quote.footer('A note from this example');
        main_content.h2('Code as text');
        main_content.p('The expression below is shown literally:');
        main_content.pre().code("root.h1('Hello')");
        main_content.h3('A local destination', {id: 'destination'});
        main_content.p('Headings give the link above a place to land.');
        main_content.a('Jump back to the heading', {href: '#destination'});
    }
}
