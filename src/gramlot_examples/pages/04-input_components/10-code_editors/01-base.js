import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = "CodeMirror";
    static css = ['/themes/gramlot-base/theme.css'];
    main(root) {
        const pane = root.main({class:'example-page stack', datapath:'editorDemo', padding:'24px'});
        pane.h1("CodeMirror");
        pane.p('Edit the draft: Data updates immediately. Ctrl/Cmd+F opens search; Escape then Tab leaves the editor. Save or Ctrl/Cmd+S copies the draft to the snapshot below.');
        const snippets = {
    "python": "def greet(name):\n    \"\"\"Return a greeting.\"\"\"\n    return f\"Hello, {name}!\"\n\nprint(greet(\"Gramlot\"))\n",
    "javascript": "function greet(name) {\n    return `Hello, ${name}!`;\n}\n\nconsole.log(greet(\"Gramlot\"));\n",
    "typescript": "interface User {\n    name: string;\n    active: boolean;\n}\n\nconst user: User = {name: \"Gramlot\", active: true};\nconsole.log(`Hello, ${user.name}!`);\n",
    "json": "{\n    \"project\": \"Gramlot\",\n    \"enabled\": true,\n    \"languages\": [\"Python\", \"JavaScript\"],\n    \"indentation\": 4\n}\n",
    "html": "<!doctype html>\n<html lang=\"en\">\n    <head><title>Hello Gramlot</title></head>\n    <body>\n        <h1>Hello, Gramlot!</h1>\n        <p>A small HTML document.</p>\n    </body>\n</html>\n",
    "css": ".greeting {\n    display: grid;\n    gap: 1rem;\n    color: #3467ab;\n    padding: 16px;\n}\n\n.greeting:hover {\n    color: #7544aa;\n}\n",
    "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<catalog>\n    <book id=\"guide\">\n        <title>Gramlot guide</title>\n        <available>true</available>\n    </book>\n</catalog>\n",
    "markdown": "# Hello, Gramlot!\n\nAn editor for **code** and *documents*.\n\n- Live Data binding\n- Configurable indentation\n- Search and replace\n\n```python\nprint(\"Hello!\")\n```\n",
    "sql": "SELECT name, COUNT(*) AS total\nFROM documents\nWHERE status = 'published'\nGROUP BY name\nORDER BY total DESC;\n",
    "text": "Hello, Gramlot!\n\nThis is plain text.\nNo programming-language highlighting is applied.\n"
};
        for (const [language, snippet] of Object.entries(snippets)) pane.dataSetter({destination_path:`.snippets.${language}`, value:snippet});
        pane.dataSetter({destination_path:".document.source", value:"def greet(name):\n    \"\"\"Return a greeting.\"\"\"\n    return f\"Hello, {name}!\"\n\nprint(greet(\"Gramlot\"))\n"});
        pane.dataSetter({destination_path:".document.readonly", value:false});
        pane.dataSetter({destination_path:".document.disabled", value:false});
        pane.dataSetter({destination_path:".document.saved", value:""});
        pane.dataSetter({destination_path:".document.settings.language", value:"python"});
        pane.p("Choose a language to load its sample and switch syntax highlighting. Changing language replaces the current draft.");
        pane.filteringSelect({value:"^.document.settings.language", values:"python:Python,javascript:JavaScript,typescript:TypeScript,json:JSON,html:HTML,css:CSS,xml:XML,markdown:Markdown,sql:SQL,text:Plain text", lbl:"Language and sample", validate_notnull:true, id:"sample-language"});
        pane.checkbox({value:'^.document.readonly', label:'Read only'});
        pane.checkbox({value:'^.document.disabled', label:'Disabled'});
        pane.div({datapath:'.document'}).codeMirror({height:'340px', value:'^.source', language:'^.settings.language', id:'demo-editor', readonly:'^.readonly', disabled:'^.disabled', selfsubscribe_save:"this.SET('.saved', p_0.value)"});
        pane.dataController({script:"this.SET('.document.source', snippets.getItem(language))", language:"^.document.settings.language", snippets:"=.snippets"});
        pane.button('Save snapshot', {id:'save-snapshot', action:"this.SET('.document.saved', this.GET('.document.source'))"});
        pane.h3('Live Data'); pane.pre('^.document.source', {id:'live-draft'});
        pane.h3('Saved snapshot'); pane.pre('^.document.saved', {id:'saved-snapshot'});
    }
}
export class Logic {}
