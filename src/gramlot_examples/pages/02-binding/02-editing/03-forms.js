import {Page as BasePage} from '@gramlot/gramlot/page';

const SHOWN = ['name', 'email', 'search', 'website', 'telephone', 'quantity', 'date', 'time', 'month',
    'week', 'accent', 'intensity', 'region', 'topics', 'note', 'updates'];

export class Page extends BasePage {
    static title = "Bound forms";

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'form'});
        pane.h1('Bound forms');
        pane.p('Edit a field, then leave it: the Data record follows. Intensity updates while dragging.');
        const layout = pane.div({class: 'bound-form'});
        const form = layout.form();
        this.identity_fields(form);
        this.choice_fields(form);
        this.flags_and_actions(form);
        this.data_record(layout);
    }

    identity_fields(form) {
        const identity = form.fieldset({class: 'form-grid'});
        identity.legend('Identity');
        this.field(identity, 'Name', 'name', 'text', {required: true});
        this.field(identity, 'Email', 'email', 'email', {placeholder: 'name@example.org'});
        this.field(identity, 'Search', 'search', 'search', {placeholder: 'Find a topic'});
        this.field(identity, 'Website', 'website', 'url', {placeholder: 'https://example.org'});
        this.field(identity, 'Telephone', 'telephone', 'tel', {placeholder: '+1 555 0100'});
        this.field(identity, 'Password', 'password', 'password', {minlength: 8});

    }

    choice_fields(form) {
        const choices = form.fieldset({class: 'form-grid'});
        choices.legend('Choices and ranges');
        this.field(choices, 'Quantity', 'quantity', 'number', {min: 1, max: 20});
        for (const kind of ['date', 'time', 'month', 'week']) {
            this.field(choices, kind[0].toUpperCase() + kind.slice(1), kind, kind);
        }
        this.field(choices, 'Accent', 'accent', 'color');
        this.field(choices, 'Intensity', 'intensity', 'range', {min: 0, max: 100, step: 5, live: true});
        choices.html_label('Region', {for: 'region'});
        const select = choices.select({id: 'region', name: 'region', value: '^.region'});
        for (const value of ['North', 'South', 'West']) select.option(value, {value: value.toLowerCase()});
        choices.html_label('Topics (multiple)', {for: 'topics'});
        const topics = choices.select({id: 'topics', name: 'topics', multiple: true, size: 3, value: '^.topics'});
        for (const topic of ['HTML', 'SVG', 'Source']) topics.option(topic, {value: topic.toLowerCase()});
        choices.html_label('Note', {for: 'note'});
        choices.textarea({id: 'note', name: 'note', rows: 3, value: '^.note'});

    }

    flags_and_actions(form) {
        const options = form.fieldset({class: 'form-options'});
        options.legend('Flags and states');
        options.html_label('Receive updates', {for: 'updates'});
        options.input({type: 'checkbox', id: 'updates', name: 'updates', value: '^.updates'});
        for (const value of ['daily', 'weekly']) {
            options.html_label(value[0].toUpperCase() + value.slice(1), {for: value});
            options.input({type: 'radio', id: value, group: 'frequency', value: `^.frequency.${value}`});
        }
        options.html_label('Read-only code', {for: 'code'});
        options.input({type: 'text', id: 'code', value: 'DEMO-01', readonly: true});
        options.html_label('Unavailable choice', {for: 'unavailable'});
        options.input({type: 'text', id: 'unavailable', value: 'Disabled', disabled: true});
        options.html_label('Attachment', {for: 'attachment'});
        options.input({type: 'file', id: 'attachment', name: 'attachment'});
        form.html_button('Submit unavailable', {type: 'submit', disabled: true});

    }

    data_record(layout) {
        const record = layout.aside({class: 'card stack'});
        record.h2('The Data record');
        const facts = record.dl();
        for (const key of SHOWN) {
            facts.dt(key);
            facts.dd(`^.${key}`, {id: `out-${key}`});
        }
        facts.dt('frequency.weekly');
        facts.dd('^.frequency.weekly', {id: 'out-weekly'});

    }

    field(parent, label, key, kind, attrs = {}) {
        parent.html_label(label, {for: key});
        parent.input({type: kind, id: key, name: key, value: `^.${key}`, ...attrs});
    }
}
