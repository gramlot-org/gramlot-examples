import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Calculate a room estimate";
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({datapath: 'estimate', class: 'estimate-page'});
        main_content.h1('Plan your stay');
        main_content.p('Choose a room, guests and nights. Follow the calculation below.');
        const fields = main_content.formlet({columns: 1, lbl_position: 'TL', box_c_width: '100%'});
        fields.filteringSelect({value: '^.room', lbl: 'Room', id: 'room',
            values: 'classic:Classic,superior:Superior', validate_notnull: true});
        fields.numberTextBox({value: '^.guests', lbl: 'Guests', id: 'guests', dtype: 'L',
            validate_notnull: true, validate_min: 1, validate_max: 4});
        fields.numberTextBox({value: '^.nights', lbl: 'Nights', id: 'nights', dtype: 'L',
            validate_notnull: true, validate_min: 1, validate_max: 30});
        main_content.dataFormula({result_path: '.rate', formula: "room === 'superior' ? 140 : 90", room: '^.room', _init: true});
        main_content.dataFormula({result_path: '.extra', formula: 'Math.max(guests - 2, 0) * 25', guests: '^.guests', _init: true});
        main_content.dataFormula({result_path: '.nightly', formula: 'rate + extra', rate: '^.rate', extra: '^.extra', _init: true});
        main_content.dataFormula({result_path: '.subtotal', formula: 'nightly * nights', nightly: '^.nightly', nights: '^.nights', _init: true});
        main_content.dataFormula({result_path: '.discount', formula: 'nights >= 7 ? subtotal * 0.10 : 0', nights: '^.nights', subtotal: '^.subtotal', _init: true});
        main_content.dataFormula({result_path: '.total', formula: 'subtotal - discount', subtotal: '^.subtotal', discount: '^.discount', _init: true});
        main_content.dataFormula({result_path: '.deposit', formula: 'Math.round(total * 0.30)', total: '^.total', _init: true});
        const costs = main_content.section({class: 'estimate-costs', aria_label: 'Calculation breakdown'});
        costs.p('^.rate', {mask: 'Room / night · €{}', id: 'rate'});
        costs.p('^.extra', {mask: 'Extra guests / night · €{}', id: 'extra'});
        costs.p('^.nightly', {mask: 'Nightly price · €{}', id: 'nightly'});
        costs.p('^.subtotal', {mask: 'Stay subtotal · €{}', id: 'subtotal'});
        costs.p('^.discount', {mask: 'Long-stay discount · −€{}', id: 'discount'});
        costs.p('^.total', {mask: 'Stay total · €{}', id: 'total'});
        costs.p('^.deposit', {mask: '30% deposit · €{}', id: 'deposit'});
        main_content.button('Prepare summary', {id: 'prepare'}).dataController({
            script: "this.SET('.summary', 'Stay estimate: €' + total)", total: '=.total'});
        main_content.p('^.summary', {id: 'summary', aria_live: 'polite'});
        main_content.p('Two guests included; €25 per extra guest/night. Seven nights: 10% off. Deposit rounded to euros.');
        main_content.p('Invalid drafts do not change accepted Data. Summary updates on click. Illustrative prices only.');
    }
}
