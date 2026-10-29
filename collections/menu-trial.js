import {defineCollection} from '@gramlot/gramlot/components';

// These example-owned SVGs work in popup rows, toolbars and overflow menus.
const icon = path => 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7c899c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`);

export default defineCollection({name:'menu-trial', components:[], registerCommands(gramlot) {
    const commands = gramlot.commands.registerGroup('documenti', {author:'Gramlot examples'});
    for (const [name, label, drawing] of [
        ['save', 'Save', 'M5 3h12l4 4v14H3V3h2ZM7 3v6h9V3M7 21v-8h10v8'],
        ['undo', 'Undo', 'M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6'],
        ['toggleDetails', 'Details', 'M3 4h18v16H3ZM9 4v16M13 9h4M13 15h4'],
        ['export', 'Export', 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5'],
    ]) commands.register(name, {label, iconSrc:icon(drawing), publish:name});
    const grid = gramlot.commands.registerGroup('gridExample', {author:'Gramlot examples'});
    grid.register('updateFirst', {label:'Update first price', iconSrc:icon('M20 7v5h-5M4 17v-5h5M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3a7 7 0 0 0 11.6-1'), publish:'updateFirst'});
    grid.register('removeLast', {label:'Remove last row', iconSrc:icon('M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6'), publish:'removeLast'});
}});
