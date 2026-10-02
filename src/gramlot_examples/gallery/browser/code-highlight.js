import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);

/**
 * Decorate the gallery's static source listing without executing its text: the language comes from
 * the `language-*` class the gallery page writes, and each line is its own span so the stylesheet
 * can number it. The text content stays the file text.
 */
export function highlightCode(element) {
    const text = element.textContent;
    const language = element.classList.contains('language-python') ? 'python' : 'javascript';
    const rows = lines(hljs.highlight(text, {language}).value);
    const closing = text.endsWith('\n') ? rows.pop() + '\n' : '';
    element.innerHTML = rows.map(row => `<span class="code-line">${row}</span>`).join('\n') + closing;
    element.classList.add('hljs');
}

/** Split highlighted HTML into lines, reopening on each line the spans still open at its start. */
function lines(html) {
    const open = [];
    return html.split('\n').map(text => {
        const row = open.join('') + text;
        for (const [tag] of text.matchAll(/<span[^>]*>|<\/span>/g)) {
            if (tag === '</span>') open.pop();
            else open.push(tag);
        }
        return row + '</span>'.repeat(open.length);
    });
}
