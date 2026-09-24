import {Page as BasePage} from '@gramlot/native-html/page';

export class Page extends BasePage {
    static title = 'A semantic page';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const page = root.div({class: 'example-page stack'});
        const header = page.header();
        header.p('GRAMLOT JOURNAL', {class: 'eyebrow'});
        header.h1('A page with landmarks');
        const nav = page.nav({aria_label: 'Page sections'});
        nav.a('Story', {href: '#story'});
        nav.span(' · ');
        nav.a('Notes', {href: '#notes'});
        const main = page.main();
        const article = main.article({id: 'story', class: 'stack'});
        article.h2('The article');
        article.p('Header, navigation, main, article and footer each describe a role.');
        const aside = main.aside({id: 'notes', class: 'card'});
        aside.h2('A side note');
        aside.p('The markup stays meaningful even without decoration.');
        page.footer().small('Built with native Source elements.');
    }
}
