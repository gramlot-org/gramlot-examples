import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'Customer handover: guides beside the fields';
    main(root) {
        const main = root.main({class:'grouplet-demo',datapath:'order'});
        main.dataFormula({result_path:'.shipping.guide',formula:"enabled ? '### Delivery for ' + customer + '\\n\\n**Current destination:** ' + (city || 'enter a city') + ', ' + (country || 'enter a country') + '.\\n\\n**Contact to confirm access:** ' + (contact || 'enter a contact') + '.\\n\\n### Before booking the carrier\\n\\n1. Agree a delivery window with the receiving team.\\n2. Check that the selected entrance is open during that window.\\n3. Describe unloading restrictions and who the driver should call.\\n\\nThe address card has a separate guide for the destination fields. These instructions follow the current draft, even while the card is folded.' : ''",enabled:'^.showGuide',customer:'^.customer.name',city:'^.shipping.address.city',country:'^.shipping.address.country',contact:'^.customer.contact',_init:true});
        const bar=main.div({class:'demo-toolbar'});
        bar.button('Reload guided cards',{id:'guide-reload',action:"this.SET('.revision', this.GET('.revision') + 1)"});
        bar.checkbox({value:'^.showGuide',lbl:'Show delivery guide',lbl_position:'R',id:'guide-visible'});
        main.grouplet({remote:'guided_cards',remote_revision:'^.revision'});
        const summary=main.section({class:'demo-panel demo-summary'});
        summary.h2('Handover summary');
        summary.strong('^.customer.name',{id:'guide-customer-summary'});
        summary.p('^.customer.contact',{id:'guide-contact-summary'});
        summary.p('^.customer.email'); summary.p('^.shipping.address.recipient'); summary.p('^.shipping.address.street');
        summary.p('^.shipping.address.city',{id:'guide-city-summary'});
        summary.p('^.shipping.window'); summary.p('^.shipping.instructions');
    }
    guided_cards(root,{revision}) {
        root.p(`Guided cards loaded · revision ${revision}`,{id:'guide-revision',class:'demo-caption'});
        const customer=root.groupletCard({id:'guide-customer',datapath:'.customer',title:'^.name',doc:'^.guide',collapsible:true,collapsed:'^.ui.closed',checkbox:'^.ui.checked',checkboxLabel:'Reviewed'});
        const fields=customer.formlet({col_min_width:'22rem'});
        for(const [name,label] of [['name','Customer name'],['contact','Contact person'],['email','Email'],['phone','Phone']]) fields.textbox({value:`^.${name}`,lbl:label,live:true,id:`guide-customer-${name}`});
        root.groupletCard({id:'guide-delivery',datapath:'.shipping',title:'Delivery plan',doc:'^.guide',collapsible:true,collapsed:'^.ui.closed',checkbox:'^.ui.checked',checkboxLabel:'Reviewed',remote:'guided_delivery',class:'order-section'});
    }
    guided_delivery(root) {
        const fields=root.formlet({col_min_width:'22rem'});
        fields.textbox({value:'^.window',lbl:'Delivery window',live:true,id:'guide-window'});
        fields.textbox({value:'^.instructions',lbl:'Unloading instructions',live:true,id:'guide-instructions'});
        root.groupletCard({id:'guide-address',datapath:'.address',title:'Workshop address',doc:'^.guide',chromeSide:'left',collapsible:true,collapsed:'^.ui.closed',remote:'guided_address',class:'order-section'});
    }
    guided_address(root) {
        const fields=root.formlet({col_min_width:'15rem'});
        for(const [name,label] of [['recipient','Recipient'],['street','Street and number'],['city','City'],['zip','Postal code'],['country','Country'],['reference','Access reference']]) fields.textbox({value:`^.${name}`,lbl:label,live:true,id:`guide-address-${name}`});
    }
}
Page.registerSource('guided_cards');
Page.registerSource('guided_delivery');
Page.registerSource('guided_address');
