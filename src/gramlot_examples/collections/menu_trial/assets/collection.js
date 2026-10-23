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

// collection-authoring:@gramlot/gramlot/components
var components_exports = {};
__export(components_exports, {
  defineCollection: () => defineCollection
});
__reExport(components_exports, components_star);
import * as components_star from "@gramlot/gramlot/components";
import { defineCollection as create } from "@gramlot/gramlot/components";
function defineCollection(options) {
  if (options.name !== "menu-trial") throw new Error("Unexpected bundled collection");
  const css = [], assets = {};
  options.css?.forEach((url, index) => {
    url.href = css[index].href;
  });
  for (const [key, url] of Object.entries(options.assets ?? {})) url.href = assets[key].href;
  return create({ ...options, css, assets });
}

// collections/menu-trial.js
var menu_trial_default = defineCollection({ name: "menu-trial", components: [], registerCommands(gramlot) {
  const commands = gramlot.commands.registerGroup("documenti", { author: "Gramlot examples" });
  commands.register("save", { label: "Save", icon: "\u{1F4BE}", publish: "save" });
  commands.register("undo", { label: "Undo", icon: "\u21B6", publish: "undo" });
  commands.register("toggleDetails", { label: "Details", icon: "\u2630", publish: "toggleDetails" });
  commands.register("export", { label: "Export", icon: "\u2193", publish: "export" });
} });
export {
  menu_trial_default as default
};
