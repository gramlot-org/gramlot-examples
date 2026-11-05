import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class:'example-page stack'});
        const group = main_content.groupBox({id:'validation-group',datapath:'profile',copy:true,lbl:'Profile · field validations',max_width:'64rem'});
        const variants = group.div({id:'validation-fields',class:'grid',grid_template_columns:'repeat(auto-fit, minmax(min(100%, 24rem), 1fr))'});
        this.required(variants);
        this.conditional(variants);
        this.normalized(variants);
        this.callbacks(variants);
        this.accepted_values(main_content);
    }
    accepted_values(main_content) {
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
    required(parent) {
        const fields = parent.groupBox({lbl:'Required and ranges'}).formlet({lbl_position:'TL',box_c_width:'100%'});
        fields.textbox({id:'full-name',value:'^.full_name',lbl:'Name (2–30)',validate_notnull:true,validate_len:'2:30',validate_notnull_error:'Please enter a name.',validate_len_error:'Use 2–30 characters.'});
        fields.numberTextBox({id:'quantity',value:'^.quantity',lbl:'Quantity: 0–10',validate_min:0,validate_max:10});
        fields.dateTextBox({id:'appointment',value:'^.appointment',lbl:'Appointment',format:'short',validate_notnull:true,validate_notnull_error:'Choose a date or type a date expression.'});
        fields.filteringSelect({id:'delivery',value:'^.delivery',lbl:'Delivery',values:'standard:Standard,express:Express,pickup:Pick up',validate_notnull:true,validate_notnull_error:'Choose a delivery option.'});
        fields.textBoxArea({id:'notes',value:'^.notes',lbl:'Notes (max 40)',rows:2,validate_len:':40',validate_len_error:'Use at most 40 characters.'});
    }
    normalized(parent) {
        const fields = parent.groupBox({lbl:'Normalization'}).formlet({lbl_position:'TL',box_c_width:'100%'});
        fields.textbox({id:'code',value:'^.code',lbl:'Code (2–6 letters)',validate_case:'upper',validate_regex:'(?:^[A-Z]{2,6}$)',validate_regex_error:'Use 2–6 letters.'});
        fields.textbox({id:'fallback',value:'^.fallback',lbl:'Empty becomes Guest',validate_empty:'Guest'});
    }
    conditional(parent) {
        const fields = parent.groupBox({lbl:'Warnings and conditions'}).formlet({lbl_position:'TL',box_c_width:'100%'});
        fields.checkbox({default: false, id:'strict',value:'^.strict',lbl:'Email',label:'Make the warning blocking'});
        fields.textbox({id:'email',value:'^.email',lbl:'Email format',validate_email:true,validate_email_iswarning:'^.strict:=!{}'});
        fields.checkbox({default: false, value:'^.check_length',lbl:'Length',label:'Require at least four characters'});
        fields.textbox({id:'conditional',value:'^.conditional',lbl:'Conditional length',validate_len:'4:',validate_len_if:'enabled',validate_enabled:'^.check_length'});
    }
    callbacks(parent) {
        const fields = parent.groupBox({lbl:'Callbacks and remote'}).formlet({lbl_position:'TL',box_c_width:'100%'});
        fields.textbox({id:'nickname',value:'^.nickname',lbl:'Nickname',validate_call:'checkNickname',validate_onAccept:'accepted',validate_onReject:'rejected'});
        fields.textbox({id:'remote-name',value:'^.remote_name',lbl:'Remote name',validate_remote:'check_name',validate_timeout:5000});
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
