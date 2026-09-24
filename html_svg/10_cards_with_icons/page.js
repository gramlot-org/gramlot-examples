import {Page as BasePage} from '@gramlot/native-html/page';

const CARDS = [
    ['Structure', 'Source describes the page tree.', 'structure'],
    ['Drawing', 'SVG sits naturally beside HTML.', 'drawing'],
    ['Reading', 'Semantic elements give content a role.', 'reading'],
];

export class Page extends BasePage {
    static title = 'Cards with SVG icons';
    static css = ['/themes/gramlot-base/theme.css', '/examples/html_svg/10_cards_with_icons/style.css'];

    main(root) {
        const page = root.main({node_label: 'page', class: 'example-page stack'});
        page.h1('Three ideas, three icons');
        page.p('Click × to remove a card from Source. Gramlot updates the DOM without reloading.');
        const cards = page.section({node_label: 'cards', class: 'grid icon-cards', aria_label: 'Gramlot concepts'});
        for (const [title, description, kind] of CARDS) {
            const card = cards.article({node_label: kind, class: 'card stack'});
            card.button('×', {type: 'button', class: 'card-remove', aria_label: `Remove ${title}`,
                onclick: `window.gramlot.builder.source.getItem('main.page.cards').popNode('${kind}')`});
            const icon = card.svg({viewBox: '0 0 64 64', width: 64, height: 64, aria_hidden: 'true'});
            this.icon(icon, kind);
            card.h2(title);
            card.p(description);
        }
    }

    icon(icon, kind) {
        icon.rect({x: 2, y: 2, width: 60, height: 60, rx: 16, fill: 'var(--gramlot-surface-subtle)'});
        if (kind === 'structure') {
            for (const [x, y] of [[18, 18], [36, 18], [27, 38]]) icon.rect({x, y, width: 11, height: 11, rx: 2, fill: 'var(--gramlot-action)'});
        } else if (kind === 'drawing') {
            icon.circle({cx: 32, cy: 32, r: 17, fill: 'none', stroke: 'var(--gramlot-warning)', stroke_width: 5});
            icon.circle({cx: 32, cy: 32, r: 5, fill: 'var(--gramlot-warning)'});
        } else {
            icon.path({d: 'M17 18h30v28H17z M25 26h14 M25 32h14 M25 38h10', fill: 'none', stroke: 'var(--gramlot-success)', stroke_width: 3, stroke_linecap: 'round'});
        }
    }
}
