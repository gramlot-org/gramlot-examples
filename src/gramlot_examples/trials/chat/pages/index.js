/** Shared chat behavior; only AI-specific controls belong to this Page. */
import {chatRender, chatSend, chatCompleted, chatReset, chatResize, chatPickAttachments, chatRenderAttachments, chatRemoveAttachment} from '@gramlot/gramlot';
export class Logic {
    chatResize(node) { return chatResize(this.page,node); }
    chatPickAttachments(node) { return chatPickAttachments(this.page,node); }
    chatRenderAttachments(node,params) { return chatRenderAttachments(this.page,node,params); }
    chatRemoveAttachment(node) { return chatRemoveAttachment(this.page,node); }
    chatRender(node, params) { return chatRender(this.page, node, params); }
    chatSend(node) { return chatSend(this.page, node); }
    chatCompleted(node, params) { return chatCompleted(this.page, node, params); }
    chatReset(node) { return chatReset(this.page, node); }
    modelChanged(node) { node.SET('.settings.effort', 'default'); }
    clearDraft(node) { node.SET('.draft', ''); }
    toggleContext(node) { node.SET('.contextOpen', !node.getRelativeData('.contextOpen')); }
}
