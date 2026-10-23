import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'Code editors';
    main(root) {
        const main_content = root.main({class:'example-page stack',padding:'24px'});
        main_content.h1('Code editors');
        main_content.p('CodeMirror binds a text document to Data. Try the base control, or open the options composition for a configurable editor with its own drawer.');
    }
}
