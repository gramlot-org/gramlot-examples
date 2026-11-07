import {createDOMPurify, loadMarkdown} from '@gramlot/gramlot';

/**
 * Render the current README, retaining HTML support behind the gallery policy.
 * `base` is the gallery route of the rendered Markdown (`pages/<folder>/<name>`); `lessons` is the
 * `galleryIndex.featureExamples` Bag. With both, a relative link to a lesson's `.md` file becomes
 * that lesson's route: a lesson of the navigation opens in the gallery, another page in a new tab.
 */
export async function renderReadme(element, {base = null, lessons = null} = {}) {
    const text = element.textContent;
    const {default: MarkdownIt} = await loadMarkdown();
    if (!element.isConnected || element.textContent !== text) return;
    const markdown = new MarkdownIt({html:true});
    const purifier = createDOMPurify(element.ownerDocument.defaultView);
    element.innerHTML = purifier.sanitize(markdown.render(text), {USE_PROFILES:{html:true}});
    if (base !== null) linkLessons(element, base, lessons);
}

/** The gallery route of a relative `.md` link written in the Markdown of `base`, or null. */
export function lessonRoute(href, base) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#') || href.startsWith('/')) return null;
    const [path, ...fragment] = href.split('#');
    if (!path.endsWith('.md')) return null;
    // The route of a page is the path of its Markdown without the extension.
    const resolved = new URL(path, `https://gallery.invalid/${base}`).pathname.slice(1, -3);
    const route = resolved.replace(/\/(README|00-index)$/, '/00-index');
    return {route, fragment: fragment.join('#')};
}

function linkLessons(element, base, lessons) {
    const keys = new Map();
    for (const node of lessons?.getNodes() ?? []) keys.set(node.attr.url, node.label);
    for (const anchor of element.querySelectorAll('a[href]')) {
        const target = lessonRoute(anchor.getAttribute('href'), base);
        if (target === null) continue;
        // Relative to the gallery document, which serves every page at its route.
        anchor.setAttribute('href', target.route);
        const key = keys.get(target.route);
        if (key !== undefined) anchor.dataset.galleryLesson = key;
        else Object.assign(anchor, {target: '_blank', rel: 'noopener'});
    }
}
