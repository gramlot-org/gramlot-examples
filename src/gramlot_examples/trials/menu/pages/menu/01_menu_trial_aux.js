/** Business behavior only: Source messages and Data writes, no DOM/event plumbing. */
export class Logic {
    save(node,message){node.SET('document.result',`Save document ${message.parameters.id}; sender ${message.sender.label}; shift=${message.modifiers.shift}`);}
    undo(node){node.SET('document.title','Working document');node.SET('document.result','Undo received by the central content');}
    toggleDetails(node){const visible=!node.GET('document.details');node.SET('document.details',visible);node.SET('document.result',`Details ${visible ? 'shown' : 'hidden'}`);}
    exportDocument(node,message){node.SET('document.result',`Export ${message.parameters.format} for document ${message.parameters.id}`);}
}
