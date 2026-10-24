import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = "Validation rules, warnings and callbacks";
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class:'example-page stack'});
        main_content.h1('Validation playground');
        main_content.p('Leave a field to validate it. Invalid drafts stay visible; the accepted values below change only after success.');
        const group = main_content.groupBox({id:'validation-group',datapath:'profile',copy:true,lbl:'Profile · field validations',max_width:'36rem'});
        const fields = group.formlet({id:'validation-fields',lbl_position:'L',box_c_width:'100%'});
        fields.textbox({id:'full-name',value:'^.full_name',lbl:'Name (2–30)',validate_notnull:true,validate_len:'2:30',validate_notnull_error:'Please enter a name.',validate_len_error:'Use 2–30 characters.'});
        fields.textbox({id:'code',value:'^.code',lbl:'Code (2–6 letters)',validate_case:'upper',validate_regex:'(?:^[A-Z]{2,6}$)',validate_regex_error:'Use 2–6 letters.'});
        fields.textbox({id:'fallback',value:'^.fallback',lbl:'Empty becomes Guest',validate_empty:'Guest'});
        fields.numberTextBox({id:'quantity',value:'^.quantity',lbl:'Quantity: 0–10',validate_min:0,validate_max:10});
        fields.checkbox({default: false, id:'strict',value:'^.strict',lbl:'Email',label:'Make the warning blocking'});
        fields.textbox({id:'email',value:'^.email',lbl:'Email format',validate_email:true,validate_email_iswarning:'^.strict:=!{}'});
        fields.checkbox({default: false, value:'^.check_length',lbl:'Length',label:'Require at least four characters'});
        fields.textbox({id:'conditional',value:'^.conditional',lbl:'Conditional length',validate_len:'4:',validate_len_if:'enabled',validate_enabled:'^.check_length'});
        fields.textbox({id:'nickname',value:'^.nickname',lbl:'Nickname',validate_call:'checkNickname',validate_onAccept:'accepted',validate_onReject:'rejected'});
        fields.textbox({id:'remote-name',value:'^.remote_name',lbl:'Remote name',validate_remote:'check_name',validate_timeout:5000});
        fields.textBoxArea({id:'notes',value:'^.notes',lbl:'Notes (max 40)',rows:2,validate_len:':40',validate_len_error:'Use at most 40 characters.'});
        fields.dateTextBox({id:'appointment',value:'^.appointment',lbl:'Appointment',format:'short',validate_notnull:true,validate_notnull_error:'Choose a date or type a date expression.'});
        fields.filteringSelect({id:'delivery',value:'^.delivery',lbl:'Delivery',values:'standard:Standard,express:Express,pickup:Pick up',validate_notnull:true,validate_notnull_error:'Choose a delivery option.'});
        group.p('Try an empty name, quantity 11, a malformed email, or a long note. The local callback rejects admin; the asynchronous endpoint rejects taken.');
        const accepted = main_content.details({max_width:'36rem',open:true});
        accepted.summary('Accepted Data · invalid drafts do not overwrite these values');
        const values = accepted.dl();
        for (const [label,path] of [['Name','full_name'],['Code','code'],['Quantity','quantity'],['Email','email'],['Notes','notes'],['Delivery code','delivery'],['Remote name','remote_name']]) {
            values.dt(label);
            values.dd('^profile.'+path, {id: {code:'code-result',email:'email-result',remote_name:'remote-result'}[path]});
        }
        values.dt('Appointment');
        values.dd('^profile.appointment',{format:'short'});
        accepted.p('^profile.validation_status',{id:'validation-status'});
    }
    check_name({value}) {
        return value.toLowerCase() === 'taken' ? {errorcode:'reserved',message:'That name is reserved.'} : {value:value.toUpperCase()};
    }
}
Page.registerEndpoint('check_name');

export class Logic {
    checkNickname(node, {value}) {
        return value.toLowerCase() === 'admin' ? {errorcode:'reserved',message:'Choose a nickname other than admin.'} : true;
    }
    accepted(node, {value}) { node.SET('.validation_status', 'Accepted: ' + value); }
    rejected(node, {result}) { node.SET('.validation_status', 'Rejected: ' + result.error); }
}
