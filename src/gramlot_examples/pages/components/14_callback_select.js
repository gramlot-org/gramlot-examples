import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Callback select";
    static css = ["/themes/gramlot-base/theme.css"];
    main(root) {
        const pane = root.main({class:"example-page stack"});
        pane.h1("Callback select");
        pane.p("Search 100 random samples generated once in this page. The callback reads a Data Bag, without a server request.");
        const controls = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.callbackSelect({id:"choice",value:"^choice",callback:"searchChoices",lbl:"Sample",readonly:"^locked",box_c_width:"18rem",placeholder:"Try Sample 02 or value 7"});
        fields.callbackSelect({id:"choice-copy",value:"^choice",callback:"searchChoices",lbl:"Same sample",readonly:"^locked",box_c_width:"18rem"});
        pane.p("100 stable codes; random values stay unchanged until the page reloads.");
        pane.dataController({func:"createSamples",_onStart:true});
        pane.p("Selected code:");
        pane.p("^choice",{id:"choice-value"});
        pane.dataSetter({destination_path:"locked",value:false});
    }
}

export class Logic {
    createSamples(node) {
        for (let i = 1; i <= 100; i++) {
            const number = String(i).padStart(3, '0');
            const id = `item_${number}`;
            const value = Math.floor(Math.random() * 100);
            node.SET(`samples.${id}.id`, id);
            node.SET(`samples.${id}.name`, `Sample ${number} — value ${value}`);
        }
        node.SET('choice', 'item_001');
    }
    searchChoices(node, kw) {
        const rows = node.GET('samples').getNodes().map(item => ({
            id: item.getValue().getItem('id'),
            name: item.getValue().getItem('name')
        }));
        return {
            rows: rows.filter(row => kw._id != null ? row.id === kw._id
                : row.name.toLocaleLowerCase().includes(kw._querystring.toLocaleLowerCase())),
            identifier: 'id', caption: 'name'
        };
    }
}
