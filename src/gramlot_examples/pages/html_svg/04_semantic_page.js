import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'A semantic page';

    main(root) {
        const pane = root.div({class: 'example-page stack'});
        const header = pane.header();
        header.p('GRAMLOT JOURNAL', {class: 'eyebrow'});
        header.h1('A page with landmarks');
        const nav = pane.nav({aria_label: 'Page sections'});
        nav.a('Story', {href: '#story'});
        nav.span(' · ');
        nav.a('Notes', {href: '#notes'});
        const main_content = pane.main();
        const article = main_content.article({id: 'story', class: 'stack'});
        article.h2('The article');
        article.p('Header, navigation, main, article and footer each describe a role.');
        const aside = main_content.aside({id: 'notes', class: 'card'});
        aside.h2('A side note');
        aside.p('The markup stays meaningful even without decoration.');
        pane.footer().small('Built with Gramlot Source.');
    }
}
