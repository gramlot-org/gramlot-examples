import {Page as BasePage} from '@gramlot/native-html/page';

export class Page extends BasePage {
    static title = 'Native form controls';
    static css = ['/themes/gramlot-base/theme.css', '/examples/html_svg/06_forms/style.css'];

    main(root) {
        const page = root.main({class: 'example-page stack'});
        page.h1('Native form controls');
        page.p('Try the controls, then use Reset to restore their initial values. Submit is disabled in this static example.');
        const form = page.form();
        const identity = form.fieldset({class: 'form-grid'});
        identity.legend('Identity');
        this.field(identity, 'Name', 'name', 'text', {value: 'Ada Lovelace', required: true});
        this.field(identity, 'Email', 'email', 'email', {placeholder: 'name@example.org'});
        this.field(identity, 'Search', 'search', 'search', {placeholder: 'Find a topic'});
        this.field(identity, 'Website', 'website', 'url', {placeholder: 'https://example.org'});
        this.field(identity, 'Telephone', 'telephone', 'tel', {placeholder: '+1 555 0100'});
        this.field(identity, 'Password', 'password', 'password', {minlength: 8});

        const choices = form.fieldset({class: 'form-grid'});
        choices.legend('Choices and ranges');
        this.field(choices, 'Quantity', 'quantity', 'number', {min: 1, max: 20, value: 3});
        this.field(choices, 'Date', 'date', 'date');
        this.field(choices, 'Time', 'time', 'time');
        this.field(choices, 'Month', 'month', 'month');
        this.field(choices, 'Week', 'week', 'week');
        this.field(choices, 'Accent', 'accent', 'color', {value: '#456bc4'});
        this.field(choices, 'Intensity', 'intensity', 'range', {min: 0, max: 100, step: 5, value: 60});
        choices.gramlot_label('Region', {for: 'region'});
        const select = choices.select({id: 'region', name: 'region'});
        for (const value of ['North', 'South', 'West']) select.option(value, {value: value.toLowerCase(), selected: value === 'South'});
        choices.gramlot_label('Topics (multiple)', {for: 'topics'});
        const topics = choices.select({id: 'topics', name: 'topics', multiple: true, size: 3});
        for (const topic of ['HTML', 'SVG', 'Source']) topics.option(topic, {value: topic.toLowerCase(), selected: topic === 'HTML'});
        choices.gramlot_label('Note', {for: 'note'});
        choices.textarea('A native multiline field.', {id: 'note', name: 'note', rows: 3});

        const options = form.fieldset({class: 'form-options'});
        options.legend('Flags and states');
        options.gramlot_label('Receive updates', {for: 'updates'});
        options.input({type: 'checkbox', id: 'updates', name: 'updates', checked: true});
        for (const value of ['daily', 'weekly']) {
            options.gramlot_label(value[0].toUpperCase() + value.slice(1), {for: value});
            options.input({type: 'radio', id: value, name: 'frequency', value, checked: value === 'weekly'});
        }
        options.gramlot_label('Read-only code', {for: 'code'});
        options.input({type: 'text', id: 'code', value: 'DEMO-01', readonly: true});
        options.gramlot_label('Unavailable choice', {for: 'unavailable'});
        options.input({type: 'text', id: 'unavailable', value: 'Disabled', disabled: true});
        options.gramlot_label('Attachment', {for: 'attachment'});
        options.input({type: 'file', id: 'attachment', name: 'attachment'});
        const actions = form.div({class: 'form-actions'});
        actions.button('Button without an action', {type: 'button'});
        actions.button('Reset values', {type: 'reset'});
        actions.button('Submit unavailable', {type: 'submit', disabled: true});
    }

    field(parent, label, key, kind, attrs = {}) {
        parent.gramlot_label(label, {for: key});
        parent.input({type: kind, id: key, name: key, ...attrs});
    }
}
