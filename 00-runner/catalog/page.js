/** A native HTML specimen built entirely with Gramlot Source. */
import {Page as BasePage} from '@gramlot/native-html/page';

export class Page extends BasePage {
    static title = 'Native HTML catalogue';
    static css = ['/themes/gramlot-base/theme.css', '/examples/00-runner/catalog/style.css'];

    main(root) {
        const shell = root.div({class: 'example-page stack'});
        const header = shell.header({class: 'stack'});
        header.p('GRAMLOT · ELEMENT CATALOGUE', {class: 'muted'});
        const heading = header.hgroup();
        heading.h1('The native HTML canvas');
        heading.p('A living sample of semantic elements and controls rendered from Source.');
        const nav = shell.nav({aria_label: 'Catalogue sections'});
        for (const [title, anchor] of [['Text', 'text'], ['Structure', 'structure'],
                                       ['Controls', 'controls'], ['Data', 'data'], ['Media', 'media']]) {
            nav.a(title, {href: `#${anchor}`});
            nav.span('  ·  ', {aria_hidden: true});
        }

        const main = shell.main({class: 'stack'});
        this.text(main);
        this.structure(main);
        this.controls(main);
        this.data(main);
        this.media(main);
        const footer = shell.footer();
        footer.hr();
        footer.small('Source describes this page; the browser supplies native element behavior.');
    }

    text(main) {
        const section = main.section({id: 'text', class: 'stack'});
        section.h2('Text and meaning');
        const cards = section.div({class: 'grid'});
        const headings = cards.article({class: 'card stack'});
        headings.h3('Heading scale');
        headings.h4('A clear subsection');
        headings.h5('A smaller heading');
        headings.h6('The quietest heading');
        headings.p('One page heading sits above these levels.', {class: 'muted'});

        const inline = cards.article({class: 'card stack'});
        inline.h3('Inline vocabulary');
        const sentence = inline.p('A ');
        sentence.strong('strong point');
        sentence.span(' can carry ');
        sentence.em('emphasis');
        sentence.span(', ');
        sentence.mark('a highlight');
        sentence.span(', and an ');
        sentence.a('ordinary link', {href: '#controls'});
        sentence.span('.');
        const terms = inline.p('Tags: ');
        terms.abbr('HTML', {title: 'HyperText Markup Language'});
        terms.span(' · ');
        terms.dfn('Source', {title: 'A declared interface tree'});
        terms.span(' · ');
        terms.code('page.main(root)');
        terms.span(' · ');
        terms.kbd('Tab');
        terms.span(' · ');
        terms.samp('ready');
        inline.pre('const page = source.main();\n// A preformatted snippet');
        inline.p('A plain bold word, an alternate voice, an annotated phrase, and underlined text follow:');
        const flavors = inline.p();
        flavors.b('bold');
        flavors.span(' · ');
        flavors.i('alternate');
        flavors.span(' · ');
        flavors.u('annotated');
        flavors.span(' · ');
        flavors.s('no longer current');
        const changes = inline.p('Changes: ');
        changes.del_('draft');
        changes.span(' → ');
        changes.ins('reviewed');
        const notation = inline.p('Notation: ');
        notation.var('x');
        notation.sup('2');
        notation.span(' + H');
        notation.sub('2');
        notation.span('O · ');
        notation.gramlot_data('SKU-42', {value: '42'});
        notation.span(' · ');
        notation.time('24 September 2026', {datetime: '2026-09-24'});
        inline.small('Small print stays readable and secondary.');

        const prose = cards.article({class: 'card stack'});
        prose.h3('Quotations and direction');
        const quotation = prose.blockquote({cite: 'https://www.w3.org/TR/html52/'});
        quotation.p('Meaningful structure makes a page easier to navigate.');
        quotation.footer().cite('A catalogue note');
        const short = prose.p('A short ');
        short.q('inline quotation', {cite: 'https://html.spec.whatwg.org/'});
        short.span(' can live in a paragraph.');
        const direction = prose.p('Mixed direction: ');
        direction.bdi('مرحبا');
        direction.span(' · ');
        direction.bdo('left to right', {dir: 'ltr'});
        prose.p('An intentional line break');
        const line = prose.p('First line');
        line.br();
        line.span('Second line, with a long word break:');
        line.wbr();
        line.span('cataloguespecimen');
    }

    structure(main) {
        const section = main.section({id: 'structure', class: 'stack'});
        section.h2('Structure and disclosure');
        const cards = section.div({class: 'grid'});
        const article = cards.article({class: 'card stack'});
        article.h3('Article and aside');
        article.p('This article has its own subject and an adjacent note.');
        const aside = article.aside({class: 'surface-subtle'});
        aside.h4('Side note');
        aside.p('Landmarks come from semantic elements, not CSS classes.');
        const address = article.address();
        address.a('Gramlot project', {href: 'https://github.com/gramlot-org/gramlot'});

        const lists = cards.section({class: 'card stack'});
        lists.h3('Lists');
        const ordered = lists.ol();
        for (const item of ['Declare Source', 'Render native HTML', 'Inspect the result']) ordered.li(item);
        const unordered = lists.ul();
        unordered.li('One item');
        unordered.li('Another item');
        const menu = lists.menu();
        menu.li('Menu item A');
        menu.li('Menu item B');
        const definitions = lists.dl();
        definitions.dt('Source');
        definitions.dd('The declared interface structure.');
        definitions.dt('Data');
        definitions.dd('State owned by Data Bags.');

        const disclosure = cards.section({class: 'card stack'});
        disclosure.h3('Native disclosure');
        const details = disclosure.details();
        details.summary('Open a concise explanation');
        details.p('The browser expands and collapses this content without application event code.');
        disclosure.p('A nonmodal dialog is shown open below.', {class: 'muted'});
        const dialog = disclosure.dialog({open: true, class: 'catalog-dialog'});
        dialog.h4('Dialog content');
        dialog.p('The open attribute keeps this nonmodal example visible.');
    }

    controls(main) {
        const section = main.section({id: 'controls', class: 'stack'});
        section.h2('Native controls');
        section.p('Try focus, typing, selection and Reset. Submission is disabled in this static catalogue.', {class: 'muted'});
        const form = section.form({class: 'card stack'});
        const fields = form.div({class: 'grid'});

        const identity = fields.fieldset({class: 'stack'});
        identity.legend('Text and identity');
        for (const [label, key, kind, attrs] of [
            ['Name', 'name', 'text', {value: 'Ada Lovelace', required: true}],
            ['Email', 'email', 'email', {placeholder: 'name@example.org'}],
            ['Search', 'query', 'search', {placeholder: 'Search the catalogue'}],
            ['Website', 'website', 'url', {placeholder: 'https://example.org'}],
            ['Phone', 'phone', 'tel', {placeholder: '+1 555 0100'}],
            ['Password', 'password', 'password', {minlength: 8}],
        ]) this.field(identity, label, key, kind, attrs);
        this.field(identity, 'Read-only reference', 'reference', 'text', {value: 'CAT-01', readonly: true});
        this.field(identity, 'Unavailable field', 'unavailable', 'text', {value: 'Disabled', disabled: true});

        const choices = fields.fieldset({class: 'stack'});
        choices.legend('Choices and ranges');
        for (const [label, key, kind, attrs] of [
            ['Quantity', 'quantity', 'number', {value: 3, min: 1, max: 20}],
            ['Date', 'date', 'date', {}],
            ['Time', 'time', 'time', {}],
            ['Local date and time', 'datetime', 'datetime-local', {}],
            ['Month', 'month', 'month', {}],
            ['Week', 'week', 'week', {}],
            ['Color', 'color', 'color', {value: '#456bc4'}],
            ['Range', 'range', 'range', {value: 55, min: 0, max: 100}],
            ['Attachment', 'attachment', 'file', {}],
        ]) this.field(choices, label, key, kind, attrs);
        const regionField = choices.div();
        regionField.gramlot_label('Region', {for: 'region'});
        const region = regionField.select({id: 'region', name: 'region'});
        const north = region.optgroup({label: 'Northern regions'});
        north.option('Alps', {value: 'alps'});
        north.option('Lakes', {value: 'lakes', selected: true});
        const south = region.optgroup({label: 'Southern regions'});
        south.option('Coast', {value: 'coast'});
        const topicsField = choices.div();
        topicsField.gramlot_label('Topics (multiple)', {for: 'topics'});
        const topics = topicsField.select({id: 'topics', name: 'topics', multiple: true, size: 3});
        for (const value of ['HTML', 'SVG', 'Source']) topics.option(value, {value: value.toLowerCase(), selected: value === 'HTML'});

        const states = fields.fieldset({class: 'stack'});
        states.legend('Flags and values');
        let row = states.div();
        row.input({type: 'checkbox', id: 'updates', name: 'updates', checked: true});
        row.gramlot_label('Receive updates', {for: 'updates'});
        for (const value of ['daily', 'weekly']) {
            row = states.div();
            row.input({type: 'radio', id: value, name: 'frequency', value, checked: value === 'weekly'});
            row.gramlot_label(value[0].toUpperCase() + value.slice(1), {for: value});
        }
        const languageField = states.div();
        languageField.gramlot_label('Favourite language', {for: 'language'});
        languageField.input({type: 'text', id: 'language', name: 'language', list: 'languages'});
        const suggestions = states.datalist({id: 'languages'});
        for (const value of ['Python', 'JavaScript', 'HTML']) suggestions.option(value);
        const noteField = states.div();
        noteField.gramlot_label('Note', {for: 'note'});
        noteField.textarea('A native multiline field.', {id: 'note', name: 'note', rows: 3});
        states.p('Measured value');
        states.meter('70%', {value: '0.7', min: '0', max: '1', low: '0.3', high: '0.8', optimum: '0.9'});
        states.p('Progress');
        states.progress('60%', {value: '60', max: '100'});
        const result = states.p('Calculated output: ');
        result.output('42', {name: 'result'});

        const actions = form.div();
        actions.button('Reset values', {type: 'reset', class: 'button--secondary'});
        actions.span(' ');
        actions.button('Submit unavailable', {type: 'submit', disabled: true});
        const search = section.search({class: 'card'});
        const searchField = search.div();
        searchField.gramlot_label('Search landmark', {for: 'landmark-query'});
        searchField.input({type: 'search', id: 'landmark-query', placeholder: 'A separate native search landmark'});
    }

    data(main) {
        const section = main.section({id: 'data', class: 'stack'});
        section.h2('Tabular data');
        const wrapper = section.div({class: 'card'});
        const table = wrapper.table();
        table.caption('Quarterly orders by region');
        const columns = table.colgroup();
        columns.col();
        columns.col({span: '3'});
        const heading = table.thead().tr();
        for (const label of ['Region', 'Q1', 'Q2', 'Total']) heading.th(label, {scope: 'col'});
        const body = table.tbody();
        for (const [region, first, second] of [['North', 12, 8], ['South', 9, 11], ['West', 15, 6]]) {
            const row = body.tr();
            row.th(region, {scope: 'row'});
            for (const value of [first, second, first + second]) row.td(String(value));
        }
        const total = table.tfoot().tr();
        total.th('All', {scope: 'row'});
        for (const value of [36, 25, 61]) total.td(String(value));
    }

    media(main) {
        const section = main.section({id: 'media', class: 'stack'});
        section.h2('Images and SVG');
        const cards = section.div({class: 'grid'});
        const figure = cards.figure({class: 'card stack'});
        const picture = figure.picture();
        picture.source({srcset: '/assets/branding/gramlot-mark-dark.png', media: '(prefers-color-scheme: dark)'});
        picture.img({src: '/assets/branding/gramlot-mark.png', alt: 'Gramlot curved blue and yellow symbol; blue arc and yellow disc link to notes below', width: '160', height: '160', usemap: '#gramlot-symbol-map'});
        const imageMap = figure.map({name: 'gramlot-symbol-map'});
        imageMap.area({shape: 'rect', coords: '150,600,660,1120', href: '#blue-note', alt: 'Blue arc note'});
        imageMap.area({shape: 'circle', coords: '800,570,85', href: '#yellow-note', alt: 'Yellow disc note'});
        figure.p('The blue arc is the principal shape.', {id: 'blue-note'});
        figure.p('The detached yellow disc completes the mark.', {id: 'yellow-note'});
        figure.figcaption('The picture switches assets with the color scheme; the image map links its two shapes to notes.');
        const vector = cards.figure({class: 'card stack'});
        const icon = vector.svg({viewBox: '0 0 120 80', role: 'img', aria_label: 'A blue circle and a yellow bar', width: '120', height: '80'});
        icon.circle({cx: '32', cy: '40', r: '22', fill: '#456bc4'});
        icon.rect({x: '68', y: '18', width: '30', height: '44', rx: '6', fill: '#ffc400'});
        vector.figcaption('An inline SVG created through the SVG sub-builder.');
    }

    field(parent, label, key, kind, attrs = {}) {
        const field = parent.div();
        field.gramlot_label(label, {for: key});
        field.input({type: kind, id: key, name: key, ...attrs});
    }
}
