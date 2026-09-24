import {Marked} from 'marked';
import createDOMPurify from 'dompurify';

const markdown = new Marked({async: false});

/** Render only the runner's README text as sanitized HTML. */
export function renderReadme(element) {
    const purifier = createDOMPurify(element.ownerDocument.defaultView);
    element.innerHTML = purifier.sanitize(markdown.parse(element.textContent), {USE_PROFILES: {html: true}});
}
