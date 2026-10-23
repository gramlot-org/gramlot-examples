import {defineCollection} from '@gramlot/gramlot/components';
export default defineCollection({name:'menu-trial',components:[],registerCommands(gramlot){
    const commands=gramlot.commands.registerGroup('documenti',{author:'Gramlot examples'});
    commands.register('save',{label:'Save',icon:'💾',publish:'save'});
    commands.register('undo',{label:'Undo',icon:'↶',publish:'undo'});
    commands.register('toggleDetails',{label:'Details',icon:'☰',publish:'toggleDetails'});
    commands.register('export',{label:'Export',icon:'↓',publish:'export'});
}});
