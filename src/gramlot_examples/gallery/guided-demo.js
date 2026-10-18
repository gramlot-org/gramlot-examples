const STEPS = [
    {
        title: 'Meet your workspace',
        text: 'Imagine you are editing a customer. Search is above the form, Filters is on the left, and Output is below. Details is tucked away on the right. Each small handle lets you bring a tool into view or put it away. We will try that together.',
        changes: {
            drawerSearch: true,
            drawerFilters: true,
            drawerDetails: 'close',
            drawerOutput: true,
        },
        seconds: 14,
    },
    {
        title: 'One choice, shown in two places',
        text: 'Look at Filters: Express is now selected. The delivery line in the center also says express. These are two views of the same stored value. Gramlot calls these shared values Data. You do not need to copy the choice from the radio group into the summary.',
        changes: {
            delivery: 'express',
        },
        seconds: 14,
    },
    {
        title: 'Put the filters away',
        text: 'We have closed Filters to give the form more room. Notice that the delivery line still says express. Hiding the panel has not cancelled your choice. A drawer is useful when you need a tool nearby, but do not want it taking up space all the time.',
        changes: {
            drawerFilters: 'close',
        },
        seconds: 14,
    },
    {
        title: 'Bring your choice back',
        text: 'Filters is open again, and Express is still selected. We have also made the panel a little wider. Nothing had to be filled in again. You can pause here and try dragging its thin separator or its handle to choose a comfortable width yourself.',
        changes: {
            drawerFilters: true,
            filtersWidth: '220px',
        },
        seconds: 14,
    },
    {
        title: 'Edit once, see it wherever you need it',
        text: 'Details has opened on the right, and the customer is now Grace Hopper. Look at the name in the center too. Both places are connected to the same customer value. This connection is called a binding: when the value changes, the places reading it update.',
        changes: {
            drawerDetails: true,
            customer: 'Grace Hopper',
        },
        seconds: 14,
    },
    {
        title: 'The customer stays, even when the editor is hidden',
        text: 'Details is closed, but the center still shows Grace Hopper. We have hidden the place where you edit the customer, not removed the customer. You can open Details again whenever you need it; its field will still have that name.',
        changes: {
            drawerDetails: 'close',
        },
        seconds: 14,
    },
    {
        title: 'Change something while its summary is hidden',
        text: 'We have closed Output and changed the note in the center. Read the field: it now says Written while Output was closed. Can a panel that was hidden keep up with that change? In the next step we will open it and see.',
        changes: {
            drawerOutput: 'close',
            note: 'Written while Output was closed',
        },
        seconds: 14,
    },
    {
        title: 'Your work is still here',
        text: 'Output is back, and it shows the new note. That is the main idea: drawers let you rearrange what you see while your work stays in place. Try it yourself now. Change the note, leave its field, close Output, and open it again. There is no extra save or copy step in this example.',
        changes: {
            drawerOutput: true,
        },
        seconds: 14,
    },
];

export function guidedDemo(parent) {
    for (const [name, value] of Object.entries({
        steps: STEPS,
        status: 'ready',
        position: -1,
        executed: -1,
        count: STEPS.length,
        progress: `Ready · ${STEPS.length} steps`,
        title: 'Let’s explore drawers together',
        text: 'Press Start to watch the workspace change, or Next to take one step at a time. You can pause and try the handles yourself whenever you like.',
        voice: false,
        rate: '1',
        voiceAvailable: false,
        voiceMessage: '',
        available: false,
    })) {
        parent.dataSetter({ destination_path: `galleryGuide.${name}`, value: value });
    }
    const panel = parent.contentPane({
        region: 'bottom',
        height: '190px',
        minSize: 140,
        maxSize: 300,
        splitter: true,
        drawer: true,
        drawer_label: 'Guide',
        drawer_icon: '▶',
        node_id: 'galleryGuidePanel',
        id: 'gallery-guide',
        class: 'gallery-guide',
        padding: '12px 16px',
        border_top: '1px solid var(--gramlot-border)',
        background: 'var(--gramlot-surface-subtle)',
    });
    const toolbar = panel.div({ class: 'gallery-guide-toolbar' });
    for (const [name, caption, disabled] of [
        ['Play', '▶ Start / Resume', "^galleryGuide.status:= {} === 'running' || !{available}"],
        ['Pause', 'Ⅱ Pause', "^galleryGuide.status:= {} !== 'running'"],
        ['Stop', '■ Stop', "^galleryGuide.status:= !['running','paused'].includes({})"],
        ['Previous', '← Back', '^galleryGuide.position:= {} <= 0'],
        ['Next', 'Next →', '^galleryGuide.position:= {} >= {count} - 1 || !{available}'],
    ]) {
        toolbar.button(caption, {
            node_id: `galleryGuide${name}`,
            id: `gallery-guide-${name.toLowerCase()}`,
            action: "this.publish('command')",
            disabled: disabled,
            available: '^galleryGuide.available',
            count: '^galleryGuide.count',
        });
    }
    toolbar.checkbox({
        value: '^galleryGuide.voice',
        label: 'Voice',
        id: 'gallery-guide-voice',
        disabled: '^galleryGuide.voiceAvailable:=!{}',
    });
    const speed = toolbar.select({
        value: '^galleryGuide.rate',
        aria_label: 'Narration speed',
        id: 'gallery-guide-rate',
        width: '5em',
    });
    for (const [value, caption] of [
        ['0.8', '0.8×'],
        ['1', '1×'],
        ['1.2', '1.2×'],
    ]) {
        speed.option(caption, { value: value });
    }
    toolbar.span('^galleryGuide.progress', { id: 'gallery-guide-progress', role: 'status' });
    panel.strong('^galleryGuide.title', { id: 'gallery-guide-title' });
    panel.p('^galleryGuide.text', { id: 'gallery-guide-text', aria_live: 'polite' });
    panel.p('^galleryGuide.voiceMessage', { id: 'gallery-guide-voice-message', role: 'status' });
    panel.small(
        'The tour changes delivery, customer and note. Stop keeps the current values. Back reviews the explanation only.',
    );
}
