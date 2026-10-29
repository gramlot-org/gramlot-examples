import {Page as BasePage} from '@gramlot/gramlot/page';
import grouplets from '../../gallery/dist/grouplets/descriptor.js';
import inputs from '../../gallery/dist/inputs/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';
const CUSTOMER_GUIDE = "### Who should receive order updates?\n\nUse the **customer name** for the organisation placing the order. The delivery recipient may be different.\n\n1. Enter a named **contact person** who can approve changes.\n2. Use an **email** monitored by the purchasing team.\n3. Enter a **phone number** with its country prefix, so the carrier can call from another region.\n\n### Before marking Reviewed\n\nRead the name, email and phone back to your contact. A review mark is a local checklist; it does not send a message or save the order.\n\nYou can fold the card after reviewing it and still reopen this guide from its header.";
const ADDRESS_GUIDE = "### Describe the entrance the driver should use\n\n- **Recipient:** the receiving team or named person, not necessarily the billing customer.\n- **Street and number:** the actual delivery entrance. Include a unit number when needed.\n- **City, postal code and country:** complete all three so the carrier can distinguish similar addresses.\n- **Access reference:** a gate, reception desk or loading-bay reference that will still make sense on delivery day.\n\n### Example\n\nFor a workshop with a separate goods entrance, use `Gate B \u00b7 Goods in` as the access reference and put unloading restrictions in the Delivery plan card.\n\nChanging the delivery address does not change the invoice address. Folding this card retains your draft.";
export class Page extends BasePage {
    static title = 'Customer handover: guides beside the fields';
    static gramlots = [grouplets, inputs, layout];
    main(root) {
        const main = root.main({class:'grouplet-demo',datapath:'order'});
        main.p('CUSTOMER HANDOVER · ORDER SO-1042',{class:'eyebrow'});
        main.h1('Prepare a delivery with guidance at the point of entry');
        main.p("A new operator is taking over North Workshop's order for twelve lights. Each information button explains the fields in that card. The delivery guide also names the current customer, destination and contact.",{class:'demo-intro'});
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
        main.div('Try it: open the customer guide, review the contact fields, then open the delivery guide. Change the contact or destination city: the guide follows the draft. Fold Delivery plan and open its guide again. Open the nested address guide for field-by-field instructions. Hide and restore the delivery guide, then reload: edits and review/fold states remain.',{class:'demo-task'});
        main.p('Guides are read-only Markdown supplied by this page. The example does not provide a shared document archive, edit notes or save customer records.',{class:'demo-caption'});
    }
    guided_cards(root,{revision}) {
        root.p(`Guided cards loaded · revision ${revision}`,{id:'guide-revision',class:'demo-caption'});
        const customer=root.groupletCard({id:'guide-customer',datapath:'.customer',title:'^.name',doc:CUSTOMER_GUIDE,collapsible:true,collapsed:'^.ui.closed',checkbox:'^.ui.checked',checkboxLabel:'Reviewed'});
        const fields=customer.formlet({col_min_width:'22rem'});
        for(const [name,label] of [['name','Customer name'],['contact','Contact person'],['email','Email'],['phone','Phone']]) fields.textbox({value:`^.${name}`,lbl:label,live:true,id:`guide-customer-${name}`});
        root.groupletCard({id:'guide-delivery',datapath:'.shipping',title:'Delivery plan',doc:'^.guide',collapsible:true,collapsed:'^.ui.closed',checkbox:'^.ui.checked',checkboxLabel:'Reviewed',remote:'guided_delivery',class:'order-section'});
    }
    guided_delivery(root) {
        const fields=root.formlet({col_min_width:'22rem'});
        fields.textbox({value:'^.window',lbl:'Delivery window',live:true,id:'guide-window'});
        fields.textbox({value:'^.instructions',lbl:'Unloading instructions',live:true,id:'guide-instructions'});
        root.groupletCard({id:'guide-address',datapath:'.address',title:'Workshop address',doc:ADDRESS_GUIDE,chromeSide:'left',collapsible:true,collapsed:'^.ui.closed',remote:'guided_address',class:'order-section'});
    }
    guided_address(root) {
        const fields=root.formlet({col_min_width:'15rem'});
        for(const [name,label] of [['recipient','Recipient'],['street','Street and number'],['city','City'],['zip','Postal code'],['country','Country'],['reference','Access reference']]) fields.textbox({value:`^.${name}`,lbl:label,live:true,id:`guide-address-${name}`});
    }
}
Page.registerSource('guided_cards');
Page.registerSource('guided_delivery');
Page.registerSource('guided_address');
