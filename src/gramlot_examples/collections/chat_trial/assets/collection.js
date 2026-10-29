var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// collections/chat-trial.js
import { Bag } from "@gramlot/gramlot";

// collection-authoring:@gramlot/gramlot/components
var components_exports = {};
__export(components_exports, {
  defineCollection: () => defineCollection
});
__reExport(components_exports, components_star);
import * as components_star from "@gramlot/gramlot/components";
import { defineCollection as create } from "@gramlot/gramlot/components";
function defineCollection(options) {
  if (options.name !== "chat-trial") throw new Error("Unexpected bundled collection");
  const css = [], assets = {};
  options.css?.forEach((url, index) => {
    url.href = css[index].href;
  });
  for (const [key, url] of Object.entries(options.assets ?? {})) url.href = assets[key].href;
  return create({ ...options, css, assets });
}

// collections/chat-trial.js
var ChatMessages = (0, components_exports.defineComponent)({
  name: "chatMessages",
  tag: "gramlot-chat-messages",
  base: (Element) => Element,
  bagStore: true,
  parameters: { storepath: { dtype: "T" } },
  implementation: (Base) => class extends Base {
    #store;
    #rows = /* @__PURE__ */ new Map();
    #scheduled = false;
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      const style = this.ownerDocument.createElement("style");
      style.textContent = `
                :host{display:block;height:100%;min-height:0;color:var(--gramlot-chat-ink,var(--gramlot-ink,CanvasText));font:inherit}
                *{box-sizing:border-box}
                .log{height:100%;overflow:auto;overscroll-behavior:contain;padding:26px max(24px,calc((100% - 880px)/2));scrollbar-gutter:stable}
                article{width:100%;margin:0 0 34px;padding:0;border:0;background:transparent}
                article[data-role=user]{width:fit-content;margin-left:auto;max-width:85%;padding:13px 20px;border-radius:23px;background:var(--gramlot-chat-bubble,var(--gramlot-surface-subtle,#f2f4f7))}
                .author{font-size:11px;font-weight:500;color:var(--gramlot-chat-muted,var(--gramlot-text-secondary,GrayText));margin-bottom:9px}
                article[data-role=user] .author{display:none}
                .text{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.75;font-size:16px}
                img{display:block;max-width:100%;height:auto;margin-top:18px;border-radius:16px}
                .empty{max-width:720px;margin:16vh auto;text-align:center;color:var(--gramlot-chat-muted,var(--gramlot-text-secondary,GrayText));line-height:1.7}
                .empty strong{display:block;font-size:1.8em;font-weight:500;color:var(--gramlot-chat-ink,var(--gramlot-ink,CanvasText));margin-bottom:12px}
                @media(max-width:600px){.log{padding:20px 18px}article{margin-bottom:26px}article[data-role=user]{max-width:92%;padding:12px 16px}.text{font-size:15px}.empty{margin-top:12vh}}
            `;
      this.log = this.ownerDocument.createElement("div");
      this.log.className = "log";
      this.log.tabIndex = 0;
      this.log.setAttribute("role", "log");
      this.log.setAttribute("aria-label", "Conversation messages");
      this.log.setAttribute("aria-live", "polite");
      this.log.setAttribute("aria-relevant", "additions text");
      this.empty = this.ownerDocument.createElement("div");
      this.empty.className = "empty";
      const title = this.ownerDocument.createElement("strong");
      title.textContent = "What would you like to create?";
      this.empty.append(title, "Ask a question or describe an image. Use the gear to customize this chat.");
      this.log.append(this.empty);
      shadow.append(style, this.log);
    }
    projectAttributes({ storepath, ...attrs }) {
      return attrs;
    }
    setStoreBag(bag) {
      if (!(bag instanceof Bag)) throw new TypeError("chatMessages storepath must resolve to a Bag");
      this.#store = bag;
      this.#schedule();
    }
    connectedCallback() {
      this.#schedule();
    }
    #schedule() {
      if (this.#scheduled) return;
      this.#scheduled = true;
      queueMicrotask(() => {
        this.#scheduled = false;
        if (this.isConnected && this.#store) this.#render();
      });
    }
    #render() {
      const follow = this.log.scrollHeight - this.log.clientHeight - this.log.scrollTop < 48;
      const nodes = this.#store.getNodes();
      for (const node of nodes) {
        if (typeof node.staticValue !== "string" || !["user", "assistant"].includes(node.attr.role) || typeof node.attr.author !== "string") {
          throw new TypeError("Chat messages require string text, role user/assistant and an author");
        }
        if (node.attr.image !== void 0 && (typeof node.attr.image !== "string" || !/^[A-Za-z0-9+/]+={0,2}$/.test(node.attr.image))) {
          throw new TypeError("Chat image must be PNG base64");
        }
      }
      const labels = new Set(nodes.map((node) => node.label));
      for (const [label, row] of this.#rows) if (!labels.has(label)) {
        row.remove();
        this.#rows.delete(label);
      }
      this.empty.hidden = nodes.length !== 0;
      let previous = this.empty;
      for (const node of nodes) {
        let row = this.#rows.get(node.label);
        if (!row) {
          row = this.ownerDocument.createElement("article");
          const author = this.ownerDocument.createElement("div");
          author.className = "author";
          const text = this.ownerDocument.createElement("div");
          text.className = "text";
          row.append(author, text);
          this.#rows.set(node.label, row);
        }
        row.dataset.role = node.attr.role;
        if (row.firstChild.textContent !== node.attr.author) row.firstChild.textContent = node.attr.author;
        if (row.children[1].textContent !== node.staticValue) row.children[1].textContent = node.staticValue;
        let image = row.querySelector("img");
        if (node.attr.image !== void 0) {
          if (!image) {
            image = this.ownerDocument.createElement("img");
            image.width = 1024;
            image.height = 1024;
            row.append(image);
          }
          const src = `data:image/png;base64,${node.attr.image}`;
          if (image.getAttribute("src") !== src) image.setAttribute("src", src);
          image.alt = node.staticValue;
        } else if (image) image.remove();
        if (previous.nextSibling !== row) this.log.insertBefore(row, previous.nextSibling);
        previous = row;
      }
      if (follow) this.log.scrollTop = this.log.scrollHeight;
    }
  }
});
var chat_trial_default = defineCollection({ name: "chat-trial", components: [ChatMessages], registerCommands(gramlot) {
  const chat = gramlot.commands.registerGroup("chat", { author: "Gramlot examples" });
  for (const [name, label, icon] of [
    ["sendMessage", "Send", "\u2191"],
    ["clearDraft", "Clear draft", "\u232B"],
    ["newConversation", "New conversation", "+"],
    ["toggleContext", "Settings", "\u2699"]
  ]) chat.register(name, { label, icon, publish: name });
} });
export {
  ChatMessages,
  chat_trial_default as default
};
