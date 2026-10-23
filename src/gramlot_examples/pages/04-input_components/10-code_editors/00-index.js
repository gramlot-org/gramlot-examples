import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'Code editors';
    static css = ['/themes/gramlot-base/theme.css'];
    main(root) {
        const pane = root.main({class:'example-page stack',padding:'24px'});
        pane.h1('Code editors');
        pane.p('CodeMirror binds a text document to Data. Try the base control, or open the options composition for a configurable editor with its own drawer.');
    }
}
export class Logic {}
