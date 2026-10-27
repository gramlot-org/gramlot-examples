/** A gallery lesson drives Data, never synthetic clicks or recorded publish traffic. */
export class GuidedDemo {
    constructor(data, window) {
        this.data = data;
        this.window = window;
        this.generation = 0;
        this.timer = null;
        this.utterance = null;
        this.target = null;
    }
    get(name) { return this.data.getItem(`galleryGuide.${name}`); }
    set(name, value) { this.data.setItem(`galleryGuide.${name}`, value); }
    cancel() {
        ++this.generation;
        this.window.clearTimeout(this.timer);
        this.timer = null;
        if (this.utterance) {
            this.utterance.onend = this.utterance.onerror = null;
            this.utterance = null;
            this.window.speechSynthesis.cancel();
        }
    }
    show(index) {
        const step = this.get('steps')[index];
        this.set('position', index);
        this.set('title', step.title);
        this.set('text', step.text);
        this.set('progress', `${index + 1} / ${this.get('count')}`);
        return step;
    }
    apply(index) {
        this.cancel();
        const step = this.show(index);
        for (const [path, value] of Object.entries(step.changes)) this.target.setItem(path, value);
        this.set('executed', index);
        if (this.get('status') === 'running') this.narrate(step);
    }
    play() {
        if (!this.get('available') || this.get('status') === 'running') return;
        const resume = this.get('status') === 'paused' && this.get('position') >= 0;
        this.set('status', 'running');
        if (resume) this.narrate(this.get('steps')[this.get('position')]);
        else { this.set('executed', -1); this.apply(0); }
    }
    pause() {
        if (this.get('status') !== 'running') return;
        this.cancel(); this.set('status', 'paused');
    }
    stop() { this.cancel(); this.set('status', 'stopped'); }
    next() {
        if (!this.get('available')) return;
        const next = this.get('position') + 1;
        if (next >= this.get('count')) return;
        this.pause(); this.set('status', 'paused');
        if (next <= this.get('executed')) this.show(next);
        else this.apply(next);
    }
    previous() {
        if (this.get('position') <= 0) return;
        this.pause(); this.cancel(); this.set('status', 'paused');
        // Reviewing an explanation is deliberately not an application undo.
        this.show(this.get('position') - 1);
    }
    narrate(step) {
        this.cancel();
        const generation = this.generation;
        const observe = () => {
            if (generation !== this.generation) return;
            this.utterance = null;
            this.timer = this.window.setTimeout(() => {
                this.timer = null;
                const next = this.get('executed') + 1;
                if (next < this.get('count')) this.apply(next);
                else { this.set('status', 'finished'); this.set('progress', 'Tour complete'); }
            }, step.seconds * 1000);
        };
        if (!this.get('voice') || !this.get('voiceAvailable')) { observe(); return; }
        const utterance = new this.window.SpeechSynthesisUtterance(step.text);
        utterance.lang = 'en-US';
        utterance.voice = this.window.speechSynthesis.getVoices().find(voice => /^en(?:-|$)/i.test(voice.lang));
        utterance.rate = Number(this.get('rate'));
        utterance.onend = observe;
        utterance.onerror = () => {
            if (generation !== this.generation) return;
            this.set('voiceMessage', 'Voice unavailable. The tour continues with captions.');
            observe();
        };
        this.utterance = utterance;
        try { this.window.speechSynthesis.speak(utterance); }
        catch { utterance.onerror(); }
    }
    voiceChanged() {
        if (this.get('status') === 'running') this.narrate(this.get('steps')[this.get('position')]);
    }
}

export function mountGuidedDemo(renderer, root) {
    const window = renderer.destination.ownerDocument.defaultView;
    const document = window.document;
    if (!document.getElementById('gallery-guide')) return {update() {}, pause() {}, dispose() {}};
    const runtime = renderer.binding.gramlot;
    const data = root.builder.data;
    const player = new GuidedDemo(data, window);
    let frame = null;
    let active = false;
    let disposed = false;
    const registrations = ['Play', 'Pause', 'Stop', 'Previous', 'Next'].map(name =>
        runtime.subscribe(`galleryGuide${name}_command`, () => player[name.toLowerCase()]()));
    registrations.push(runtime.subscribe('galleryGuidePreview_selected', event => {
        if (event.page === 'example' && !event.selected) player.pause();
    }));
    registrations.push(runtime.subscribe('galleryGuidePanel_closable_change', event => {
        if (!event.open) player.pause();
    }));
    const voices = () => {
        const available = Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance &&
            window.speechSynthesis.getVoices().some(voice => /^en(?:-|$)/i.test(voice.lang)));
        player.set('voiceAvailable', available);
        player.set('voiceMessage', available ? '' : 'No English voice available on this browser. Captions remain available.');
    };
    window.speechSynthesis?.addEventListener('voiceschanged', voices);
    voices();
    const hidden = () => { if (document.hidden) player.pause(); };
    document.addEventListener('visibilitychange', hidden);
    const loaded = () => { player.stop(); player.target = null; player.set('available', false); };
    data.subscribe('gallery-guide', {any: event => {
        if (['galleryGuide.voice', 'galleryGuide.rate'].includes(event.pathlist.join('.'))) player.voiceChanged();
    }});
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        player.cancel();
        for (const registration of registrations) runtime.unsubscribe(registration);
        data.unsubscribe('gallery-guide', {any: true});
        frame?.removeEventListener('load', loaded);
        document.removeEventListener('visibilitychange', hidden);
        window.speechSynthesis?.removeEventListener('voiceschanged', voices);
    };
    renderer.onDispose(root, dispose);
    return {
        update(entries, selected) {
            const entry = [...entries.values()].find(item => item.node.attr.key === 'l04');
            const nextFrame = entry?.frame;
            if (nextFrame !== frame) {
                frame?.removeEventListener('load', loaded);
                frame = nextFrame;
                frame?.addEventListener('load', loaded);
            }
            active = entry !== undefined && selected === entry.url;
            if (!active) player.pause();
            const example = frame?.contentWindow.gramlot;
            player.target = example?.state === 'started' ? example.data : null;
            player.set('available', active && player.target !== null);
        }, pause() { player.pause(); }, dispose,
    };
}
