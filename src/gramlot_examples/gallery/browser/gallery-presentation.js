import {appearanceStyles, paletteStyles} from '../dist/theme-styles.js';
import {THEME_READY, THEME_SET, THEMES, APPEARANCES} from '@gramlot/gramlot/index-page-runtime';

/** Gallery preferences; shared layout components own drawers and splitters. */
export function mountGalleryPresentation(renderer, root, state) {
    const document = renderer.destination.ownerDocument, window = document.defaultView;
    const byId = id => document.getElementById(id);
    const narrow = () => window.getComputedStyle(renderer.records.get(root).element).getPropertyValue('--gallery-narrow').trim() === '1';
    const set = (element, attrs) => renderer.elements.get(element).node.setAttr(attrs);
    const key = `gramlot.gallery.preferences:${window.location.pathname}`;
    let saved = {}, entries = new Map(), active = null, disposed = false;
    try { saved = JSON.parse(window.localStorage.getItem(key) || '{}'); }
    catch (error) { if (!['SecurityError','SyntaxError'].includes(error.name)) throw error; }
    if (saved === null || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
    state.setItem('theme', THEMES.has(saved.theme) ? saved.theme : 'light');
    state.setItem('appearance', APPEARANCES.has(saved.appearance) ? saved.appearance : 'compact');
    state.setItem('palette', typeof saved.palette === 'string' && Object.hasOwn(paletteStyles, saved.palette) ? saved.palette : 'default');
    state.setItem('keyboard', false);
    state.setItem('navigationVisible', saved.navigationVisible !== false);
    state.setItem('codeVisible', saved.codeVisible !== false);
    const style = root.builder.wrapSource(root).style(appearanceStyles[state.getItem('appearance')]);
    const releases = [];
    const listen = (element, type, fn) => { element.addEventListener(type, fn); releases.push(() => element.removeEventListener(type, fn)); };
    const save = () => {
        try { window.localStorage.setItem(key, JSON.stringify({theme:state.getItem('theme'), appearance:state.getItem('appearance'), palette:state.getItem('palette'),
            navigationVisible:state.getItem('navigationVisible'), codeVisible:state.getItem('codeVisible')})); }
        catch (error) { if (!['SecurityError','QuotaExceededError'].includes(error.name)) throw error; }
    };
    const send = frame => frame.contentWindow.postMessage({type:THEME_SET, theme:state.getItem('theme'), appearance:state.getItem('appearance'), palette:state.getItem('palette')}, '*');
    const apply = () => {
        document.documentElement.setAttribute('data-theme', state.getItem('theme'));
        style.setValue(appearanceStyles[state.getItem('appearance')] + '\n' + paletteStyles[state.getItem('palette')]);
        for (const entry of entries.values()) if (entry.frame) send(entry.frame);
    };
    for (const [id, property] of [['index-theme','theme'],['index-appearance','appearance'],['index-palette','palette']]) {
        const control = byId(id); set(control,{value:state.getItem(property)});
        listen(control, 'change', () => { state.setItem(property, control.value); set(control,{value:control.value}); apply(); save(); });
    }
    listen(byId('keyboard-navigation'), 'change', () => state.setItem('keyboard', byId('keyboard-navigation').checked));
    listen(window,'message',event => { if (event.data?.type === THEME_READY) {
        const frame = [...entries.values()].find(entry => entry.frame?.contentWindow === event.source)?.frame;
        if (frame) send(frame);
    }});
    const gramlot = renderer.binding.gramlot;
    for (const [id,property] of [['index-sidebar','navigationVisible'],['index-code','codeVisible']]) {
        const pane = byId(id), source = renderer.elements.get(pane).node;
        set(pane,{drawer:state.getItem(property) ? true : 'close'});
        const handle = gramlot.subscribe(`${source.getAttr('nodeId')}_closable_change`, ({open}) => {
            if (source.getAttr('hidden') || narrow()) return;
            state.setItem(property,open); set(pane,{drawer:open ? true : 'close'}); save();
        });
        releases.push(() => gramlot.unsubscribe(handle));
    }
    let installPrompt = null;
    const install = byId('index-install-button'), status = byId('index-install-status');
    listen(window,'beforeinstallprompt', event => {event.preventDefault(); installPrompt=event; set(install,{hidden:false});});
    listen(install,'click',async () => {
        if (!installPrompt) return;
        const prompt=installPrompt; installPrompt=null; set(install,{disabled:true});
        try {await prompt.prompt(); const {outcome}=await prompt.userChoice;
            if (!disposed) renderer.elements.get(status).node.setValue(outcome === 'accepted' ? 'App installed.' : 'Installation cancelled.');
        } finally {if (!disposed) set(install,{hidden:true});}
    });
    const update = (nextEntries,nextActive) => {
        entries=nextEntries; active=nextActive;
        for (const [url,entry] of entries) if (entry.code) set(entry.code,{hidden:url !== active});
        set(byId('index-code'), {hidden:!entries.get(active)?.code});
        if (!narrow()) set(byId('index-code'), {drawer:state.getItem('codeVisible') ? true : 'close'});
        apply();
    };
    const dispose = () => {if(disposed)return;disposed=true;for(const release of releases)release();};
    renderer.onDispose(root,dispose);apply();
    return {update,dispose};
}
