import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);

/** Decorate the runner's static source listing without executing its text. */
export function highlightCode(element) {
    element.innerHTML = hljs.highlightAuto(element.textContent, ['python', 'javascript']).value;
    element.classList.add('hljs');
}
