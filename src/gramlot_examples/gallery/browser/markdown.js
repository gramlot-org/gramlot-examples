import {createDOMPurify, loadMarkdown} from '@gramlot/gramlot';

/** Render the current README, retaining HTML support behind the gallery policy. */
export async function renderReadme(element) {
    const text = element.textContent;
    const {default: MarkdownIt} = await loadMarkdown();
    if (!element.isConnected || element.textContent !== text) return;
    const markdown = new MarkdownIt({html:true});
    const purifier = createDOMPurify(element.ownerDocument.defaultView);
    element.innerHTML = purifier.sanitize(markdown.render(text), {USE_PROFILES:{html:true}});
}
